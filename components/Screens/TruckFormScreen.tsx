import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';

import { Container } from '../Container';
import { LocationPicker } from '../LocationPicker';
import MultiSelect from '../MultiSelect';

import { useUserAtom } from '~/atoms/AuthentictionAtoms';
import { useCuisineTypes } from '~/atoms/GlobalDataAtoms';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import { TextInput } from '~/components/ui/TextInput';
import { useUpsertTruckForCurrentCompany } from '~/queries/UsersTruckQueries';
import { useGetTruckById } from '~/queries/TruckQueries';
import { Database } from '~/types/supabaseTypes';
import { useSelectedCompany } from '~/atoms/CompanyAtoms';

type Truck = Database['public']['Tables']['food_trucks']['Row'] & {
    cuisine_types?: {
        cuisine_types: {
            id: string;
            name: string;
        };
    }[];
};

type TruckFormProps = {
    mode: 'create' | 'update';
    truckId?: string;
};

export default function TruckFormScreen({ mode, truckId }: TruckFormProps) {
    console.log('TruckFormScreen render:', { mode, truckId });
    const [selectedCompany] = useSelectedCompany();
    const router = useRouter();
    const [user] = useUserAtom();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [tiktokUrl, setTiktokUrl] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [gpsCoordinates, setGpsCoordinates] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [rangeOfService, setRangeOfService] = useState('');
    const cuisineTypes = useCuisineTypes();
    const [selectedCuisineTypes, setSelectedCuisineTypes] = useState<string[]>([]);
    const value = useMemo(() => {
        return {
            address,
            gpsCoordinates,
        };
    }, [address, gpsCoordinates]);
    const {
        mutate: upsertTruck,
        isError,
        isPending,
    } = useUpsertTruckForCurrentCompany({
        onSuccess: () => {
            router.back();
        },
    });

    useEffect(() => {
        console.log(gpsCoordinates);
    }, [gpsCoordinates]);

    const { data: truck, isLoading: loadingTruck } = useGetTruckById(truckId || '', {
        enabled: mode === 'update' && !!truckId,
    });
    const loading = isPending || (mode === 'update' && loadingTruck);
    const formCompleted =
        name.trim().length > 0 &&
        description.trim().length > 0 &&
        address.trim().length > 0 &&
        rangeOfService.trim().length > 0 &&
        !!gpsCoordinates;

    useEffect(() => {
        if (isError) {
            Alert.alert('Error', 'Failed to save truck');
        }
    }, [isError]);

    useEffect(() => {
        console.log('Truck data effect:', { mode, truck, truckId, loadingTruck });
        if (mode === 'update' && truck && !loadingTruck) {
            console.log('Setting form data from truck:', truck);
            setName(truck.name);
            setDescription(truck.description || '');
            setAddress(truck.address || '');
            setFacebookUrl(truck.facebook_url || '');
            setInstagramUrl(truck.instagram_url || '');
            setTiktokUrl(truck.tiktok_url || '');
            setWebsiteUrl(truck.website_url || '');
            setRangeOfService(truck.range_of_service?.toString() || '');
            setGpsCoordinates({
                lat: truck.lat ?? 0,
                lng: truck.lng ?? 0,
            });
            setSelectedCuisineTypes(truck.cuisine_types?.map((ct) => ct.cuisine_types.id) ?? []);
        }
    }, [mode, truck, truckId, loadingTruck]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in');
            return;
        }

        if (!selectedCompany?.id) {
            Alert.alert('Error', 'You must be associated with a company');
            return;
        }

        const truckData = {
            id: truckId,
            name: name.trim(),
            description: description.trim() || '',
            address: address.trim() || '',
            facebook_url: facebookUrl.trim() || undefined,
            instagram_url: instagramUrl.trim() || undefined,
            tiktok_url: tiktokUrl.trim() || undefined,
            website_url: websiteUrl.trim() || undefined,
            location: `POINT(${gpsCoordinates?.lng} ${gpsCoordinates?.lat})`,
            range_of_service: rangeOfService ? parseInt(rangeOfService, 10) : null,
            user_id: user.id,
            lat: gpsCoordinates?.lat,
            lng: gpsCoordinates?.lng,
            cuisineTypeIds: selectedCuisineTypes,
            company_id: selectedCompany.id,
        };

        upsertTruck(truckData);
    };

    return (
        <Container>
            <ScrollView className="flex-1">
                <View className="gap-4 space-y-4 p-4">
                    <TextInput
                        label="Truck Name *"
                        value={name}
                        onChangeText={setName}
                        editable={!loadingTruck && !loading}
                        placeholder="Enter truck name"
                    />

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        editable={!loadingTruck && !loading}
                        placeholder="Enter description"
                        textAlignVertical="top"
                    />

                    <LocationPicker
                        value={value}
                        onLocationSelected={(event) => {
                            console.log('TruckFormScreen received location:', event);
                            if (!event.geolocation?.results?.[0]) {
                                console.log('No geolocation results in event');
                                return;
                            }
                            const result = event.geolocation.results[0];
                            console.log('Setting new location:', {
                                address: result.formatted_address,
                                lat: result.geometry.location.lat,
                                lng: result.geometry.location.lng,
                            });
                            setAddress(event?.details?.description ?? result.formatted_address);
                            setGpsCoordinates({
                                lat: result.geometry.location.lat,
                                lng: result.geometry.location.lng,
                            });
                        }}
                    />

                    <TextInput
                        label="Range of Service (miles)"
                        value={rangeOfService}
                        onChangeText={setRangeOfService}
                        keyboardType="numeric"
                        editable={!loadingTruck && !loading}
                        placeholder="Enter range of service"
                    />

                    <MultiSelect
                        data={cuisineTypes}
                        labelField="name"
                        valueField="id"
                        value={selectedCuisineTypes}
                        onChange={(values) => {
                            setSelectedCuisineTypes(values);
                        }}
                        placeholder={
                            selectedCuisineTypes.length === 0
                                ? 'Select a cuisine type'
                                : `${selectedCuisineTypes.length} selected`
                        }
                        search
                        searchPlaceholder="Search cuisine type"
                    />

                    <TextInput
                        label="Website URL"
                        value={websiteUrl}
                        onChangeText={setWebsiteUrl}
                        editable={!loadingTruck && !loading}
                        placeholder="Enter website URL"
                        keyboardType="url"
                        autoCapitalize="none"
                    />

                    <TextInput
                        label="Facebook URL"
                        value={facebookUrl}
                        onChangeText={setFacebookUrl}
                        editable={!loadingTruck && !loading}
                        placeholder="Enter Facebook URL"
                        keyboardType="url"
                        autoCapitalize="none"
                    />

                    <TextInput
                        label="Instagram URL"
                        value={instagramUrl}
                        onChangeText={setInstagramUrl}
                        editable={!loadingTruck && !loading}
                        placeholder="Enter Instagram URL"
                        keyboardType="url"
                        autoCapitalize="none"
                    />

                    <TextInput
                        label="TikTok URL"
                        value={tiktokUrl}
                        onChangeText={setTiktokUrl}
                        editable={!loadingTruck && !loading}
                        placeholder="Enter TikTok URL"
                        keyboardType="url"
                        autoCapitalize="none"
                    />

                    <Button
                        variant="primary"
                        onPress={handleSubmit}
                        className="mt-8"
                        disabled={!formCompleted || loading}>
                        <Text>{mode === 'create' ? 'Create Food Truck' : 'Update Food Truck'}</Text>
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
}
