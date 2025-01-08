import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function EventForm() {
    return (
        <>
            <Stack.Screen options={{ title: 'Truck List' }} />
            <Container>
                <ScreenContent path="app/(drawer)/owner/trucks/[id]/menu.tsx" title="Truck List" />
            </Container>
        </>
    );
}
