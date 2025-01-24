import { useSetAtom } from 'jotai';
import React, { useRef, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { AuthTextField } from './AuthTextField';

import { UserAtom } from '~/atoms/AuthentictionAtoms';
import { supabaseClient } from '~/clients/supabase';
import { Button } from '~/components/Button';
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

    // Refs for form fields
    const firstNameRef = useRef<any>(null);
    const lastNameRef = useRef<any>(null);
    const emailRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);

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
        <View className="gap-6">
            <View className="items-center gap-2">
                <Text variant="largeTitle" className="text-center font-semibold">
                    {type === 'signup'
                        ? 'Create Account'
                        : type === 'login'
                          ? 'Welcome Back'
                          : 'Reset Password'}
                </Text>
                <Text variant="caption1" className="text-center text-secondary">
                    {type === 'signup'
                        ? 'Sign up to get started'
                        : type === 'login'
                          ? 'Sign in to continue'
                          : 'Enter your email to reset your password'}
                </Text>
            </View>

            <View className="gap-4">
                {type === 'signup' && (
                    <View className="gap-4">
                        <AuthTextField
                            ref={firstNameRef}
                            label="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            textContentType="name"
                            autoCapitalize="words"
                            returnKeyType="next"
                            onSubmitEditing={() => lastNameRef.current?.focus()}
                        />
                        <AuthTextField
                            ref={lastNameRef}
                            label="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            textContentType="name"
                            autoCapitalize="words"
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                        />
                    </View>
                )}

                <AuthTextField
                    ref={emailRef}
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    returnKeyType={type === 'forgot-password' ? 'go' : 'next'}
                    onSubmitEditing={() => {
                        if (type === 'forgot-password') {
                            handleSubmit();
                        } else {
                            passwordRef.current?.focus();
                        }
                    }}
                />

                {type !== 'forgot-password' && (
                    <AuthTextField
                        ref={passwordRef}
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        textContentType="password"
                        returnKeyType="go"
                        blurOnSubmit
                        onSubmitEditing={handleSubmit}
                    />
                )}

                {type === 'login' && (
                    <Pressable
                        onPress={() => onStateChange?.('forgot-password')}
                        className="items-center">
                        <Text variant="caption1" className="text-primary">
                            Forgot your password?
                        </Text>
                    </Pressable>
                )}
            </View>

            <View className="gap-3">
                <Button
                    disabled={isDisabled}
                    variant="primary"
                    size={Platform.select({ ios: 'lg', default: 'default' })}
                    onPress={handleSubmit}>
                    <Text className="font-medium">
                        {loading
                            ? 'Loading...'
                            : type === 'signup'
                              ? 'Create Account'
                              : type === 'login'
                                ? 'Sign In'
                                : 'Reset Password'}
                    </Text>
                </Button>
                <Button
                    variant="secondary"
                    size={Platform.select({ ios: 'lg', default: 'default' })}
                    onPress={onCancel}>
                    <Text className="font-medium">Cancel</Text>
                </Button>
            </View>
        </View>
    );
}
