import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function ConversationScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Conversation' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(truck_management_tabs)/(messages)/conversation.tsx" title="Conversation" />
      </Container>
    </>
  );
}