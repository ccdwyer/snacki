import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUserAtom } from '~/atoms/AuthentictionAtoms';
import { useSelectedCompany } from '~/atoms/CompanyAtoms';
import { ErrorBoundary } from '~/components/Screens/ErrorBoundary';
import { Text } from '~/components/nativewindui/Text';
import { useGetUserCompanies } from '~/queries/CompanyQueries';
import { useGetTrucksForCurrentCompany } from '~/queries/UsersTruckQueries';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Button } from '~/components/Button';
import { Icon } from '@roninoss/icons';

const EmptyState = () => {
    const router = useRouter();
    return (
        <View className="flex-1 items-center justify-center gap-4 px-8">
            <Icon name="office-building" size={64} color="#9CA3AF" />
            <Text variant="title2" className="text-center">
                No Companies Yet
            </Text>
            <Text variant="body" color="secondary" className="text-center">
                Create your first company to start managing your food trucks on Snacki
            </Text>
            <Button
                variant="primary"
                className="mt-4"
                onPress={() => router.push('/owner/companies/create')}>
                <Text>Create Company</Text>
            </Button>
        </View>
    );
};

const TruckCard = ({ truck }: { truck: any }) => {
    const router = useRouter();
    const [selectedCompany] = useSelectedCompany();
    return (
        <Pressable onPress={() => router.push(`/owner/companies/${selectedCompany?.id}/trucks/${truck.id}`)}>
            <View className="overflow-hidden rounded-xl bg-card">
                <View className="p-4">
                    <Text variant="heading" className="mb-2">
                        {truck.name}
                    </Text>
                    {truck.description && (
                        <Text variant="body" className="text-foreground/80 mb-2">
                            {truck.description}
                        </Text>
                    )}
                    {truck.address && (
                        <Text variant="caption1" className="text-foreground/80">
                            📍 {truck.address}
                        </Text>
                    )}
                </View>
            </View>
        </Pressable>
    );
};

const CompanyScreen = () => {
    const theme = useTheme();
    const router = useRouter();
    const [user] = useUserAtom();
    const { data: companies, isLoading: loadingCompanies, error: companiesError, refetch } = useGetUserCompanies(user?.id ?? null);
    const [selectedCompany, setSelectedCompany] = useSelectedCompany();
    const { data: trucks, isLoading: loadingTrucks, error: trucksError } = useGetTrucksForCurrentCompany();
    const [showCompanySelector, setShowCompanySelector] = useState(false);

    const error = companiesError || trucksError;
    const loading = loadingCompanies || loadingTrucks;

    // Set the first company as selected if we have companies but none selected
    useEffect(() => {
        if (companies && companies.length > 0 && !selectedCompany) {
            setSelectedCompany(companies[0]);
        }
    }, [companies, selectedCompany, setSelectedCompany]);

    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => <DrawerToggleButton tintColor={theme.colors.primary} />,
                    headerTitle: () => (
                        <Pressable 
                            onPress={() => setShowCompanySelector(true)}
                            className="flex-row items-center justify-center ios:mt-2 android:mt-2">
                            <Text variant="heading" className="mr-1">
                                {selectedCompany?.name || 'Select Company'}
                            </Text>
                            <Icon name="chevron-down" size={16} color={theme.colors.primary} />
                        </Pressable>
                    ),
                    headerTitleAlign: 'center',
                }}
            />
            <Modal
                visible={showCompanySelector}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCompanySelector(false)}>
                <Pressable 
                    className="flex-1 bg-black/50 items-center justify-center"
                    onPress={() => setShowCompanySelector(false)}>
                    <View className="mx-4 w-full max-w-sm overflow-hidden rounded-xl bg-card">
                        <View className="p-4">
                            <Text variant="title3" className="mb-4">
                                Select Company
                            </Text>
                            <View className="gap-2">
                                {companies?.map((company) => (
                                    <Pressable
                                        key={company.id}
                                        className="rounded-lg p-3 active:bg-muted"
                                        onPress={() => {
                                            setSelectedCompany(company);
                                            setShowCompanySelector(false);
                                        }}>
                                        <Text>{company.name}</Text>
                                    </Pressable>
                                ))}
                            </View>
                            <View className="mt-4 h-[1px] bg-border" />
                            <Pressable
                                className="mt-4 rounded-lg p-3 active:bg-muted"
                                onPress={() => {
                                    router.push('/owner/companies/create');
                                    setShowCompanySelector(false);
                                }}>
                                <Text className="text-primary">Create New Company</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
            <ErrorBoundary loading={loading} error={error} dismiss={refetch}>
                <ScrollView className="flex-1 p-4">
                    {!selectedCompany ? (
                        <EmptyState />
                    ) : (
                        <View className="gap-6">
                            {/* Company Actions */}
                            <View className="flex-row gap-4">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onPress={() => router.push(`/owner/companies/${selectedCompany.id}/employees`)}>
                                    <Icon name="account-multiple" size={20} color={theme.colors.primary} />
                                    <Text className="ml-2">Employees</Text>
                                </Button>
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onPress={() => router.push(`/owner/companies/${selectedCompany.id}/trucks/create`)}>
                                    <Icon name="plus" size={20} color="black" />
                                    <Text className="ml-2 text-black">Add Truck</Text>
                                </Button>
                            </View>

                            {/* Trucks List */}
                            <View>
                                <Text variant="title2" className="mb-4">
                                    Food Trucks
                                </Text>
                                <View className="gap-4">
                                    {!trucks || trucks.length === 0 ? (
                                        <Text className="text-center text-foreground/60">
                                            No food trucks yet. Create one to get started!
                                        </Text>
                                    ) : (
                                        trucks.map((truck) => (
                                            <TruckCard key={truck.id} truck={truck} />
                                        ))
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </ErrorBoundary>
        </>
    );
};

export default CompanyScreen;