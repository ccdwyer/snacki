import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import {
    LocationPickerEmitter,
    LocationPickerLocationSelectedEvent,
} from './LocationPickerEmitter';
import { useScreenId } from '../ScreenIdProvider';
import { Button } from '~/components/Button';
import { Text } from '../nativewindui/Text';

import { generateRandomBase64 } from '~/lib/generateRandomBase64';

interface LocationPickerProps {
    onLocationSelected: (event: LocationPickerLocationSelectedEvent) => void;
    value: {
        address: string;
        gpsCoordinates: {
            lat: number;
            lng: number;
        } | null;
    };
}

export const LocationPicker = ({ onLocationSelected, value }: LocationPickerProps) => {
    const { current: pickerId } = useRef<string | null>(generateRandomBase64(25));
    const screenId = useScreenId();

    useEffect(() => {
        const listener = LocationPickerEmitter.addListener(
            'locationSelected',
            (event: LocationPickerLocationSelectedEvent) => {
                if (event.pickerId !== pickerId) {
                    return;
                }
                // First close the picker
                LocationPickerEmitter.emit('closePicker');
                // Then notify about the selected location
                onLocationSelected(event);
            }
        );
        return () => {
            listener.remove();
            LocationPickerEmitter.emit('closePicker');
        };
    }, [pickerId, onLocationSelected]);

    if (!value?.address || !value?.gpsCoordinates) {
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
            <Text>{value.address}</Text>
            <Button
                onPress={() => {
                    LocationPickerEmitter.emit('openPicker', {
                        screenId,
                        pickerId,
                    });
                }}>
                <FontAwesome name="map-pin" size={24} color="black" />
                <Text className="color-black">Pick New Location</Text>
            </Button>
        </View>
    );
};

export default LocationPicker;
