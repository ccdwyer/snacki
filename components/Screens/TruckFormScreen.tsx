import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Alert, TextInput, ScrollView } from 'react-native';

import { useUserAtom } from '~/atoms/AuthentictionAtoms';
import { supabaseClient } from '~/clients/supabase';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';

type TruckFormProps = {
    mode: 'create' | 'update';
    truckId?: string;
};

export default function TruckFormScreen({ mode, truckId }: TruckFormProps) {
    const router = useRouter();
    const [user] = useUserAtom();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [rangeOfService, setRangeOfService] = useState('');

    useEffect(() => {
        if (mode === 'update' && truckId) {
            loadTruckData();
        }
    }, [mode, truckId]);

    const loadTruckData = async () => {
        if (!truckId) return;

        try {
            setLoading(true);
            const { data, error } = await supabaseClient
                .from('food_trucks')
                .select('*')
                .eq('id', truckId)
                .single();

            if (error) throw error;

            if (data) {
                setName(data.name);
                setDescription(data.description || '');
                setAddress(data.address || '');
                setRangeOfService(data.range_of_service?.toString() || '');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load truck data');
            console.error('Error loading truck:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in');
            return;
        }

        try {
            setLoading(true);
            const truckData = {
                name: name.trim(),
                description: description.trim() || null,
                address: address.trim() || null,
                range_of_service: rangeOfService ? parseInt(rangeOfService, 10) : null,
                user_id: user.id,
            };

            let error;
            if (mode === 'create') {
                const { error: createError } = await supabaseClient
                    .from('food_trucks')
                    .insert([truckData]);
                error = createError;
            } else {
                const { error: updateError } = await supabaseClient
                    .from('food_trucks')
                    .update(truckData)
                    .eq('id', truckId);
                error = updateError;
            }

            if (error) throw error;

            Alert.alert(
                'Success',
                `Food truck ${mode === 'create' ? 'created' : 'updated'} successfully`
            );
            router.back();
        } catch (error) {
            Alert.alert('Error', `Failed to ${mode} food truck`);
            console.error('Error saving truck:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1">
            <View className="space-y-4 p-4">
                <View>
                    <Text variant="caption1" className="mb-1 font-medium">
                        Truck Name *
                    </Text>
                    <TextInput
                        className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
                        value={name}
                        onChangeText={setName}
                        editable={!loading}
                        placeholder="Enter truck name"
                    />
                </View>

                <View>
                    <Text variant="caption1" className="mb-1 font-medium">
                        Description
                    </Text>
                    <TextInput
                        className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        editable={!loading}
                        placeholder="Enter description"
                        textAlignVertical="top"
                    />
                </View>

                <View>
                    <Text variant="caption1" className="mb-1 font-medium">
                        Address
                    </Text>
                    <TextInput
                        className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
                        value={address}
                        onChangeText={setAddress}
                        editable={!loading}
                        placeholder="Enter address"
                    />
                </View>

                <View>
                    <Text variant="caption1" className="mb-1 font-medium">
                        Range of Service (miles)
                    </Text>
                    <TextInput
                        className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
                        value={rangeOfService}
                        onChangeText={setRangeOfService}
                        keyboardType="numeric"
                        editable={!loading}
                        placeholder="Enter range of service"
                    />
                </View>

                <Button variant="primary" onPress={handleSubmit} disabled={loading}>
                    <Text>{mode === 'create' ? 'Create Food Truck' : 'Update Food Truck'}</Text>
                </Button>
            </View>
        </ScrollView>
    );
}
