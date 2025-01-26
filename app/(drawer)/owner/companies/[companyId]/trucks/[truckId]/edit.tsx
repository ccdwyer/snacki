import { Stack, useLocalSearchParams } from 'expo-router';

import TruckFormScreen from '~/components/Screens/TruckFormScreen';

export default function UpdateTruck() {
    const { truckId: id } = useLocalSearchParams();
    const truckId = Array.isArray(id) ? id[0] : id;

    return (
        <>
            <Stack.Screen options={{ title: 'Update Food Truck' }} />
            <TruckFormScreen mode="update" truckId={truckId} />
        </>
    );
}
