import { useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UserAtom } from '~/atoms/AuthentictionAtoms';
import { supabaseClient } from '~/clients/supabase';
import { AuthForm } from '~/components/Auth/AuthForm';
import { AlertAnchor } from '~/components/nativewindui/Alert';
import { AlertRef } from '~/components/nativewindui/Alert/types';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

type AuthScreenState = 'pick-a-screen' | 'signup' | 'login' | 'forgot-password';

export default function AuthScreen() {
    const [screenState, setScreenState] = useState<AuthScreenState>('pick-a-screen');
    const alertRef = useRef<AlertRef>(null);
    const [user, setUser] = useAtom(UserAtom);
    const params = useLocalSearchParams<{ screen?: AuthScreenState }>();
    const { colorScheme } = useColorScheme();

    // Set initial screen state from params
    useEffect(() => {
        if (params.screen && !user) {
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

    const handleSuccess = (message?: string) => {
        alertRef.current?.alert({
            title: 'Success',
            message: message || 'Operation successful',
            buttons: [{ text: 'OK', style: 'cancel' }],
        });
    };

    const handleSignOut = async () => {
        try {
            // Even if there's an error signing out from Supabase,
            // we should still clear the local user state
            const { error } = await supabaseClient.auth.signOut();
            setUser(null);
            
            if (error && error.message !== 'Auth session missing') {
                handleError(error.message);
            }
        } catch (error) {
            // If there's any other error, still clear the local state
            setUser(null);
            if (error instanceof Error && error.message !== 'Auth session missing') {
                handleError(error.message);
            }
        }
    };

    if (user) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="mx-auto flex-1 w-full max-w-md px-8 py-4">
                    <View className="flex-1 justify-center gap-6">
                        <View className="items-center gap-2">
                            <Text variant="largeTitle" className="text-center font-semibold">
                                Account
                            </Text>
                            <Text variant="caption1" className="text-center text-secondary">
                                Manage your account details
                            </Text>
                        </View>
                        <View className="web:shadow-lg rounded-2xl bg-card p-6">
                            <View className="gap-4">
                                <View>
                                    <Text variant="caption1" className="text-secondary">
                                        Name
                                    </Text>
                                    <Text variant="body" className="text-primary">
                                        {user.user_metadata.first_name} {user.user_metadata.last_name}
                                    </Text>
                                </View>
                                <View>
                                    <Text variant="caption1" className="text-secondary">
                                        Email
                                    </Text>
                                    <Text variant="body" className="text-primary">
                                        {user.email}
                                    </Text>
                                </View>
                                <View>
                                    <Text variant="caption1" className="text-secondary">
                                        Member since
                                    </Text>
                                    <Text variant="body" className="text-primary">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="flex-1 justify-end">
                            <Button
                                onPress={handleSignOut}
                                variant="secondary"
                                size={Platform.select({ ios: 'lg', default: 'default' })}>
                                <Text>Sign Out</Text>
                            </Button>
                        </View>
                    </View>
                </View>
                <AlertAnchor ref={alertRef} title="" buttons={[]} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="mx-auto flex-1 w-full max-w-md px-8 py-4">
                <View className="flex-1 justify-center">
                    {screenState === 'pick-a-screen' && (
                        <View className="web:shadow-lg web:bg-card web:p-8 web:rounded-2xl gap-6">
                            <View className="items-center gap-2">
                                <Text variant="largeTitle" className="text-center font-semibold">
                                    Welcome to Snacki
                                </Text>
                                <Text variant="caption1" className="text-center text-secondary">
                                    Sign in or create an account to continue
                                </Text>
                            </View>
                            <View className="gap-3">
                                <Button
                                    onPress={() => setScreenState('signup')}
                                    variant="primary"
                                    size={Platform.select({ ios: 'lg', default: 'default' })}>
                                    <Text className="font-medium">Create Account</Text>
                                </Button>
                                <Button
                                    onPress={() => setScreenState('login')}
                                    variant="secondary"
                                    size={Platform.select({ ios: 'lg', default: 'default' })}>
                                    <Text className="font-medium">Sign In</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    {(screenState === 'signup' || screenState === 'login') && (
                        <View className="web:shadow-lg web:bg-card web:p-8 web:rounded-2xl">
                            <AuthForm
                                type={screenState}
                                onSuccess={handleSuccess}
                                onError={handleError}
                                onCancel={() => setScreenState('pick-a-screen')}
                            />
                        </View>
                    )}
                </View>
            </View>
            <AlertAnchor ref={alertRef} title="" buttons={[]} />
        </SafeAreaView>
    );
}
