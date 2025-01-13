import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import {
    GooglePlaceData,
    GooglePlaceDetail,
    GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';

import { useScreenId } from '../Container';
import { Text } from '../nativewindui/Text';

import { GeolocationResponse } from '~/types/GeolocationResponse';

export const LocationPickerEmitter = new EventEmitter();

export type LocationPickerLocationSelectedEvent = {
    pickerId: string;
    data: GooglePlaceData;
    details: GooglePlaceDetail | null;
    geolocation: GeolocationResponse;
};

const getGeolocation = async (location: string): Promise<GeolocationResponse> => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
    );
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    return data;
};

export const LocationPickerModal = () => {
    const screenId = useScreenId();
    const [pickerId, setPickerId] = useState<string | null>(null);
    const theme = useTheme();

    useEffect(() => {
        console.log('screenId from modal', screenId);
    }, [screenId]);

    useEffect(() => {
        const subscription = LocationPickerEmitter.addListener(
            'openPicker',
            (event: { pickerId: string; screenId: string }) => {
                console.log('openPicker', event);
                if (event.screenId !== screenId) {
                    return;
                }
                setPickerId(event.pickerId);
            }
        );
        return () => {
            subscription.remove();
        };
    }, []);
    if (!pickerId) return null;
    return (
        <View className="absolute bottom-4 left-4 right-4 top-4 rounded-lg bg-card p-4">
            <Text>Location Picker Modal</Text>
            <GooglePlacesAutocomplete
                placeholder="Search"
                onPress={async (data, details = null) => {
                    console.log(JSON.stringify(data, null, 2));
                    console.log(JSON.stringify(details, null, 2));
                    // 'details' is provided when fetchDetails = true
                    const geolocation = await getGeolocation(data.description);
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