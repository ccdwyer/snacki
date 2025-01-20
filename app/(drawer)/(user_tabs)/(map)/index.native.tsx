import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';

import { supabaseClient } from '~/clients/supabase';
import { Container } from '~/components/Container';

const region = {
    latitude: 27.27327,
    longitude: -80.342148,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
};

const markers = [
    {
        id: 1,
        latitude: 27.27327,
        longitude: -80.342148,
        title: 'Truck 1',
        description: 'Truck 1 description',
    },
    {
        id: 2,
        latitude: 27.27327,
        longitude: -80.442148,
        title: 'Truck 2',
        description: 'Truck 2 description',
    },
    {
        id: 3,
        latitude: 27.17327,
        longitude: -80.242148,
        title: 'Truck 3',
        description: 'Truck 3 description',
    },
];

type GeoFoodTruck = {
    id: string;
    user_id: string;
    name: string;
    lat: number;
    lng: number;
    distance_meters: number;
};

const getFoodTrucksWithinDistance = async ({
    lat,
    lng,
    distance,
}: {
    lat: number;
    lng: number;
    distance: number;
}) => {
    const { data, error } = await supabaseClient.rpc('get_food_trucks_within_distance', {
        lat_in: lat,
        lng_in: lng,
        distance_miles: distance,
    });

    if (error) {
        console.error(error);
        return [];
    }

    return data;
};

export default function MapScreen() {
    const [foodTrucks, setFoodTrucks] = useState<GeoFoodTruck[]>([]);

    const fetchFoodTrucks = useCallback(async () => {
        const trucks = await getFoodTrucksWithinDistance({
            lat: 27.235996,
            lng: -80.427775,
            distance: 10,
        });
        setFoodTrucks(trucks);
    }, []);

    useEffect(() => {
        fetchFoodTrucks();
    }, []);

    useEffect(() => {
        console.log(foodTrucks);
    }, [foodTrucks]);

    return (
        <>
            <Stack.Screen options={{ title: 'Events' }} />
            <Container>
                {/* <Text>Map</Text> */}
                <MapView region={region} style={{ flex: 1 }}>
                    {markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            pinColor="#00D6C8"
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            title={marker.title}
                            description={marker.description}
                        />
                    ))}
                </MapView>
            </Container>
        </>
    );
}
