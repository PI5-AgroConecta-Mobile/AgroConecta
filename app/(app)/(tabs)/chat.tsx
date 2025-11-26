import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import ConversationsList from '../../../components/chat/ConversationsList';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ChatScreen from '../../../components/chat/ChatScreen';

export default function ChatTab() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const conversationId = params.conversationId as string | undefined;
  const toUserId = params.toUserId as string | undefined;

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
            headerBackTitleVisible: false,
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
        }}
      />
      <View style={styles.container}>
        <ConversationsList
          onSelectConversation={(conversation) => {
            router.push({
              pathname: '/(app)/(tabs)/chat',
              params: { conversationId: conversation.id },
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
});


