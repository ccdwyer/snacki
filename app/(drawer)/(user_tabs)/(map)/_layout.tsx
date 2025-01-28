import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const theme = useTheme();

    return (
        <APIProvider apiKey={process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? ''}>
            <Stack
                screenOptions={{
                    headerShown: true,
                }}>
                <Stack.Screen
                    name="index"
                    options={{
                        headerLeft: () => <DrawerToggleButton tintColor={theme.colors.primary} />,
                        title: 'Trucks',
                    }}
                />
            </Stack>
        </APIProvider>
    );
}
