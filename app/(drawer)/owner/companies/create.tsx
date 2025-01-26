import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '~/clients/supabase';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import { TextField } from '~/components/nativewindui/TextField';
import { Button } from '~/components/Button';
import { useUserAtom } from '~/atoms/AuthentictionAtoms';

export default function CreateCompanyScreen() {
    const router = useRouter();
    const [user] = useUserAtom();
    const [name, setName] = useState('');
    const queryClient = useQueryClient();

    const { mutate: createCompany, isPending } = useMutation({
        mutationFn: async () => {
            if (!user?.id) throw new Error('User must be logged in');
            
            const { data, error } = await supabaseClient
                .from('companies')
                .insert({
                    name: name.trim(),
                    owner_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-companies'] });
            router.replace('/owner');
        },
        onError: (error) => {
            console.error('Error creating company:', error);
            // In a production app, you'd want to show a proper error message to the user
        },
    });

    const handleSubmit = () => {
        if (name.trim().length === 0) return;
        createCompany();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'New Company',
                    headerLargeTitle: true,
                }}
            />
            <Container>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1">
                    <View className="flex-1 p-4">
                        <View className="mb-8">
                            <Text variant="body" color="secondary" className="mb-6">
                                Create a new company to start managing your food trucks.
                            </Text>
                        </View>

                        <View className="space-y-4">
                            <TextField
                                label="Company Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter company name"
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                                autoCapitalize="words"
                            />
                        </View>

                        <View className="mt-6">
                            <Button
                                variant="primary"
                                onPress={handleSubmit}
                                disabled={name.trim().length === 0 || isPending}>
                                <Text>{isPending ? 'Creating...' : 'Create Company'}</Text>
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Container>
        </>
    );
}
