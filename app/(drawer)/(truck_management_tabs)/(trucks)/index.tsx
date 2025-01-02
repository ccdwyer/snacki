import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function EventForm() {
  return (
    <>
      <Stack.Screen options={{ title: 'Truck List' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(truck_management_tabs)/(trucks)/index.tsx" title="Truck List" />
      </Container>
    </>
  );
}