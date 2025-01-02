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
          title: 'Account',
        }}
      />
      <Stack.Screen
        name="create_account"
        options={{
          title: 'Create Account',
        }}
      />
    </Stack>
  );
}
