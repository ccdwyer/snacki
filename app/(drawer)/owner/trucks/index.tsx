import { Link, Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { Text } from '~/components/nativewindui/Text';

export default function EventForm() {
    return (
        <>
            <Stack.Screen options={{ title: 'Truck List' }} />
            <Container>
                <ScreenContent
                    path="app/(drawer)/(truck_management_tabs)/(trucks)/index.tsx"
                    title="Truck List"
                />
                <Link href="/owner/trucks/1/menu">
                    <Text>Menu</Text>
                </Link>
            </Container>
        </>
    );
}
