import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState, useRef } from 'react';
import { Dimensions, Image, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabaseClient } from '~/clients/supabase';
import { Separator } from '~/components/Separator';
import { TextStroke } from '~/components/TextStroke';
import { AlertAnchor } from '~/components/nativewindui/Alert';
import { AlertRef } from '~/components/nativewindui/Alert/types';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { TextField } from '~/components/nativewindui/TextField/TextField';

export default function AuthIndexScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [screenState, setScreenState] = useState<
        'pick-a-screen' | 'signup' | 'login' | 'forgot-password'
    >('signup');
    const theme = useTheme();
    const alertRef = useRef<AlertRef>(null);

    const handleLogin = async () => {
        const { error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.log(error);
        }
    };

    const handleForgotPassword = async () => {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
        if (error) {
            console.log(error);
        } else {
            alertRef.current?.alert({
                title: 'Check your email',
                message: 'A password reset link has been sent to your email.',
                buttons: [{ text: 'OK', style: 'cancel' }],
            });
        }
    };

    return (
        <>
            <View className="absolute bottom-0 left-0 right-0 top-0 opacity-35">
                <Image
                    source={require('~/assets/foodtruckbg.png')}
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                    }}
                    resizeMode="cover"
                />
            </View>
            <LinearGradient
                colors={
                    theme.dark
                        ? ['rgba(0,0,0,0.0)', 'rgba(0,0,0,1)']
                        : ['rgba(255,255,255,0.0)', 'rgba(255,255,255,1)']
                }
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300 }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <View className="w-full items-center justify-center opacity-80">
                    <TextStroke color="white" stroke={4}>
                        <Text className="p-3 font-[Phoria] text-8xl tracking-[0.075em] text-[#00D6C8]">
                            Snacki
                        </Text>
                    </TextStroke>
                    <Text variant="caption2">Made with ❤️ on Florida's Treasure Coast</Text>
                </View>

                {screenState === 'pick-a-screen' && (
                    <View className="ios:justify-end flex-1 justify-center gap-4 px-8 py-4">
                        <Link href="/auth/(create-account)" asChild>
                            <Button size={Platform.select({ ios: 'lg', default: 'md' })}>
                                <Text className="dark:text-black">Sign up free</Text>
                            </Button>
                        </Link>
                        <Link href="/auth/(login)" asChild>
                            <Button
                                variant="secondary"
                                size={Platform.select({ ios: 'lg', default: 'md' })}>
                                <Text className="text-primary">Log in</Text>
                            </Button>
                        </Link>
                    </View>
                )}

                {screenState === 'signup' && (
                    <View className="flex-1 justify-center gap-4 px-8 py-4">
                        <Text variant="title1" className="text-center">
                            Create your account
                        </Text>
                        <Text className="mt-[-16] text-center text-sm">Welcome to Snacki!</Text>
                        <View className="rounded-lg bg-white/70 dark:bg-black/70">
                            <TextField
                                placeholder={Platform.OS === 'android' ? '' : 'First Name'}
                                label={Platform.OS === 'ios' ? '' : 'First Name'}
                                keyboardType="default"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Separator />
                            <TextField
                                placeholder={Platform.OS === 'android' ? '' : 'Last Name'}
                                label={Platform.OS === 'ios' ? '' : 'Last Name'}
                                keyboardType="default"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        <View className="rounded-lg bg-white/70 dark:bg-black/70">
                            <TextField
                                placeholder={Platform.OS === 'android' ? '' : 'Email'}
                                label={Platform.OS === 'ios' ? '' : 'Email'}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Separator />
                            <TextField
                                placeholder={Platform.OS === 'android' ? '' : 'Password'}
                                label={Platform.OS === 'ios' ? '' : 'Password'}
                                keyboardType="default"
                                autoCapitalize="none"
                                textContentType="password"
                                secureTextEntry
                                autoCorrect={false}
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        <View className="flex-1 justify-end">
                            <Button
                                disabled={!email || !password}
                                size={Platform.select({ ios: 'lg', default: 'md' })}
                                onPress={async () => {
                                    const { data, error } = await supabaseClient.auth.signUp({
                                        email,
                                        password,
                                    });
                                    console.log(data);
                                    if (error) {
                                        console.log(error);
                                    }
                                }}>
                                <Text className="dark:text-black">Create Account</Text>
                            </Button>
                        </View>
                        <Link href="/auth/(login)" asChild>
                            <Button
                                variant="secondary"
                                size={Platform.select({ ios: 'lg', default: 'md' })}>
                                <Text className="text-primary">Cancel</Text>
                            </Button>
                        </Link>
                    </View>
                )}

                {screenState === 'login' && (
                    <View className="flex-1 justify-center gap-4 px-8 py-4">
                        <Text variant="title1" className="text-center">
                            Log in to your account
                        </Text>
                        <View className="rounded-lg bg-white/70 dark:bg-black/70">
                            <TextField
                                placeholder={Platform.OS === 'android' ? '' : 'Email'}
                                label={Platform.OS === 'ios' ? '' : 'Email'}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Separator />
                            <TextField
                                placeholder={Platform.OS === 'android' ? '' : 'Password'}
                                label={Platform.OS === 'ios' ? '' : 'Password'}
                                keyboardType="default"
                                autoCapitalize="none"
                                textContentType="password"
                                secureTextEntry
                                autoCorrect={false}
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        <View className="flex-1 justify-end">
                            <Button
                                disabled={!email || !password}
                                size={Platform.select({ ios: 'lg', default: 'md' })}
                                onPress={handleLogin}>
                                <Text className="dark:text-black">Log In</Text>
                            </Button>
                        </View>
                        <Button
                            variant="secondary"
                            size={Platform.select({ ios: 'lg', default: 'md' })}
                            onPress={() => setScreenState('forgot-password')}>
                            <Text className="text-primary">Forgot Password?</Text>
                        </Button>
                    </View>
                )}

                {screenState === 'forgot-password' && (
                    <View className="flex-1 justify-center gap-4 px-8 py-4">
                        <Text variant="title1" className="text-center">
                            Reset your password
                        </Text>
                        <View className="rounded-lg bg-white/70 dark:bg-black/70">
                            <TextField
                                placeholder={Platform.OS === 'android' ? '' : 'Email'}
                                label={Platform.OS === 'ios' ? '' : 'Email'}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View className="flex-1 justify-end">
                            <Button
                                disabled={!email}
                                size={Platform.select({ ios: 'lg', default: 'md' })}
                                onPress={handleForgotPassword}>
                                <Text className="dark:text-black">Send Reset Link</Text>
                            </Button>
                        </View>
                        <Button
                            variant="secondary"
                            size={Platform.select({ ios: 'lg', default: 'md' })}
                            onPress={() => setScreenState('login')}>
                            <Text className="text-primary">Back to Login</Text>
                        </Button>
                    </View>
                )}
            </SafeAreaView>
            <AlertAnchor ref={alertRef} />
        </>
    );
}
