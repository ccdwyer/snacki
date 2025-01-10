import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: Platform.select({
                    ios: 'slide_from_right',
                    android: 'slide_from_right',
                    default: 'none',
                }),
                presentation: 'card',
            }}>
            <Stack.Screen
                name="index"
                options={{
                    animation: 'none',
                }}
            />
            <Stack.Screen
                name="reset-password"
                options={{
                    animation: 'none',
                }}
            />
            <Stack.Screen
                name="forgot-password"
                options={{
                    animation: 'slide_from_right',
                }}
            />
            <Stack.Screen
                name="sign-in"
                options={{
                    animation: 'slide_from_right',
                }}
            />
            <Stack.Screen
                name="create-account"
                options={{
                    animation: 'slide_from_right',
                }}
            />
        </Stack>
    );
}
