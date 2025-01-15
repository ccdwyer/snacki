import { useRouter, useNavigationContainerRef } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking, Platform } from 'react-native';

const RESET_PASSWORD_PATH = '/(drawer)/auth/reset-password' as const;
type NavigationParams = { pathname: typeof RESET_PASSWORD_PATH; params: Record<string, string> };

// Only handle URLs that match our deep link patterns
const isResetPasswordDeepLink = (url: string) => {
    try {
        const decodedUrl = decodeURIComponent(url);
        // Check if URL contains a hash with token or error parameters
        return (
            decodedUrl.includes('#token=') ||
            decodedUrl.includes('#error=') ||
            decodedUrl.includes('#error_code=')
        );
    } catch {
        return false;
    }
};

export function useDeepLinks() {
    const router = useRouter();
    const { current: rootNavigation } = useNavigationContainerRef();
    const [isReady, setIsReady] = useState(false);
    const pendingNavigation = useRef<NavigationParams | null>(null);

    // Track when navigation is ready using expo-router's root navigation
    useEffect(() => {
        if (rootNavigation?.isReady) {
            setIsReady(true);
        }
    }, [rootNavigation?.isReady]);

    const navigate = (params: NavigationParams) => {
        if (rootNavigation?.isReady) {
            router.push(params);
        } else {
            console.log('Navigation not ready, storing navigation params for later');
            pendingNavigation.current = params;
        }
    };

    const handleUrl = (url: string) => {
        // Only handle URLs that match our deep link patterns
        if (!isResetPasswordDeepLink(url)) {
            console.log('Not a reset password deep link, ignoring:', url);
            return;
        }

        console.log('Handling reset password deep link:', url);
        try {
            // Decode the URL first
            const decodedUrl = decodeURIComponent(url);
            console.log('Decoded URL:', decodedUrl);

            // Extract the hash part (everything after #)
            const hashIndex = decodedUrl.indexOf('#');
            if (hashIndex === -1) {
                throw new Error('Invalid URL format');
            }

            // Parse the parameters
            const params = new URLSearchParams(decodedUrl.slice(hashIndex + 1));
            console.log('Parsed params:', Object.fromEntries(params.entries()));

            // Check for errors
            const error = params.get('error');
            const errorCode = params.get('error_code');
            const errorDescription = params.get('error_description');

            // Prepare navigation params
            let navigationParams: NavigationParams;

            if (error || errorCode) {
                console.log('Preparing error navigation:', errorDescription || error);
                navigationParams = {
                    pathname: RESET_PASSWORD_PATH,
                    params: { error: errorDescription || error || 'Unknown error' },
                };
            } else {
                // No error, proceed with token if available
                const token = params.get('token');
                if (token) {
                    console.log('Preparing token navigation');
                    navigationParams = {
                        pathname: RESET_PASSWORD_PATH,
                        params: { token },
                    };
                } else {
                    throw new Error('No token found');
                }
            }

            navigate(navigationParams);
        } catch (err) {
            console.error('Error handling deep link:', err);
            navigate({
                pathname: RESET_PASSWORD_PATH,
                params: { error: 'Invalid reset link' },
            });
        }
    };

    // Handle any pending navigation when navigation becomes ready
    useEffect(() => {
        if (rootNavigation?.isReady && pendingNavigation.current) {
            console.log('Navigation ready, handling pending navigation');
            router.push(pendingNavigation.current);
            pendingNavigation.current = null;
        }
    }, [rootNavigation?.isReady, router]);

    useEffect(() => {
        if (!rootNavigation?.isReady) return;

        // Handle deep links when the app is already running
        const subscription = Linking.addEventListener('url', ({ url }) => {
            console.log('Received deep link while running:', url);
            handleUrl(url);
        });

        // Handle deep links when the app is not running and is opened via URL
        if (Platform.OS === 'web') {
            // On web, check if we have a deep link in the current URL
            const url = window.location.href;
            if (url) {
                console.log('Checking initial web URL:', url);
                handleUrl(url);
            }
        } else {
            // On native, use Linking.getInitialURL
            Linking.getInitialURL().then((url) => {
                if (url) {
                    console.log('Received initial deep link:', url);
                    handleUrl(url);
                }
            });
        }

        return () => {
            subscription.remove();
        };
    }, [rootNavigation?.isReady]); // Only set up listeners when navigation is ready

    // Log the current navigation state
    useEffect(() => {
        console.log('Navigation ready:', rootNavigation?.isReady);
    }, [rootNavigation?.isReady]);
}
