import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Conversation, getConversations } from '../../services/chatService';

type ConversationsListProps = {
  onSelectConversation?: (conversation: Conversation) => void;
};

export default function ConversationsList({ onSelectConversation }: ConversationsListProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConversations();
      setConversations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelectConversation = useCallback(
    (conversation: Conversation) => {
      if (onSelectConversation) {
        onSelectConversation(conversation);
      } else {
        // Navigate to chat screen with conversation ID
        router.push({
          pathname: '/chat/[conversationId]',
          params: { conversationId: conversation.id },
        });
      }
    },
    [onSelectConversation, router]
  );

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user || !conversation.participants) return null;
    return conversation.participants.find((p) => p.id !== user.id);
  };

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const otherUser = getOtherParticipant(item);
    const lastMessage = item.lastMessage;
    const isLastMessageFromMe = lastMessage && lastMessage.userId === user?.id;

    if (!otherUser) {
      // Skip conversations without other participant (shouldn't happen)
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handleSelectConversation(item)}
        activeOpacity={0.7}
      >
        {otherUser.imgUrl ? (
          <Image source={{ uri: otherUser.imgUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {otherUser.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName} numberOfLines={1}>
              {otherUser.name}
            </Text>
            {lastMessage && (
              <Text style={styles.timeText}>
                {formatLastMessageTime(lastMessage.createdAt)}
              </Text>
            )}
          </View>
          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {isLastMessageFromMe ? 'Você: ' : ''}
              {lastMessage.text}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#283618" />
        <Text style={styles.loadingText}>Carregando conversas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadConversations} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Nenhuma conversa ainda</Text>
        <Text style={styles.emptySubtext}>
          Inicie uma conversa com outro usuário
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshing={loading}
      onRefresh={loadConversations}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEFAE0',
  },
  loadingText: {
    marginTop: 12,
    color: '#283618',
    fontSize: 16,
  },
  errorText: {
    color: '#b4232c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#283618',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FEFAE0',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#283618',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#606C38',
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
    backgroundColor: '#FEFAE0',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#606C38',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FEFAE0',
    fontSize: 20,
    fontWeight: 'bold',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#606C38',
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: '#606C38',
  },
});

