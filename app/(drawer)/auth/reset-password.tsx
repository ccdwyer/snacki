import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpdatePassword } from '~/atoms/AuthentictionAtoms';
import { supabaseClient } from '~/clients/supabase';
import { AuthBackground } from '~/components/Auth/AuthBackground';
import { AuthTextField } from '~/components/Auth/AuthTextField';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';

export default function ResetPasswordScreen() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const updatePassword = useUpdatePassword();
    const router = useRouter();
    const params = useLocalSearchParams<{ token?: string; error?: string }>();

    // Handle URL parameters
    useEffect(() => {
        console.log('Reset password params:', params);
        if (params.error) {
            // If we received an error in the URL, display it
            setError(decodeURIComponent(params.error));
            setShowForgotPassword(true);
        }
    }, [params]);

    useEffect(() => {
        const setupSession = async () => {
            try {
                if (!params.token) {
                    // Don't show an error if we already have one from the URL
                    if (!params.error) {
                        setError('No reset token provided');
                    }
                    setShowForgotPassword(true);
                    return;
                }

                console.log('Attempting to verify token:', params.token);

                // Verify the token and get the session
                const { data, error: verifyError } = await supabaseClient.auth.verifyOtp({
                    token_hash: params.token,
                    type: 'recovery',
                });

                if (verifyError) {
                    console.error('Token verification error:', verifyError);
                    throw verifyError;
                }

                console.log('Token verification response:', data);

                if (!data.session) {
                    throw new Error('No session returned from token verification');
                }
            } catch (err) {
                console.error('Setup session error:', err);
                setError(err instanceof Error ? err.message : 'Invalid or expired reset token');
                setShowForgotPassword(true);
            }
        };

        if (!params.error) {
            setupSession();
        }
    }, [params.token, params.error]);

    const handleSubmit = async () => {
        try {
            setError(null);
            setLoading(true);

            if (!params.token) {
                throw new Error('No reset token provided');
            }

            if (newPassword.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            await updatePassword(newPassword);
            router.replace('/(drawer)/(user_tabs)/(map)');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNewLink = async () => {
        try {
            setError(null);
            setLoading(true);

            if (!email.includes('@')) {
                throw new Error('Please enter a valid email address');
            }

            const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email);
            if (resetError) throw resetError;

            // Show success message and navigate back to sign in
            router.replace('/auth');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthBackground />
            <SafeAreaView style={{ flex: 1 }}>
                <View className="flex-1 justify-center gap-4 px-8 py-4">
                    <Text variant="title1" className="text-center">
                        Reset Password
                    </Text>
                    {showForgotPassword ? (
                        <>
                            <Text className="text-center text-sm">
                                Enter your email address and we'll send you a link to reset your
                                password.
                            </Text>
                            <View className="rounded-lg bg-white/70 dark:bg-black/70">
                                <AuthTextField
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            <View className="rounded-lg bg-white/70 dark:bg-black/70">
                                <AuthTextField
                                    label="New Password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    textContentType="password"
                                />
                            </View>
                            <View className="rounded-lg bg-white/70 dark:bg-black/70">
                                <AuthTextField
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    textContentType="password"
                                />
                            </View>
                        </>
                    )}
                    {error && <Text className="text-center text-sm text-red-500">{error}</Text>}
                    <View className="flex-1 justify-end gap-4">
                        {showForgotPassword ? (
                            <>
                                <Button
                                    disabled={!email || loading}
                                    size={Platform.select({ ios: 'lg', default: 'default' })}
                                    onPress={handleRequestNewLink}>
                                    <Text className="dark:text-black">
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </Text>
                                </Button>
                                <Button
                                    variant="secondary"
                                    onPress={() => router.replace('/auth')}
                                    size={Platform.select({ ios: 'lg', default: 'default' })}>
                                    <Text className="text-primary">Cancel</Text>
                                </Button>
                            </>
                        ) : (
                            <Button
                                disabled={
                                    !newPassword || !confirmPassword || loading || !params.token
                                }
                                size={Platform.select({ ios: 'lg', default: 'default' })}
                                onPress={handleSubmit}>
                                <Text className="dark:text-black">Reset Password</Text>
                            </Button>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}
