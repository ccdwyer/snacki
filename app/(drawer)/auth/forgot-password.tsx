import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabaseClient } from '~/clients/supabase';
import { AuthBackground } from '~/components/Auth/AuthBackground';
import { AuthTextField } from '~/components/Auth/AuthTextField';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            setError(null);
            setLoading(true);

            if (!email.includes('@')) {
                throw new Error('Please enter a valid email address');
            }

            const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email);
            if (resetError) throw resetError;

            // Show success message and navigate back to sign in
            router.replace('/sign-in?message=Check your email for a password reset link');
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
                    <Text className="text-center text-sm">
                        Enter your email address and we'll send you a link to reset your password.
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
                    {error && <Text className="text-center text-sm text-red-500">{error}</Text>}
                    <View className="flex-1 justify-end gap-4">
                        <Button
                            disabled={!email || loading}
                            size={Platform.select({ ios: 'lg', default: 'md' })}
                            onPress={handleSubmit}>
                            <Text className="dark:text-black">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Text>
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={() => router.replace('/auth')}
                            size={Platform.select({ ios: 'lg', default: 'md' })}>
                            <Text className="text-primary">Cancel</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}
