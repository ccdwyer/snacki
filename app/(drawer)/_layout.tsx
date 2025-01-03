import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { HeaderButton } from '../../components/HeaderButton';
import { useUserAtom } from '~/stores/UserStore';

const DrawerLayout = () => {
  const [user] = useUserAtom();
  return (
    <Drawer>
      <Drawer.Screen
        name="(user_tabs)"
        options={{
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
        name="(truck_management_tabs)"
        options={{
          headerTitle: 'Truck Management',
          drawerLabel: 'Truck Management',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="drive-eta" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
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
