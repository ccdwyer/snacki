import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { LocationPickerEmitter, LocationPickerLocationSelectedEvent } from './LocationPickerModal';
import { useScreenId } from '../Container';
import { Button } from '../nativewindui/Button';
import { Text } from '../nativewindui/Text';

import { generateRandomBase64 } from '~/lib/generateRandomBase64';

interface LocationPickerProps {
    onLocationSelected: (event: LocationPickerLocationSelectedEvent) => void;
    value: {
        address: string;
        gpsCoordinates: {
            latitude: number;
            longitude: number;
        };
    } | null;
}

export const LocationPicker = ({ onLocationSelected, value }: LocationPickerProps) => {
    const { current: pickerId } = useRef<string | null>(generateRandomBase64(25));
    const [address, setAddress] = useState<string | null>(value?.address || null);
    const [gpsCoordinates, setGpsCoordinates] = useState<{
        latitude: number;
        longitude: number;
    } | null>(value?.gpsCoordinates || null);

    const [location, setLocation] = useState<LocationPickerLocationSelectedEvent | null>(null);

    useEffect(() => {
        if (location) {
            setAddress(location.data.description);
            setGpsCoordinates({
                latitude: location.geolocation.results[0].geometry.location.lat,
                longitude: location.geolocation.results[0].geometry.location.lng,
            });
        }
    }, [location]);

    const screenId = useScreenId();

    useEffect(() => {
        console.log('screenId from picker', screenId);
    }, [screenId]);

    useEffect(() => {
        const listener = LocationPickerEmitter.addListener(
            'locationSelected',
            (event: LocationPickerLocationSelectedEvent) => {
                if (event.pickerId !== pickerId) {
                    return;
                }

                onLocationSelected(event);
                setLocation(event);
            }
        );
        return () => {
            listener.remove();
            LocationPickerEmitter.emit('closePicker');
        };
    }, []);

    if (!location) {
        return (
            <Button
                onPress={() => {
                    LocationPickerEmitter.emit('openPicker', {
                        screenId,
                        pickerId,
                    });
                }}>
                <View className="flex-row items-center justify-center gap-4">
                    <FontAwesome name="map-pin" size={24} color="white" />
                    <Text>Select Location</Text>
                </View>
            </Button>
        );
    }

    return (
        <View className="items-center justify-center">
            <Text>{location.data.description}</Text>
            <Button
                onPress={() => {
                    LocationPickerEmitter.emit('openPicker', {
                        screenId,
                        pickerId,
                    });
                }}>
                <FontAwesome name="map-pin" size={24} color="white" />
                <Text>Pick New Location</Text>
            </Button>
        </View>
    );
};

export default LocationPicker;
