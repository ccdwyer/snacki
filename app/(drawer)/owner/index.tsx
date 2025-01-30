import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, SafeAreaView } from 'react-native';

import { useUserAtom } from '~/atoms/AuthentictionAtoms';
import { useSelectedCompany } from '~/atoms/CompanyAtoms';
import { EventListItem } from '~/components/Entities/EventListItem';
import { ErrorBoundary } from '~/components/Screens/ErrorBoundary';
import {
    Text as GsText,
    Box,
    Button as GsButton,
    Card,
    ButtonText,
    Menu,
} from '~/components/gluestack-ui';
import { MenuItem, MenuItemLabel } from '~/components/gluestack-ui/menu';
import {
    useGetUserCompanies,
    useGetCompanyEventsForToday,
    useGetCompanyEventsForTomorrow,
} from '~/queries/CompanyQueries';
import { useGetTrucksForCurrentCompany } from '~/queries/UsersTruckQueries';

const EmptyState = () => {
    const router = useRouter();
    return (
        <Box className="flex-1 items-center justify-center gap-4 px-8">
            <Icon name="office-building" size={64} color="#9CA3AF" />
            <GsText className="text-center">No Companies Yet</GsText>
            <GsText className="text-center">
                Create your first company to start managing your food trucks on Snacki
            </GsText>
            <GsButton
                variant="solid"
                className="mt-4"
                onPress={() => router.push('/owner/companies/create')}>
                <GsText>Create Company</GsText>
            </GsButton>
        </Box>
    );
};

const TruckCard = ({ truck }: { truck: any }) => {
    const router = useRouter();
    const [selectedCompany] = useSelectedCompany();
    return (
        <Pressable
            onPress={() =>
                router.push(`/owner/companies/${selectedCompany?.id}/trucks/${truck.id}`)
            }>
            <Card variant="elevated" className="bg-background-0 shadow-sm">
                <GsText className="mb-2 font-bold text-purple-700 dark:text-purple-300">
                    {truck.name}
                </GsText>
                {truck.description && (
                    <GsText variant="body" className="mb-2">
                        {truck.description}
                    </GsText>
                )}
            </Card>
        </Pressable>
    );
};

const CompanyScreen = () => {
    const theme = useTheme();
    const router = useRouter();
    const [user] = useUserAtom();
    const {
        data: companies,
        isLoading: loadingCompanies,
        error: companiesError,
        refetch,
    } = useGetUserCompanies(user?.id ?? null);
    const [selectedCompany, setSelectedCompany] = useSelectedCompany();
    const {
        data: trucks,
        isLoading: loadingTrucks,
        error: trucksError,
    } = useGetTrucksForCurrentCompany();
    const [showCompanySelector, setShowCompanySelector] = useState(false);
    const { data: todayEvents } = useGetCompanyEventsForToday(selectedCompany?.id ?? '');
    const { data: tomorrowEvents } = useGetCompanyEventsForTomorrow(selectedCompany?.id ?? '');

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
                        <Menu
                            placement="bottom"
                            offset={5}
                            disabledKeys={['Settings']}
                            className="bg-background-0"
                            trigger={({ ...triggerProps }) => (
                                <Pressable
                                    {...triggerProps}
                                    className="ios:mt-2 android:mt-2 flex-row items-center justify-center">
                                    <GsText className="mr-1">
                                        {selectedCompany?.name || 'Select Company'}
                                    </GsText>
                                    <Icon
                                        name="chevron-down"
                                        size={16}
                                        color={theme.colors.primary}
                                    />
                                </Pressable>
                            )}>
                            {companies?.map((company) => (
                                <MenuItem
                                    key={company.id}
                                    textValue={company.name}
                                    onPress={() => setSelectedCompany(company)}>
                                    <MenuItemLabel size="sm">{company.name}</MenuItemLabel>
                                </MenuItem>
                            ))}

                            <MenuItem
                                key="Create Company"
                                textValue="Create Company"
                                onPress={() => router.push('/owner/companies/create')}
                                className="flex-row items-center">
                                <MenuItemLabel size="sm">+ Create Company</MenuItemLabel>
                            </MenuItem>
                        </Menu>
                    ),
                    headerTitleAlign: 'center',
                }}
            />
            <SafeAreaView className="flex-1 bg-background-50">
                <ErrorBoundary loading={loading} error={error} dismiss={refetch}>
                    <ScrollView className="flex-1 p-4">
                        {!selectedCompany ? (
                            <EmptyState />
                        ) : (
                            <Box className="gap-6">
                                {/* Company Actions */}
                                <Box className="ios:flex-col android:flex-col gap-4 web:flex-row">
                                    <GsButton
                                        variant="outline"
                                        onPress={() =>
                                            router.push(
                                                `/owner/companies/${selectedCompany.id}/employees`
                                            )
                                        }>
                                        <Icon
                                            name="account-multiple"
                                            size={20}
                                            color={theme.colors.primary}
                                        />
                                        <ButtonText className="ml-2">Employees</ButtonText>
                                    </GsButton>
                                    <Box className="flex-1 flex-row gap-6">
                                        <GsButton
                                            variant="outline"
                                            className="flex-1"
                                            onPress={() =>
                                                router.push(
                                                    `/owner/companies/${selectedCompany.id}/trucks/create`
                                                )
                                            }>
                                            <Icon name="plus" size={20} color="black" />
                                            <ButtonText className="ml-2">Add Truck</ButtonText>
                                        </GsButton>
                                        <GsButton
                                            variant="outline"
                                            className="flex-1"
                                            onPress={() =>
                                                router.push(
                                                    `/owner/companies/${selectedCompany.id}/events/create`
                                                )
                                            }>
                                            <Icon name="plus" size={20} color="black" />
                                            <ButtonText className="ml-2">Create Event</ButtonText>
                                        </GsButton>
                                    </Box>
                                </Box>

                                {/* Today's Events */}
                                <Box>
                                    <GsText className="mb-4">Today's Events</GsText>
                                    <Box className="gap-4">
                                        {!todayEvents || todayEvents.length === 0 ? (
                                            <GsText className="text-center">
                                                No events scheduled for today
                                            </GsText>
                                        ) : (
                                            todayEvents.map((event) => (
                                                <EventListItem key={event.id} event={event} />
                                            ))
                                        )}
                                    </Box>
                                </Box>

                                {/* Tomorrow's Events */}
                                <Box>
                                    <GsText className="mb-4">Tomorrow's Events</GsText>
                                    <Box className="gap-4">
                                        {!tomorrowEvents || tomorrowEvents.length === 0 ? (
                                            <GsText className="text-center">
                                                No events scheduled for tomorrow
                                            </GsText>
                                        ) : (
                                            tomorrowEvents.map((event) => (
                                                <EventListItem key={event.id} event={event} />
                                            ))
                                        )}
                                    </Box>
                                </Box>

                                {/* Trucks List */}
                                <Box>
                                    <GsText className="mb-4">Food Trucks</GsText>
                                    <Box className="gap-4">
                                        {!trucks || trucks.length === 0 ? (
                                            <GsText className="text-center">
                                                No food trucks yet. Create one to get started!
                                            </GsText>
                                        ) : (
                                            trucks.map((truck) => (
                                                <TruckCard key={truck.id} truck={truck} />
                                            ))
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </ScrollView>
                </ErrorBoundary>
            </SafeAreaView>
        </>
    );
};

export default CompanyScreen;
