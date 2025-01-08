import { Stack } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

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

export default function MapScreen() {
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
