import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function MenuScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Menu' }} />
            <Container>
                <ScreenContent
                    path="app/(drawer)/(truck_management_tabs)/(trucks)/menu.tsx"
                    title="Menu"
                />
            </Container>
        </>
    );
}
