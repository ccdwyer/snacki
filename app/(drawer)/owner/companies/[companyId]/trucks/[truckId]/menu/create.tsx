import { Stack, useLocalSearchParams } from 'expo-router';

import MenuFormScreen from '~/components/Screens/MenuFormScreen';

export default function CreateMenu() {
    const { truckId } = useLocalSearchParams();

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Create Menu',
                    headerBackTitle: 'Back',
                }}
            />
            <MenuFormScreen mode="create" truckId={truckId as string} />
        </>
    );
}
