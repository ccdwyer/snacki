import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function EventForm() {
    return (
        <>
            <Stack.Screen options={{ title: 'Truck Form' }} />
            <Container>
                <ScreenContent
                    path="app/(drawer)/(truck_management_tabs)/(trucks)/truck_form.tsx"
                    title="Truck Form"
                />
            </Container>
        </>
    );
}
