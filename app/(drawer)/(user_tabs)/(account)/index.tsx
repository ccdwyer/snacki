import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';

export default function EventForm() {
    return (
        <>
            <Stack.Screen options={{ title: 'Events' }} />
            <Container>
                <Text>Account</Text>
            </Container>
        </>
    );
}
