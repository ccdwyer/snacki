import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { Container } from '~/components/Container';
import MenuDetailsScreen from '~/components/Screens/MenuDetailsScreen';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';

export default function TruckDetails() {
    const router = useRouter();
    const { companyId, truckId, menuId } = useLocalSearchParams();
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Menu Details',
                    headerBackTitle: 'Back',
                    headerRight: () => (
                        <Button
                            variant="ghost"
                            onPress={() => {
                                router.push(
                                    `/owner/companies/${companyId}/trucks/${truckId}/menu/${menuId}/edit`
                                );
                            }}>
                            <Text className="text-primary">Update</Text>
                        </Button>
                    ),
                }}
            />
            <Container>
                <MenuDetailsScreen />
            </Container>
        </>
    );
}
