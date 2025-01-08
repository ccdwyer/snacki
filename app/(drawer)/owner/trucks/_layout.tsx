import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const theme = useTheme();
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Trucks',
                    headerLeft: () => <DrawerToggleButton tintColor={theme.colors.primary} />,
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Truck Form',
                }}
            />
            <Stack.Screen
                name="[id]/menu"
                options={{
                    title: 'Truck Form',
                }}
            />
        </Stack>
    );
}
