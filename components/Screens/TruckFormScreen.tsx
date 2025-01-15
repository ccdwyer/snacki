import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Alert, TextInput, ScrollView } from 'react-native';

import { Container } from '../Container';
import { LocationPicker } from '../LocationPicker';

import { useUserAtom } from '~/atoms/AuthentictionAtoms';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import {
    useGetTrucksForCurrentUser,
    useUpsertTruckForCurrentUser,
} from '~/queries/UsersTruckQueries';

type TruckFormProps = {
    mode: 'create' | 'update';
    truckId?: string;
};

export default function TruckFormScreen({ mode, truckId }: TruckFormProps) {
    const router = useRouter();
    const [user] = useUserAtom();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [gpsCoordinates, setGpsCoordinates] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const value = useMemo(() => {
        return {
            address,
            gpsCoordinates,
        };
    }, [address, gpsCoordinates]);
    const [rangeOfService, setRangeOfService] = useState('');
    const {
        mutate: upsertTruck,
        isError,
        isPending,
    } = useUpsertTruckForCurrentUser({
        onSuccess: () => {
            router.push('/owner/trucks');
        },
    });

    useEffect(() => {
        if (isError) {
            Alert.alert('Error', 'Failed to save truck');
        }
    }, [isError]);

    const { data: trucks, isLoading: loadingTrucks } = useGetTrucksForCurrentUser();
    const loading = isPending || (mode === 'update' && loadingTrucks);

    useEffect(() => {
        if (mode === 'update' && truckId && trucks) {
            const truck = trucks.find((t) => t.id === truckId);
            if (truck) {
                setName(truck.name);
                setDescription(truck.description || '');
                setAddress(truck.address || '');
                setRangeOfService(truck.range_of_service?.toString() || '');
                setGpsCoordinates({
                    lat: truck.lat,
                    lng: truck.lng,
                });
            }
        }
    }, [mode, truckId, trucks]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in');
            return;
        }

        const truckData = {
            name: name.trim(),
            description: description.trim() || '',
            address: address.trim() || '',
            location: `POINT(${gpsCoordinates?.lng} ${gpsCoordinates?.lat})`,
            range_of_service: rangeOfService ? parseInt(rangeOfService, 10) : null,
            user_id: user.id,
            lat: gpsCoordinates?.lat,
            lng: gpsCoordinates?.lng,
        };

        upsertTruck(truckData);
    };

    return (
        <Container>
            <ScrollView className="flex-1">
                <View className="gap-4 space-y-4 p-4">
                    <View>
                        <Text variant="caption1" className="mb-1 font-medium">
                            Truck Name *
                        </Text>
                        <TextInput
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
                            value={name}
                            onChangeText={setName}
                            editable={!loadingTrucks && !loading}
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
                            editable={!loadingTrucks && !loading}
                            placeholder="Enter description"
                            textAlignVertical="top"
                        />
                    </View>

                    {/* <View>
                        <Text variant="caption1" className="mb-1 font-medium">
                            Address
                        </Text>
                        <TextInput
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
                            value={address}
                            onChangeText={setAddress}
                            editable={!loadingTrucks && !loading}
                            placeholder="Enter address"
                        />
                    </View> */}

                    <LocationPicker
                        onLocationSelected={(event) => {
                            console.log('event', event);
                            const newAddress = event.data.description ?? '';
                            const newGpsCoordinates =
                                event.geolocation.results[0].geometry.location ?? null;
                            console.log({
                                newAddress,
                                newGpsCoordinates,
                            });
                            setAddress(newAddress);
                            setGpsCoordinates(newGpsCoordinates);
                        }}
                        value={value}
                    />

                    <View>
                        <Text variant="caption1" className="mb-1 font-medium">
                            Range of Service (miles)
                        </Text>
                        <TextInput
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
                            value={rangeOfService}
                            onChangeText={setRangeOfService}
                            keyboardType="numeric"
                            editable={!loadingTrucks && !loading}
                            placeholder="Enter range of service"
                        />
                    </View>

                    <Button
                        variant="primary"
                        onPress={handleSubmit}
                        className="mt-8"
                        disabled={loadingTrucks || loading}>
                        <Text>{mode === 'create' ? 'Create Food Truck' : 'Update Food Truck'}</Text>
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
}
