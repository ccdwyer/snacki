import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function EventForm() {
    return (
        <>
            <Stack.Screen options={{ title: 'Event Form' }} />
            <Container>
                <ScreenContent
                    path="app/(drawer)/(truck_management_tabs)/(events)/event_form.tsx"
                    title="Event Form"
                />
            </Container>
        </>
    );
}
