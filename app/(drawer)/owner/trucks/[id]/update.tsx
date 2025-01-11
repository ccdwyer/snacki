import { Stack, useLocalSearchParams } from 'expo-router';

import TruckFormScreen from '~/components/Screens/TruckFormScreen';

export default function UpdateTruck() {
    const { id } = useLocalSearchParams();

    return (
        <>
            <Stack.Screen options={{ title: 'Update Food Truck' }} />
            <TruckFormScreen mode="update" truckId={id as string} />
        </>
    );
}
