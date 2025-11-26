import api from './api';

export interface Conversation {
  id: string;
  participantIds: string[];
  participants?: Array<{
    id: string;
    name: string;
    email: string;
    imgUrl?: string | null;
  }>;
  lastMessage?: {
    id: string;
    text: string;
    userId: string;
    createdAt: string;
  };
  updatedAt: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName?: string;
  createdAt: string;
  roomId?: string;
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await api.get('/conversations');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
  }
}

/**
 * Get or create a conversation with a specific user
 */
export async function getOrCreateConversationWithUser(userId: string): Promise<Conversation> {
  try {
    const response = await api.get(`/conversations/with/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting/creating conversation:', error);
    throw new Error(error.response?.data?.message || 'Failed to get/create conversation');
  }
}

/**
 * Get messages for a specific conversation
 */
export async function getConversationMessages(conversationId: string, limit?: number): Promise<ChatMessage[]> {
  try {
    const params = limit ? { limit } : {};
    const response = await api.get(`/conversations/${conversationId}/messages`, { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
}

