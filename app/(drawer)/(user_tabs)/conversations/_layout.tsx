import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Stack screenOptions={{}}>
            <Stack.Screen
                name="index"
                options={{
                    headerLeft: () => <DrawerToggleButton tintColor={theme.colors.primary} />,
                    title: 'Messages',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Conversation',
                }}
            />
        </Stack>
    );
}
