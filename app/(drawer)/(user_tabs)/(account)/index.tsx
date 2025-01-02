import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import MapView from 'react-native-maps';
export default function EventForm() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <Container>
        <MapView style={{ flex: 1 }} />
      </Container>
    </>
  );
}