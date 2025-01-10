import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const theme = useTheme();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
            }}>
            <Stack.Screen
                name="index"
                options={{
                    headerLeft: () => <DrawerToggleButton tintColor={theme.colors.primary} />,
                    title: 'Trucks',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Truck Details',
                }}
            />
            <Stack.Screen
                name="[id]/menu"
                options={{
                    title: 'Truck Menu',
                }}
            />
        </Stack>
    );
}