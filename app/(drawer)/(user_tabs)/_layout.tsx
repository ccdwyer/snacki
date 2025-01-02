import { Tabs } from 'expo-router';

import { TabBarIcon } from '~/components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FE5161',
      }}>
      <Tabs.Screen
        name="(map)"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(trucks)"
        options={{
          title: 'Trucks',
          tabBarIcon: ({ color }) => <TabBarIcon name="truck" color={color} />,
        }}
      />

      <Tabs.Screen
        name="(messages)"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
