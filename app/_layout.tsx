import 'expo-dev-client';
import '../global.css';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { PermanentMarker_400Regular, useFonts } from '@expo-google-fonts/permanent-marker';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { useFetchGlobalData } from '~/atoms/GlobalDataAtoms';
import { QueryClientProvider } from '~/clients/query';
import { ThemeToggle } from '~/components/ThemeToggle';
import { useDeepLinks } from '~/hooks/useDeepLinks';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Configure deep linking
export const scheme = 'snacki';

// Configure routes that can be deep linked to
export const linking = {
    prefixes: ['snacki://', 'https://snackiapp.com'],
    config: {
        initialRouteName: '(drawer)',
        screens: {
            '(drawer)': {
                screens: {
                    auth: {
                        screens: {
                            'reset-password': 'auth/reset-password',
                            'forgot-password': 'auth/forgot-password',
                            'sign-in': 'auth/sign-in',
                            'create-account': 'auth/create-account',
                            index: '',
                        },
                    },
                },
            },
        },
    },
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useInitialAndroidBarSync();
    useDeepLinks();
    useFetchGlobalData();
    const { colorScheme, isDarkColorScheme } = useColorScheme();

    const [loaded, error] = useFonts({
        PermanentMarker_400Regular,
        Bubble: require('~/assets/fonts/Bubble.otf'),
        Phoria: require('~/assets/fonts/Phoria.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <>
            <StatusBar
                key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
                style={isDarkColorScheme ? 'light' : 'dark'}
            />
            {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
            {/* <ExampleProvider> */}
            <QueryClientProvider>
                <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <BottomSheetModalProvider>
                            <ActionSheetProvider>
                                <NavThemeProvider value={NAV_THEME[colorScheme]}>
                                    <Stack screenOptions={SCREEN_OPTIONS}>
                                        <Stack.Screen name="(drawer)" options={DRAWER_OPTIONS} />
                                        <Stack.Screen name="modal" options={MODAL_OPTIONS} />
                                    </Stack>
                                    <PortalHost />
                                </NavThemeProvider>
                            </ActionSheetProvider>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </KeyboardProvider>
            </QueryClientProvider>
            {/* </ExampleProvider> */}
        </>
    );
}

const SCREEN_OPTIONS = {
    animation: 'ios_from_right', // for android
} as const;

const DRAWER_OPTIONS = {
    headerShown: false,
} as const;

const MODAL_OPTIONS = {
    presentation: 'modal',
    animation: 'fade_from_bottom', // for android
    title: 'Settings',
    headerRight: () => <ThemeToggle />,
} as const;
