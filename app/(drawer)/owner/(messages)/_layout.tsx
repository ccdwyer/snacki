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
                name="conversation"
                options={{
                    title: 'Conversation',
                }}
            />
        </Stack>
    );
}
