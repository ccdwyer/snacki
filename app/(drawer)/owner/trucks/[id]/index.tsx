import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { Container } from '~/components/Container';
import TruckDetailsScreen from '~/components/Screens/TruckDetailsScreen';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';

export default function TruckDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Truck Details',
                    headerRight: () => (
                        <Button
                            variant="ghost"
                            onPress={() => {
                                router.push(`/owner/trucks/${id}/edit`);
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
