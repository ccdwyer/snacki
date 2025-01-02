import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Trucks',
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          title: 'Menu',
        }}
      />
      <Stack.Screen
        name="truck_details"
        options={{
          title: 'Truck Details',
        }}
      />
    </Stack>
  );
}
