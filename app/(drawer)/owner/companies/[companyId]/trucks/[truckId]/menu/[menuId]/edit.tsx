import { Stack, useLocalSearchParams } from 'expo-router';

import MenuFormScreen from '~/components/Screens/MenuFormScreen';

export default function UpdateTruck() {
    const { id, menuId } = useLocalSearchParams();

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Update Menu',
                    headerBackTitle: 'Back',
                }}
            />
            <MenuFormScreen mode="update" truckId={id as string} menuId={menuId as string} />
        </>
    );
}
