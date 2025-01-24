import * as NavigationBar from 'expo-navigation-bar';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform } from 'react-native';

import { COLORS } from '~/theme/colors';

function useColorScheme() {
    const { colorScheme, setColorScheme: setNativeWindColorScheme } = useNativewindColorScheme();

    // useEffect(() => {
    //     if (Platform.OS !== 'web') return;

    //     if (window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false) {
    //         setNativeWindColorScheme('dark');
    //     } else {
    //         setNativeWindColorScheme('light');
    //     }

    //     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    //         const newColorScheme = event.matches ? 'dark' : 'light';
    //         setNativeWindColorScheme(newColorScheme);
    //     });
    // }, []);

    async function setColorScheme(colorScheme: 'light' | 'dark') {
        if (Platform.OS === 'web') return;
        setNativeWindColorScheme(colorScheme);
        if (Platform.OS !== 'android') return;
        try {
            await setNavigationBar(colorScheme);
        } catch (error) {
            console.error('useColorScheme.tsx", "setColorScheme', error);
        }
    }

    function toggleColorScheme() {
        return setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
    }

    return {
        colorScheme: Platform.OS === 'web' ? (window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark': 'light') : (colorScheme ?? 'light'),
        isDarkColorScheme: Platform.OS === 'web' ? window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches : colorScheme === 'dark',
        setColorScheme,
        toggleColorScheme,
        colors: COLORS[Platform.OS === 'web' ? (window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark': 'light') : (colorScheme ?? 'light')],
    };
}

/**
 * Set the Android navigation bar color based on the color scheme.
 */
function useInitialAndroidBarSync() {
    const { colorScheme } = useColorScheme();
    React.useEffect(() => {
        if (Platform.OS !== 'android') return;
        setNavigationBar(colorScheme).catch((error) => {
            console.error('useColorScheme.tsx", "useInitialColorScheme', error);
        });
    }, []);
}

export { useColorScheme, useInitialAndroidBarSync };

function setNavigationBar(colorScheme: 'light' | 'dark') {
    return Promise.all([
        NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark'),
        NavigationBar.setPositionAsync('absolute'),
        NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? '#00000030' : '#ffffff80'),
    ]);
}
