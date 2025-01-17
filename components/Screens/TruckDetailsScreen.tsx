import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

import { ErrorBoundary } from './ErrorBoundary';

import { EventListItem } from '~/components/Entities/EventListItem';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useGetTruckById } from '~/queries/TruckQueries';

type Tab = 'details' | 'menus' | 'events';

export const TruckDetailsScreen = () => {
    const { id } = useLocalSearchParams();
    const truckId = Array.isArray(id) ? id[0] : id;
    const [activeTab, setActiveTab] = useState<Tab>('details');
    const { data: truck, isLoading: loading, error, refetch } = useGetTruckById(truckId);

    if (!truck) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-center text-lg text-gray-600">
                    Could not find truck details
                </Text>
            </View>
        );
    }

    const tabs: { id: Tab; label: string }[] = [
        { id: 'details', label: 'Details' },
        { id: 'menus', label: 'Menus' },
        { id: 'events', label: 'Events' },
    ];

    return (
        <ErrorBoundary loading={loading} error={error} dismiss={refetch}>
            <View className="flex-1 bg-background">
                {/* Banner */}
                <View className="bg-teal-600 px-4 py-6">
                    <Text className="text-center text-2xl font-bold text-white">{truck.name}</Text>
                </View>

                {/* Tabs */}
                <View className="border-foreground/30 flex-row border-b">
                    {tabs.map((tab) => (
                        <View
                            key={tab.id}
                            className="flex-1"
                            accessibilityRole="tab"
                            accessibilityState={{ selected: activeTab === tab.id }}>
                            <Text
                                onPress={() => setActiveTab(tab.id)}
                                className={cn(
                                    'py-3 text-center text-base font-medium',
                                    activeTab === tab.id
                                        ? 'border-b-2 border-teal-600 text-primary'
                                        : 'text-foreground'
                                )}>
                                {tab.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Tab Content */}
                <ScrollView className="flex-1">
                    {activeTab === 'details' && (
                        <View className="gap-4 space-y-4 p-4">
                            <View>
                                <Text className="mb-1 text-lg font-semibold text-foreground">
                                    About
                                </Text>
                                <Text className="text-foreground">
                                    {truck.description || 'No description available'}
                                </Text>
                            </View>

                            <View>
                                <Text className="mb-1 text-lg font-semibold text-foreground">
                                    Location
                                </Text>
                                <Text className="text-foreground">
                                    {truck.address || 'Location not available'}
                                </Text>
                            </View>

                            <View>
                                <Text className="mb-1 text-lg font-semibold text-foreground">
                                    Cuisine Types
                                </Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {truck.cuisine_types?.map((cuisineRelation) => (
                                        <View
                                            key={cuisineRelation.cuisine_types.id}
                                            className="rounded-full bg-teal-100 px-3 py-1">
                                            <Text className="text-teal-800">
                                                {cuisineRelation.cuisine_types.name}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === 'menus' && (
                        <View className="p-4">
                            {truck.menus?.length > 0 ? (
                                truck.menus.map((menu) => (
                                    <View
                                        key={menu.id}
                                        className="mb-4 rounded-lg border border-gray-200 p-4">
                                        <Text className="text-lg font-semibold text-gray-900">
                                            {menu.name}
                                        </Text>
                                        <Text className="text-gray-600">
                                            {menu.description || 'No description available'}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text className="text-center text-gray-500">
                                    No menus available
                                </Text>
                            )}
                        </View>
                    )}

                    {activeTab === 'events' && (
                        <View className="p-4">
                            {truck.events?.length > 0 ? (
                                truck.events.map((eventRelation) => (
                                    <EventListItem
                                        key={eventRelation.events.id}
                                        event={eventRelation.events}
                                    />
                                ))
                            ) : (
                                <Text className="text-center text-gray-500">
                                    No upcoming events
                                </Text>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </ErrorBoundary>
    );
};

export default TruckDetailsScreen;
