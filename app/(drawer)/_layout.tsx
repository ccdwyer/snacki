import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Platform } from 'react-native';

import { HeaderButton } from '../../components/HeaderButton';

import { useUserAtom } from '~/atoms/AuthentictionAtoms';

const DrawerLayout = () => {
    const [user] = useUserAtom();
    return (
        <Drawer>
            <Drawer.Screen
                name="(user_tabs)"
                options={{
                    headerShown: false,
                    headerTitle: 'Find Trucks',
                    drawerLabel: 'Find Trucks',
                    drawerIcon: ({ size, color }) => (
                        <MaterialIcons name="search" size={size} color={color} />
                    ),
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <HeaderButton />
                        </Link>
                    ),
                }}
            />
            <Drawer.Screen
                name="owner"
                options={{
                    headerShown: false,
                    headerTitle: 'Company Management',
                    drawerLabel: 'Company Management',
                    drawerItemStyle: user ? {} : { display: 'none' },
                    drawerIcon: ({ size, color }) => (
                        <MaterialIcons name="drive-eta" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="index"
                options={{
                    headerTitle: 'Home',
                    drawerLabel: 'Home',
                    drawerItemStyle: user ? {} : { display: 'none' },
                    headerShown: Platform.OS !== 'web',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="auth"
                options={{
                    headerTitle: 'User',
                    drawerLabel: user ? 'User' : 'Sign In',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
};

export default DrawerLayout;
