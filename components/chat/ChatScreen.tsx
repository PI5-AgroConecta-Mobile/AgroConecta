import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';

type ChatMessage = {
  id: string;
  text: string;
  userId: string;
  userName?: string;
  createdAt: string;
};

type ChatScreenProps = {
  roomId?: string; // optional: defaults to 'global'
  placeholder?: string;
};

export default function ChatScreen({ roomId, placeholder }: ChatScreenProps) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugLines, setDebugLines] = useState<string[]>([]);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const effectiveRoomId = roomId || 'global';

  const pushDebug = useCallback((line: string) => {
    if (!__DEV__) return; // only collect in development
    setDebugLines(prev => {
      const next = [...prev, `${new Date().toLocaleTimeString()} ${line}`];
      // keep last 30 lines
      return next.slice(-30);
    });
  }, []);

  useEffect(() => {
    if (!token || !user) return;
    const socket = getSocket(token);

    const onConnect = () => {
      setConnecting(false);
      socket.emit('chat:join', { roomId: effectiveRoomId, userId: user.id, userName: user.name });
      socket.emit('chat:history', { roomId: effectiveRoomId });
      pushDebug('[chat] connected');
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

    // Normalize message payloads coming from different backend shapes
    const normalizeMessage = (raw: any): ChatMessage | null => {
      if (!raw) return null;
      const id = String(raw.id || raw._id || `${raw.userId || raw.senderId || 'unknown'}-${raw.createdAt || Date.now()}`);
      const text = String(raw.text || raw.message || raw.body || '');
      const userId = String(raw.userId || raw.senderId || raw.from || raw.user?.id || '');
      const userName = raw.userName || raw.user?.name || raw.name || undefined;
      const createdAt = new Date(raw.createdAt || raw.timestamp || Date.now()).toISOString();
      if (!text || !userId) return null;
      return { id, text, userId, userName, createdAt };
    };

    const onHistory = (history: any[]) => {
      console.log('[chat] history received', Array.isArray(history) ? history.length : typeof history);
      pushDebug(`[chat] history received: ${Array.isArray(history) ? history.length : 0}`);
      const normalized = (Array.isArray(history) ? history : []).map(normalizeMessage).filter(Boolean) as ChatMessage[];
      setMessages(normalized.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: false }));
    };

    const onIncoming = (raw: any) => {
      const msg = normalizeMessage(raw);
      if (!msg) {
        console.warn('[chat] received invalid message payload', raw);
        pushDebug('[chat] invalid incoming payload');
        return;
      }
      console.log('[chat] incoming message', msg.text);
      pushDebug(`[chat] incoming: ${msg.text.substring(0, 40)}`);
      setMessages(prev => [...prev, msg]);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    // Primary event names
    socket.on('chat:history', onHistory);
    socket.on('chat:message', onIncoming);
    // Common alternates used by some servers
    socket.on('history', onHistory);
    socket.on('messages', onHistory);
    socket.on('message', onIncoming);
    socket.on('new-message', onIncoming);
    socket.on('chat_message', onIncoming);

    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('chat:history', onHistory);
      socket.off('chat:message', onIncoming);
      socket.off('history', onHistory);
      socket.off('messages', onHistory);
      socket.off('message', onIncoming);
      socket.off('new-message', onIncoming);
      socket.off('chat_message', onIncoming);
    };
  }, [token, user, effectiveRoomId]);

  const canSend = useMemo(() => input.trim().length > 0 && !!user, [input, user]);

  const send = useCallback(() => {
    const socket = getSocket();
    if (!canSend || !user) {
      console.warn('[chat] send blocked', {
        reason: !user ? 'no-user' : (input.trim().length === 0 ? 'empty-text' : 'unknown'),
        socketConnected: socket.connected,
      });
      return;
    }
    const text = input.trim();
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      text,
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setInput('');

    console.log('[chat] sending message', { roomId: effectiveRoomId, textLength: text.length, socketConnected: socket.connected });
    pushDebug(`[chat] sending (${text.length} chars), connected=${socket.connected}`);
    socket.emit('chat:message', {
      roomId: effectiveRoomId,
      text,
      userId: user.id,
      userName: user.name,
      createdAt: optimistic.createdAt,
    }, (ack: any) => {
      console.log('[chat] server ack for sent message', ack);
      pushDebug('[chat] server ack received');
    });

    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, [canSend, input, user, effectiveRoomId]);

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
        {connecting && (
          <View style={styles.connecting}>
            <ActivityIndicator color="#283618" />
            <Text style={styles.connectingText}>Conectando ao chat...</Text>
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


