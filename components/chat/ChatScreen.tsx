import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage, getConversationMessages, getOrCreateConversationWithUser } from '../../services/chatService';
import { getSocket } from '../../services/socket';

type ChatScreenProps = {
  conversationId?: string; // Conversation ID (preferred)
  toUserId?: string; // User ID to chat with (will get/create conversation)
  placeholder?: string;
  otherUserName?: string; // Optional: name of the other user for display
};

export default function ChatScreen({ conversationId, toUserId, placeholder, otherUserName }: ChatScreenProps) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [connecting, setConnecting] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugLines, setDebugLines] = useState<string[]>([]);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  // Track optimistic message IDs to prevent duplicates
  const optimisticMessageIds = useRef<Set<string>>(new Set());

  const pushDebug = useCallback((line: string) => {
    if (!__DEV__) return; // only collect in development
    setDebugLines(prev => {
      const next = [...prev, `${new Date().toLocaleTimeString()} ${line}`];
      // keep last 30 lines
      return next.slice(-30);
    });
  }, []);

  // Update conversationId when prop changes
  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
      setCurrentConversationId(conversationId);
      setMessages([]); // Clear messages when switching conversations
      optimisticMessageIds.current.clear();
    }
  }, [conversationId]);

  // Initialize conversation if toUserId is provided
  useEffect(() => {
    if (!toUserId || currentConversationId) return;
    
    const initConversation = async () => {
      try {
        setLoadingMessages(true);
        const conversation = await getOrCreateConversationWithUser(toUserId);
        setCurrentConversationId(conversation.id);
        pushDebug(`[chat] conversation initialized: ${conversation.id}`);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize conversation');
        console.error('Error initializing conversation:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    initConversation();
  }, [toUserId, currentConversationId, pushDebug]);

  // Load messages and setup socket when conversation is ready
  useEffect(() => {
    if (!token || !user || !currentConversationId) return;
    
    const socket = getSocket(token);

    const onConnect = async () => {
      setConnecting(false);
      // Join the conversation room
      socket.emit('chat:join', { roomId: currentConversationId });
      pushDebug(`[chat] connected and joined room: ${currentConversationId}`);
      
      // Load message history via REST API first
      try {
        setLoadingMessages(true);
        const history = await getConversationMessages(currentConversationId, 50);
        setMessages(history.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: false }));
        pushDebug(`[chat] loaded ${history.length} messages from API`);
      } catch (err: any) {
        console.error('Error loading messages:', err);
        // Fallback to socket history
        socket.emit('chat:history', { roomId: currentConversationId });
      } finally {
        setLoadingMessages(false);
      }
    };

    const onDisconnect = () => {
      setConnecting(true);
      pushDebug('[chat] disconnected');
    };

    const onConnectError = (err: any) => {
      setError(err?.message || 'Falha ao conectar ao chat');
      setConnecting(false);
      pushDebug(`[chat] connect_error: ${err?.message || 'unknown'}`);
    };

    // Normalize message payloads
    const normalizeMessage = (raw: any): ChatMessage | null => {
      if (!raw) return null;
      const id = String(raw.id || raw._id || `${raw.userId || raw.senderId || 'unknown'}-${raw.createdAt || Date.now()}`);
      const text = String(raw.text || raw.message || raw.body || '');
      const userId = String(raw.userId || raw.senderId || raw.from || raw.user?.id || '');
      const userName = raw.userName || raw.user?.name || raw.name || undefined;
      const createdAt = new Date(raw.createdAt || raw.timestamp || Date.now()).toISOString();
      const roomId = raw.roomId || currentConversationId || undefined;
      if (!text || !userId) return null;
      return { id, text, userId, userName, createdAt, roomId };
    };

    const onHistory = (history: any[]) => {
      console.log('[chat] history received via socket', Array.isArray(history) ? history.length : typeof history);
      pushDebug(`[chat] socket history received: ${Array.isArray(history) ? history.length : 0}`);
      const normalized = (Array.isArray(history) ? history : []).map(normalizeMessage).filter(Boolean) as ChatMessage[];
      setMessages(prev => {
        // Merge with existing messages, avoiding duplicates
        const existingIds = new Set(prev.map(m => m.id));
        const newMessages = normalized.filter(m => !existingIds.has(m.id));
        const merged = [...prev, ...newMessages];
        return merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: false }));
    };

    const onIncoming = (raw: any) => {
      const msg = normalizeMessage(raw);
      if (!msg) {
        console.warn('[chat] received invalid message payload', raw);
        pushDebug('[chat] invalid incoming payload');
        return;
      }

      // Check if this message is for the current conversation
      if (msg.roomId && msg.roomId !== currentConversationId) {
        pushDebug(`[chat] message for different room: ${msg.roomId}`);
        return;
      }

      // Deduplication: Check if we already have this message
      // (either from optimistic update or from a previous socket event)
      setMessages(prev => {
        const exists = prev.some(m => m.id === msg.id);
        if (exists) {
          pushDebug(`[chat] duplicate message ignored: ${msg.id}`);
          return prev;
        }

        // If this is our own message and we have an optimistic version, replace it
        if (msg.userId === user.id && optimisticMessageIds.current.has(msg.id)) {
          optimisticMessageIds.current.delete(msg.id);
          pushDebug(`[chat] replacing optimistic message: ${msg.id}`);
          return prev.map(m => (m.id === msg.id || (m.id.startsWith('local-') && m.text === msg.text && m.userId === msg.userId)) ? msg : m);
        }

        console.log('[chat] incoming message', msg.text);
        pushDebug(`[chat] incoming: ${msg.text.substring(0, 40)}`);
        return [...prev, msg];
      });
      
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('chat:history', onHistory);
    socket.on('chat:message', onIncoming);

    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('chat:history', onHistory);
      socket.off('chat:message', onIncoming);
    };
  }, [token, user, currentConversationId, pushDebug]);

  const canSend = useMemo(() => {
    return input.trim().length > 0 && !!user && !!currentConversationId && !loadingMessages;
  }, [input, user, currentConversationId, loadingMessages]);

  const send = useCallback(() => {
    const socket = getSocket();
    if (!canSend || !user || !currentConversationId) {
      console.warn('[chat] send blocked', {
        reason: !user ? 'no-user' : !currentConversationId ? 'no-conversation' : (input.trim().length === 0 ? 'empty-text' : 'unknown'),
        socketConnected: socket.connected,
      });
      return;
    }
    
    const text = input.trim();
    const tempId = `local-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      text,
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
      roomId: currentConversationId,
    };
    
    // Track optimistic message ID for deduplication
    optimisticMessageIds.current.add(tempId);
    
    setMessages(prev => [...prev, optimistic]);
    setInput('');

    console.log('[chat] sending message', { 
      conversationId: currentConversationId, 
      textLength: text.length, 
      socketConnected: socket.connected 
    });
    pushDebug(`[chat] sending (${text.length} chars), connected=${socket.connected}`);
    
    // Send using conversationId (roomId) or toUserId
    const messagePayload: { toUserId?: string; roomId?: string; text: string } = {
      text,
    };
    
    if (currentConversationId) {
      messagePayload.roomId = currentConversationId;
    } else if (toUserId) {
      messagePayload.toUserId = toUserId;
    }

    socket.emit('chat:message', messagePayload, (ack: any) => {
      console.log('[chat] server ack for sent message', ack);
      pushDebug('[chat] server ack received');
      // If server returns the message with a real ID, we can update it
      if (ack && ack.id) {
        setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: ack.id } : m));
        optimisticMessageIds.current.delete(tempId);
        if (ack.id) optimisticMessageIds.current.add(ack.id);
      }
    });

    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, [canSend, input, user, currentConversationId, toUserId]);

  const onPressSend = useCallback(() => {
    console.log('[chat] send button pressed');
    send();
  }, [send]);

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isOwn = item.userId === user?.id;
    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        {!!item.userName && !isOwn && <Text style={styles.userName}>{item.userName}</Text>}
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.listContainer}>
        {(connecting || loadingMessages) && (
          <View style={styles.connecting}>
            <ActivityIndicator color="#283618" />
            <Text style={styles.connectingText}>
              {loadingMessages ? 'Carregando mensagens...' : 'Conectando ao chat...'}
            </Text>
          </View>
        )}
        {!currentConversationId && !toUserId && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              Nenhuma conversa selecionada. Selecione uma conversa ou um usuário para iniciar o chat.
            </Text>
          </View>
        )}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => {
                setError(null);
                setConnecting(true);
                const s = getSocket(token || undefined);
                if (!s.connected) s.connect();
              }}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <TouchableOpacity onPress={() => setDebugOpen(v => !v)} style={styles.debugToggle}>
              <Text style={styles.debugToggleText}>{debugOpen ? 'Esconder Logs' : 'Mostrar Logs'}</Text>
            </TouchableOpacity>
            {debugOpen && (
              <View style={styles.debugPanel}>
                {debugLines.map((l, i) => (
                  <Text key={`dbg-${i}`} style={styles.debugLine}>{l}</Text>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder || 'Digite sua mensagem...'}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity onPress={onPressSend} disabled={!canSend} style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 4,
  },
  connecting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    alignSelf: 'center',
  },
  connectingText: {
    color: '#283618',
  },
  errorBox: {
    backgroundColor: '#ffe4e6',
    borderColor: '#ff717c',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#b4232c',
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#283618',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: '#FEFAE0',
    fontWeight: 'bold',
  },
  bubble: {
    maxWidth: '85%',
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bubbleOwn: {
    alignSelf: 'flex-end',
    backgroundColor: '#606C38',
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#A9B388',
  },
  userName: {
    fontSize: 12,
    color: '#283618',
    marginBottom: 2,
    opacity: 0.9,
  },
  messageText: {
    color: '#FEFAE0',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#FFF',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  sendButton: {
    backgroundColor: '#283618',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#A9B388',
  },
  sendText: {
    color: '#FEFAE0',
    fontWeight: 'bold',
  },
  // Dev-only debug styles
  debugContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  debugToggle: {
    alignSelf: 'center',
    backgroundColor: '#283618',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  debugToggleText: {
    color: '#FEFAE0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugPanel: {
    marginTop: 6,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
    borderRadius: 6,
    padding: 8,
  },
  debugLine: {
    fontSize: 12,
    color: '#283618',
    marginBottom: 2,
  },
});


