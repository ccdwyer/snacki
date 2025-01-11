import { Icon } from '@roninoss/icons';
import { Link, Stack, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Container } from '~/components/Container';
import { ErrorBoundary } from '~/components/Screens/ErrorBoundary';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useGetTrucksForCurrentUser } from '~/queries/UsersTruckQueries';

type FoodTruck = {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    range_of_service: number | null;
    created_at: string;
};

export default function TruckList() {
    const router = useRouter();
    const { colors } = useColorScheme();

    const { data: trucks, isLoading: loading, error, refetch } = useGetTrucksForCurrentUser();

    return (
        <ErrorBoundary error={error} dismiss={refetch}>
            <>
                <Stack.Screen
                    options={{
                        title: 'My Food Trucks',
                        headerRight: () => (
                            <Button
                                variant="plain"
                                className="mr-2"
                                onPress={() => router.push('/owner/trucks/create')}>
                                <Icon name="plus" size={24} color={colors.primary} />
                            </Button>
                        ),
                    }}
                />
                <Container>
                    {loading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator />
                        </View>
                    ) : !trucks || trucks.length === 0 ? (
                        <View className="flex-1 items-center justify-center gap-4 px-8">
                            <Icon name="file-plus-outline" size={64} color={colors.grey} />
                            <Text variant="title2" className="text-center">
                                No Food Trucks Yet
                            </Text>
                            <Text variant="body" color="secondary" className="text-center">
                                Create your first food truck to start managing your business on
                                Snacki
                            </Text>
                            <Button
                                variant="primary"
                                className="mt-4"
                                onPress={() => router.push('/owner/trucks/create')}>
                                <Text>Create Food Truck</Text>
                            </Button>
                        </View>
                    ) : (
                        <View className="flex-1 gap-4 p-4">
                            {trucks.map((truck) => (
                                <Link
                                    key={truck.id}
                                    href={`/owner/trucks/${truck.id}/update`}
                                    asChild>
                                    <View className="rounded-lg border border-border bg-card p-4">
                                        <Text variant="heading" className="mb-1">
                                            {truck.name}
                                        </Text>
                                        {truck.description && (
                                            <Text variant="body" color="secondary" className="mb-2">
                                                {truck.description}
                                            </Text>
                                        )}
                                        {truck.address && (
                                            <Text variant="caption1" color="secondary">
                                                📍 {truck.address}
                                            </Text>
                                        )}
                                    </View>
                                </Link>
                            ))}
                        </View>
                    )}
                </Container>
            </>
        </ErrorBoundary>
    );
}
