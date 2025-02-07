import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { Container } from '~/components/Container';
import TruckDetailsScreen from '~/components/Screens/TruckDetailsScreen';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';

export default function TruckDetails() {
    const router = useRouter();
    const { truckId, companyId } = useLocalSearchParams();
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Truck Details',
                    headerBackTitle: 'Back',
                    headerRight: () => (
                        <Button
                            variant="ghost"
                            onPress={() => {
                                router.push(`/owner/companies/${companyId}/trucks/${truckId}/edit`);
                            }}>
                            <Text className="text-primary">Update</Text>
                        </Button>
                    ),
                }}
            />
            <Container>
                <TruckDetailsScreen />
            </Container>
        </>
    );
}
