import { Tabs } from 'expo-router';

import { TabBarIcon } from '~/components/TabBarIcon';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#00D6C8',
            }}>
            <Tabs.Screen
                name="(map)"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
                }}
            />
            <Tabs.Screen
                name="trucks"
                options={{
                    title: 'Trucks',
                    tabBarIcon: ({ color }) => <TabBarIcon name="truck" color={color} />,
                }}
            />

            <Tabs.Screen
                name="(account)"
                options={{
                    title: 'Book a Truck',
                    tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
                }}
            />

            <Tabs.Screen
                name="conversations"
                options={{
                    title: 'Conversations',
                    tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} />,
                }}
            />
        </Tabs>
    );
}
