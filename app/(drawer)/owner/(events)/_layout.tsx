import { Stack } from 'expo-router';

export default function TabLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Messages',
                }}
            />
            <Stack.Screen
                name="event_form"
                options={{
                    title: 'Event Form',
                }}
            />
        </Stack>
    );
}
