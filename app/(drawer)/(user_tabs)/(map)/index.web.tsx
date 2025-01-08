import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
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
                <Text>Map</Text>
            </Container>
        </>
    );
}
