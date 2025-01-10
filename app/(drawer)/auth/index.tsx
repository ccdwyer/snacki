import { useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UserAtom } from '~/atoms/AuthentictionAtoms';
import { supabaseClient } from '~/clients/supabase';
import { AuthBackground } from '~/components/Auth/AuthBackground';
import { AuthForm } from '~/components/Auth/AuthForm';
import { AlertAnchor } from '~/components/nativewindui/Alert';
import { AlertRef } from '~/components/nativewindui/Alert/types';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';

type AuthScreenState = 'pick-a-screen' | 'signup' | 'login' | 'forgot-password';

export default function AuthIndexScreen() {
    const [screenState, setScreenState] = useState<AuthScreenState>('pick-a-screen');
    const alertRef = useRef<AlertRef>(null);
    const [user, setUser] = useAtom(UserAtom);
    const params = useLocalSearchParams<{ screen?: AuthScreenState }>();

    // Set initial screen state from params
    useEffect(() => {
        console.log('Auth screen params:', params);
        if (params.screen && !user) {
            console.log('Setting screen state to:', params.screen);
            setScreenState(params.screen);
        }
    }, [params.screen, user]);

    const handleError = (error: string) => {
        alertRef.current?.alert({
            title: 'Error',
            message: error,
            buttons: [{ text: 'OK', style: 'cancel' }],
        });
    };

    const handleSuccess = (message: string) => {
        alertRef.current?.alert({
            title: 'Success',
            message,
            buttons: [{ text: 'OK', style: 'cancel' }],
        });
    };

    const handleSignOut = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            handleError(error.message);
        } else {
            setUser(null);
        }
    };

    if (user) {
        return (
            <>
                <AuthBackground />
                <SafeAreaView style={{ flex: 1 }}>
                    <View className="flex-1 justify-center gap-4 px-8 py-4">
                        <Text variant="title2" className="text-center">
                            Account Details
                        </Text>
                        <View className="rounded-lg bg-white/70 p-4 dark:bg-black/70">
                            <Text className="mb-2 font-medium">
                                Name:{' '}
                                <Text className="font-normal">
                                    {user.user_metadata.first_name} {user.user_metadata.last_name}
                                </Text>
                            </Text>
                            <Text className="mb-2 font-medium">
                                Email: <Text className="font-normal">{user.email}</Text>
                            </Text>
                            <Text className="font-medium">
                                Member since:{' '}
                                <Text className="font-normal">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </Text>
                            </Text>
                        </View>
                        <View className="flex-1 justify-end">
                            <Button
                                onPress={handleSignOut}
                                variant="tonal"
                                size={Platform.select({ ios: 'lg', default: 'md' })}>
                                <Text>Sign Out</Text>
                            </Button>
                        </View>
                    </View>
                </SafeAreaView>
                <AlertAnchor ref={alertRef} />
            </>
        );
    }

    return (
        <>
            <AuthBackground />
            <SafeAreaView style={{ flex: 1 }}>
                {screenState === 'pick-a-screen' && (
                    <View className="ios:justify-end flex-1 justify-center gap-4 px-8 py-4">
                        <Button
                            onPress={() => setScreenState('signup')}
                            size={Platform.select({ ios: 'lg', default: 'md' })}>
                            <Text className="dark:text-black">Sign up free</Text>
                        </Button>
                        <Button
                            onPress={() => setScreenState('login')}
                            variant="primary"
                            size={Platform.select({ ios: 'lg', default: 'md' })}>
                            <Text className="dark:text-black">Log in</Text>
                        </Button>
                    </View>
                )}

                {(screenState === 'signup' ||
                    screenState === 'login' ||
                    screenState === 'forgot-password') && (
                    <AuthForm
                        type={screenState}
                        onCancel={() => setScreenState('pick-a-screen')}
                        onError={handleError}
                        onStateChange={setScreenState}
                        onSuccess={(message) => {
                            if (message) {
                                handleSuccess(message);
                            } else if (screenState === 'forgot-password') {
                                handleSuccess('Check your email for a password reset link');
                                setScreenState('login');
                            }
                        }}
                    />
                )}
            </SafeAreaView>
            <AlertAnchor ref={alertRef} />
        </>
    );
}
