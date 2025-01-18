import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { Container } from '~/components/Container';
import MenuDetailsScreen from '~/components/Screens/MenuDetailsScreen';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';

export default function TruckDetails() {
    const router = useRouter();
    const { id, menuId } = useLocalSearchParams();
    const menuIdString = Array.isArray(menuId) ? menuId[0] : menuId;
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Menu Details',
                    headerRight: () => (
                        <Button
                            variant="plain"
                            onPress={() => {
                                router.push(`/owner/trucks/${id}/menu/${menuId}/edit`);
                            }}>
                            <Text className="text-primary">Update</Text>
                        </Button>
                    ),
                }}
            />
            <Container>
                <MenuDetailsScreen menuId={menuIdString} />
            </Container>
        </>
    );
}
