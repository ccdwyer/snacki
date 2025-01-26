import { Icon } from '@roninoss/icons';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Container } from '~/components/Container';
import { ErrorBoundary } from '~/components/Screens/ErrorBoundary';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useGetTrucksForCurrentCompany } from '~/queries/UsersTruckQueries';

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
    const { companyId } = useLocalSearchParams();

    const { data: trucks, isLoading: loading, error, refetch } = useGetTrucksForCurrentCompany();

    return (
        <ErrorBoundary error={error} dismiss={refetch}>
            <>
                <Stack.Screen
                    options={{
                        title: 'My Food Trucks',
                        headerRight: () => (
                            <Button
                                variant="ghost"
                                className="mr-2"
                                onPress={() => router.push(`/owner/companies/${companyId}/trucks/create`)}>
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
                                onPress={() => router.push(`/owner/companies/${companyId}/trucks/create`)}>
                                <Text>Create Food Truck</Text>
                            </Button>
                        </View>
                    ) : (
                        <View className="flex-1 gap-4 p-4">
                            {trucks.map((truck) => (
                                <Link key={truck.id} href={`/owner/companies/${companyId}/trucks/${truck.id}`} asChild>
                                    <Pressable>
                                        <View className="rounded-lg border border-border bg-card p-4">
                                            <Text variant="heading" className="mb-1">
                                                {truck.name}
                                            </Text>
                                            {truck.description && (
                                                <Text
                                                    variant="body"
                                                    className="text-foreground/80 mb-2">
                                                    {truck.description}
                                                </Text>
                                            )}
                                            {truck.address && (
                                                <Text
                                                    variant="caption1"
                                                    className="text-foreground/80">
                                                    📍 {truck.address}
                                                </Text>
                                            )}
                                        </View>
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}
                </Container>
            </>
        </ErrorBoundary>
    );
}
