import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ChatScreen from '../../../components/chat/ChatScreen';
import ConversationsList from '../../../components/chat/ConversationsList';
import UserSearchModal from '../../../components/chat/UseSearchModal';

export default function FarmerChatTab() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const conversationId = params.conversationId as string | undefined;
  const toUserId = params.toUserId as string | undefined;
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  // If we have a conversation ID or user ID, show the chat screen
  if (conversationId || toUserId) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Chat',
            headerShown: true,
            headerStyle: { backgroundColor: '#283618' },
            headerTintColor: '#FEFAE0',
            
          }}
        />
        <ChatScreen
          conversationId={conversationId}
          toUserId={toUserId}
          otherUserName={params.otherUserName as string | undefined}
        />
      </>
    );
  }

  // Otherwise show the conversations list
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Conversas',
          headerShown: true,
          headerStyle: { backgroundColor: '#283618' },
          headerTintColor: '#FEFAE0',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setSearchModalVisible(true)}
              style={styles.addButton}
            >
              <Ionicons name="add" size={28} color="#FEFAE0" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <ConversationsList
          onSelectConversation={(conversation) => {
            router.push({
              pathname: '/(farmer)/(tabs)/chat',
              params: { conversationId: conversation.id },
            });
          }}
        />
        <UserSearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSelectUser={(user: any) => {
            router.push({
              pathname: '/(farmer)/(tabs)/chat',
              params: {
                toUserId: user.id,
                otherUserName: user.farmName || user.name,
              },
            });
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
  },
  addButton: {
    marginRight: 8,
    padding: 4,
  },
});