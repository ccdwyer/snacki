import { Map, useMap } from '@vis.gl/react-google-maps';
import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Container } from '~/components/Container';
import * as Location from 'expo-location';
import { useTheme } from '@react-navigation/native';

export default function MapScreen() {
    const map = useMap();
    const { colors } = useTheme();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const getGeolocation = useCallback(async (map: google.maps.Map) => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            console.log('Permission to access location was denied');
            console.log({ permissionStatus: status });
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log({ location });
        setLocation(location);
        if (!map) {
            console.log('Map is not initialized');
            return;
        }
        map.setCenter({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
        });
    }, []);

    useEffect(() => {
        if (map) {
            getGeolocation(map);
        }
    }, [getGeolocation, map]);

    return (
        <>
            <Stack.Screen options={{ title: 'Events' }} />
            <Container>
                <View className="flex-1 items-center justify-center">
                    <Map
                        style={{ width: '100%', height: '100%' }}
                        defaultCenter={{
                            lat: 27.2358095,
                            lng: -0.4279571,
                        }}
                        defaultZoom={10}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                    />
                    {!map && (
                        <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-black/50">
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    )}
                </View>
            </Container>
        </>
    );
}
