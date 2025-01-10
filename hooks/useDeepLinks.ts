import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';

export function useDeepLinks() {
    const router = useRouter();
    const segments = useSegments();
    const [isReady, setIsReady] = useState(false);
    const pendingLink = useRef<string | null>(null);

    // Track when navigation is ready
    useEffect(() => {
        if (segments.length > 0 && !segments.includes('+not-found')) {
            setIsReady(true);
        }
    }, [segments]);

    const handleUrl = (url: string) => {
        console.log('Handling URL:', url);
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

            if (!isReady) {
                console.log('Navigation not ready, storing URL for later');
                pendingLink.current = url;
                return;
            }

            if (error || errorCode) {
                console.log('Navigating with error:', errorDescription || error);
                // Navigate to reset password with error information
                router.push({
                    pathname: '/(drawer)/auth/reset-password',
                    params: { error: errorDescription || error || 'Unknown error' },
                });
            } else {
                // No error, proceed with token if available
                const token = params.get('token');
                if (token) {
                    console.log('Navigating with token');
                    router.push({
                        pathname: '/(drawer)/auth/reset-password',
                        params: { token },
                    });
                }
            }
        } catch (err) {
            console.error('Error handling deep link:', err);
            if (isReady) {
                // Navigate to reset password with generic error
                router.push({
                    pathname: '/(drawer)/auth/reset-password',
                    params: { error: 'Invalid reset link' },
                });
            }
        }
    };

    // Handle any pending links when navigation becomes ready
    useEffect(() => {
        if (isReady && pendingLink.current) {
            console.log('Navigation ready, handling pending link');
            handleUrl(pendingLink.current);
            pendingLink.current = null;
        }
    }, [isReady]);

    useEffect(() => {
        // Handle deep links when the app is already running
        const subscription = Linking.addEventListener('url', ({ url }) => {
            console.log('Received deep link while running:', url);
            handleUrl(url);
        });

        // Handle deep links when the app is not running and is opened via URL
        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('Received initial deep link:', url);
                handleUrl(url);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [isReady]); // Re-run when isReady changes

    // Log the current navigation state
    useEffect(() => {
        console.log('Navigation segments:', segments);
        console.log('Navigation ready:', isReady);
    }, [segments, isReady]);
}
