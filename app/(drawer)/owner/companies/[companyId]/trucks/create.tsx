import { Stack } from 'expo-router';

import TruckFormScreen from '~/components/Screens/TruckFormScreen';

export default function TruckForm() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Create Food Truck',
                    headerBackTitle: 'Back',
                }}
            />
            <TruckFormScreen mode="create" />
        </>
    );
}
