import { useTheme } from '@react-navigation/native';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '~/components/TabBarIcon';

export default function TabLayout() {
    const theme = useTheme();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
            }}>
            <Tabs.Screen
                name="trucks"
                options={{
                    title: 'Trucks',
                    tabBarIcon: ({ color }) => <TabBarIcon name="truck" color={color} />,
                }}
            />
            <Tabs.Screen
                name="(events)"
                options={{
                    title: 'Events',
                    tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
                }}
            />
            <Tabs.Screen
                name="(messages)"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} />,
                }}
            />
        </Tabs>
    );
}
