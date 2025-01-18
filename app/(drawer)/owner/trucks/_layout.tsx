import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';

export default function TabLayout() {
    const theme = useTheme();
    const router = useRouter();
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
                name="[id]/menu/[menuId]"
                options={{
                    title: 'Menu Details',
                }}
            />
            <Stack.Screen
                name="[id]/menu/create"
                options={{
                    title: 'Edit Menu',
                }}
            />
            <Stack.Screen
                name="[id]/menu/[menuId]/edit"
                options={{
                    title: 'Edit Menu',
                }}
            />
            <Stack.Screen
                name="create"
                options={{
                    title: 'Create Truck',
                }}
            />
            <Stack.Screen
                name="[id]/edit"
                options={{
                    title: 'Update Truck',
                }}
            />
        </Stack>
    );
}
