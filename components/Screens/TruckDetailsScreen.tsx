import { FontAwesome } from '@expo/vector-icons';
import { Icon } from '@roninoss/icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Alert, ScrollView, TouchableHighlight, Linking, Pressable } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { ErrorBoundary } from './ErrorBoundary';

import { useUserAtom } from '~/atoms/AuthentictionAtoms';
import { EventListItem } from '~/components/Entities/EventListItem';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { useGetTruckById } from '~/queries/TruckQueries';
import { useDeleteMenuForCurrentUser } from '~/queries/UsersTruckQueries';
import { Database } from '~/types/supabaseTypes';

type Tab = 'details' | 'menus' | 'events';
type Menu = Database['public']['Tables']['menus']['Row'];

interface MenuListItemProps {
    menu: Menu;
    isOwner: boolean;
    truckId: string;
}

const MenuListItem = ({ menu, isOwner, truckId }: MenuListItemProps) => {
    const { colors } = useColorScheme();
    const deleteMenu = useDeleteMenuForCurrentUser();

    const handleDelete = () => {
        Alert.alert(
            'Delete Menu',
            'Are you sure you want to delete this menu? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteMenu.mutate(
                            { menuId: menu.id, truckId },
                            {
                                onError: (error: Error) => {
                                    Alert.alert('Error', error.message);
                                },
                            }
                        );
                    },
                },
            ]
        );
    };

    const renderRightActions = () => {
        if (!isOwner) return null;

        return (
            <View className="ml-[-8] flex-row pb-4">
                <Button
                    variant="ghost"
                    className="w-32 justify-center bg-red-500 px-4"
                    onPress={handleDelete}>
                    <Text className="text-white">Delete</Text>
                </Button>
            </View>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions} enabled={isOwner}>
            <Link href={`/owner/trucks/${truckId}/menu/${menu.id}`} asChild>
                <TouchableHighlight
                    className="mb-4 w-full rounded-lg border border-gray-200 bg-card p-4"
                    underlayColor={colors.background}>
                    <>
                        <Text className="text-lg font-semibold text-foreground">{menu.name}</Text>
                        <Text className="text-foreground/80">
                            {menu.description || 'No description available'}
                        </Text>
                    </>
                </TouchableHighlight>
            </Link>
        </Swipeable>
    );
};

export const TruckDetailsScreen = () => {
    const router = useRouter();
    const { colors } = useColorScheme();
    const [user] = useUserAtom();
    const { id } = useLocalSearchParams();
    const truckId = Array.isArray(id) ? id[0] : id;
    const [activeTab, setActiveTab] = useState<Tab>('details');
    const { data: truck, isLoading: loading, error, refetch } = useGetTruckById(truckId);

    const isOwner = user?.id === truck?.user_id;

    const tabs: { id: Tab; label: string }[] = [
        { id: 'details', label: 'Details' },
        { id: 'menus', label: 'Menus' },
        { id: 'events', label: 'Events' },
    ];

    return (
        <ErrorBoundary loading={loading} error={error} dismiss={refetch}>
            {truck && (
                <View className="flex-1 bg-background">
                    {/* Banner */}
                    <View className="bg-teal-600 px-4 py-6">
                        <Text className="text-center text-2xl font-bold text-white">
                            {truck.name}
                        </Text>
                        <View className="absolute bottom-0 left-0 flex-row items-center justify-center gap-4 p-2">
                            {truck.facebook_url && (
                                <Pressable onPress={() => Linking.openURL(truck.facebook_url)}>
                                    <FontAwesome name="facebook" size={20} color="#FFF" />
                                </Pressable>
                            )}
                            {truck.instagram_url && (
                                <Pressable onPress={() => Linking.openURL(truck.instagram_url)}>
                                    <FontAwesome name="instagram" size={20} color="#FFF" />
                                </Pressable>
                            )}
                            {truck.tiktok_url && (
                                <Pressable onPress={() => Linking.openURL(truck.tiktok_url)}>
                                    <FontAwesome name="clock-o" size={20} color="#FFF" />
                                </Pressable>
                            )}
                            {truck.website_url && (
                                <Pressable onPress={() => Linking.openURL(truck.website_url)}>
                                    <FontAwesome name="globe" size={20} color="#FFF" />
                                </Pressable>
                            )}
                        </View>
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
                                    <Text className="text-foreground/80">
                                        {truck.description || 'No description available'}
                                    </Text>
                                </View>

                                <View>
                                    <Text className="mb-1 text-lg font-semibold text-foreground">
                                        Location
                                    </Text>
                                    <Text className="text-foreground/80">
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
                                {isOwner && (
                                    <Button
                                        variant="primary"
                                        className="mb-4"
                                        onPress={() =>
                                            router.push(`/owner/trucks/${truckId}/menu/create`)
                                        }>
                                        <Icon name="plus" size={20} color={colors.foreground} />
                                        <Text className="ml-2">Create Menu</Text>
                                    </Button>
                                )}
                                {truck.menus?.length > 0 ? (
                                    truck.menus.map((menu) => (
                                        <MenuListItem
                                            key={menu.id}
                                            menu={menu}
                                            isOwner={isOwner}
                                            truckId={truckId}
                                        />
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
            )}
            {!truck && (
                <View className="flex-1 items-center justify-center p-4">
                    <Text className="text-center text-lg text-gray-600">
                        Could not find truck details
                    </Text>
                </View>
            )}
        </ErrorBoundary>
    );
};

export default TruckDetailsScreen;
