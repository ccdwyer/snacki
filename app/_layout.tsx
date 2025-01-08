import '../global.css';
import 'expo-dev-client';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PermanentMarker_400Regular, useFonts } from '@expo-google-fonts/permanent-marker';
import { ThemeToggle } from '~/components/ThemeToggle';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useEffect } from 'react';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useInitialAndroidBarSync();
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
