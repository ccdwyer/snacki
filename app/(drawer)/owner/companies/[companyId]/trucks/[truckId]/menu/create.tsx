import { Stack, useLocalSearchParams } from 'expo-router';

import MenuFormScreen from '~/components/Screens/MenuFormScreen';

export default function CreateMenu() {
    const { truckId } = useLocalSearchParams();

    return (
        <>
            <Stack.Screen options={{ title: 'Update Food Truck' }} />
            <MenuFormScreen mode="create" truckId={truckId as string} />
        </>
    );
}
