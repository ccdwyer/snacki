import { useSetAtom } from 'jotai';
import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { AuthTextField } from './AuthTextField';

import { UserAtom } from '~/atoms/AuthentictionAtoms';
import { supabaseClient } from '~/clients/supabase';
import { Separator } from '~/components/Separator';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';

type AuthFormProps = {
    type: 'signup' | 'login' | 'forgot-password';
    onCancel: () => void;
    onSuccess?: (message?: string) => void;
    onError?: (error: string) => void;
    onStateChange?: (state: 'signup' | 'login' | 'forgot-password') => void;
};

export function AuthForm({ type, onCancel, onSuccess, onError, onStateChange }: AuthFormProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setUser = useSetAtom(UserAtom);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!email.includes('@')) {
                throw new Error('Please enter a valid email address');
            }

            if (type === 'signup' && (!firstName || !lastName)) {
                throw new Error('Please fill in all fields');
            }

            if ((type === 'signup' || type === 'login') && password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            if (type === 'signup') {
                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                        },
                    },
                });
                if (error) throw error;

                // Clear form and show success message
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                onSuccess?.('Please check your email to confirm your account');
                onStateChange?.('login');
            } else if (type === 'login') {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (data?.user) {
                    setUser(data.user);
                    onSuccess?.();
                }
            } else {
                const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
                if (error) throw error;
                onSuccess?.();
            }
        } catch (error) {
            onError?.(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = loading || !email || (type !== 'forgot-password' && !password);

    return (
        <View className="flex-1 justify-center gap-4 px-8 py-4">
            <Text variant="title1" className="text-center">
                {type === 'signup'
                    ? 'Create your account'
                    : type === 'login'
                      ? 'Log in to your account'
                      : 'Reset your password'}
            </Text>
            {type === 'signup' && (
                <>
                    <Text className="mt-[-16] text-center text-sm">Welcome to Snacki!</Text>
                    <View className="rounded-lg bg-white/70 dark:bg-black/70">
                        <AuthTextField
                            label="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            textContentType="name"
                            autoCapitalize="words"
                        />
                        <Separator />
                        <AuthTextField
                            label="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            textContentType="name"
                            autoCapitalize="words"
                        />
                    </View>
                </>
            )}
            <View className="rounded-lg bg-white/70 dark:bg-black/70">
                <AuthTextField
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                />
                {type !== 'forgot-password' && (
                    <>
                        <Separator />
                        <AuthTextField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            textContentType="password"
                        />
                    </>
                )}
            </View>
            {type === 'login' && (
                <Pressable onPress={() => onStateChange?.('forgot-password')}>
                    <Text className="text-center text-sm text-primary">Forgot your password?</Text>
                </Pressable>
            )}
            <View className="flex-1 justify-end">
                <Button
                    disabled={isDisabled}
                    loading={loading}
                    size={Platform.select({ ios: 'lg', default: 'md' })}
                    onPress={handleSubmit}>
                    <Text className="dark:text-black">
                        {type === 'signup'
                            ? 'Create Account'
                            : type === 'login'
                              ? 'Log In'
                              : 'Send Reset Link'}
                    </Text>
                </Button>
            </View>
            <Button
                onPress={onCancel}
                variant="secondary"
                size={Platform.select({ ios: 'lg', default: 'md' })}>
                <Text className="text-primary">Cancel</Text>
            </Button>
        </View>
    );
}
