import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import TruckDetailsScreen from '~/components/Screens/TruckDetailsScreen';

export default function EventForm() {
    return (
        <>
            <Stack.Screen options={{ title: 'Truck List' }} />
            <Container>
                <TruckDetailsScreen />
            </Container>
        </>
    );
}
