import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const theme = useTheme();
    return (
        <Stack>
            <Stack.Screen
                name="owner"
                options={{
                    title: 'Company Profile',
                    headerLeft: () => <DrawerToggleButton tintColor={theme.colors.primary} />,
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/employees"
                options={{
                    title: 'Employees',
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/invite-employee"
                options={{
                    title: 'Invite Employee',
                }}
            />
            <Stack.Screen
                name="owner/companies/create"
                options={{
                    title: 'Create Company',
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/trucks"
                options={{
                    title: 'Trucks',
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/trucks/[truckId]"
                options={{
                    title: 'Truck Form',
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/trucks/[truckId]/menu/[menuId]"
                options={{
                    title: 'Menu Details',
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/trucks/[truckId]/menu/create"
                options={{
                    title: 'Edit Menu',
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/trucks/[truckId]/menu/[menuId]/edit"
                options={{
                    title: 'Edit Menu',
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/trucks/create"
                options={{
                    title: 'Create Truck',
                }}
            />
            <Stack.Screen
                name="owner/companies/[companyId]/trucks/[truckId]/edit"
                options={{
                    title: 'Update Truck',
                }}
            />
        </Stack>
    );
}
