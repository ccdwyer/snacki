import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { useScreenId } from '../ScreenIdProvider';
import { LocationPickerEmitter } from './LocationPickerEmitter';
import { Text } from '../nativewindui/Text';

import { GeolocationResponse } from '~/types/GeolocationResponse';

const getGeolocation = async (location: string): Promise<GeolocationResponse> => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
    );
    const data = await response.json();
    return data;
};

export const LocationPickerModal = () => {
    const screenId = useScreenId();
    const [pickerId, setPickerId] = useState<string | null>(null);
    const theme = useTheme();

    useEffect(() => {
        const subscription = LocationPickerEmitter.addListener(
            'openPicker',
            (event: { pickerId: string; screenId: string }) => {
                if (event.screenId !== screenId) {
                    return;
                }
                setPickerId(event.pickerId);
            }
        );
        const closeSubscription = LocationPickerEmitter.addListener(
            'closePicker',
            (event: { pickerId: string; screenId: string }) => {
                console.log('closePicker', event);
                setPickerId(null);
            }
        );
        return () => {
            subscription.remove();
            closeSubscription.remove();
        };
    }, []);

    if (!pickerId) return null;
    return (
        <View className="absolute bottom-4 left-4 right-4 top-4 rounded-lg bg-card p-4">
            <Text>Location Picker Modal</Text>
            <GooglePlacesAutocomplete
                placeholder="Search"
                requestUrl={{
                    url: 'https://maps.googleapis.com/maps/api',
                    useOnPlatform: 'web',
                }}
                onPress={async (data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log('data', data);
                    console.log('details', details);
                    const geolocation = await getGeolocation(data.description);
                    console.log('geolocation', geolocation);
                    const event = {
                        pickerId,
                        data,
                        details,
                        geolocation,
                    };
                    LocationPickerEmitter.emit('locationSelected', event);
                    setPickerId(null);
                }}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                    language: 'en',
                }}
                styles={{
                    textInputContainer: {
                        paddingHorizontal: 10,
                    },
                    poweredContainer: {
                        display: 'none',
                    },
                    row: {
                        width: Dimensions.get('window').width,
                        backgroundColor: theme.colors.background,
                    },
                    description: {
                        color: theme.colors.text,
                    },
                    container: {
                        flex: 0,
                    },
                }}
            />
        </View>
    );
};

export default LocationPickerModal;
