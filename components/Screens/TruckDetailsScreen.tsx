import { FontAwesome } from '@expo/vector-icons';
import { Icon } from '@roninoss/icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Alert, ScrollView, TouchableHighlight, Linking, Pressable, Modal, Platform } from 'react-native';

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
    truck: Database['public']['Tables']['food_trucks']['Row'];
}

const MenuListItem = ({ menu, isOwner, truck }: MenuListItemProps) => {
    const { colors } = useColorScheme();
    const deleteMenu = useDeleteMenuForCurrentUser();
    const router = useRouter();
    const [showActions, setShowActions] = useState(false);

    const handleDelete = () => {
        setShowActions(false);
        console.log('Deleting menu:', menu.id, 'from truck:', truck.id);
        
        const confirmDelete = () => {
            console.log('Delete confirmed, calling mutation...');
            deleteMenu.mutate(
                { menuId: menu.id, truckId: truck.id },
                {
                    onSuccess: () => {
                        console.log('Delete successful');
                        if (Platform.OS === 'web') {
                            alert('Menu deleted successfully');
                        } else {
                            Alert.alert('Success', 'Menu deleted successfully');
                        }
                    },
                    onError: (error: Error) => {
                        console.error('Delete failed:', error);
                        if (Platform.OS === 'web') {
                            alert(error.message);
                        } else {
                            Alert.alert('Error', error.message);
                        }
                    },
                }
            );
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this menu? This action cannot be undone.')) {
                confirmDelete();
            }
        } else {
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
                        onPress: confirmDelete,
                    },
                ]
            );
        }
    };

    return (
        <>
            <View className="mb-4 w-full flex-row items-center rounded-lg border border-gray-200 bg-card">
                <Link
                    href={`/owner/companies/${truck.company_id}/trucks/${truck.id}/menu/${menu.id}`}
                    asChild>
                    <TouchableHighlight
                        className="flex-1 p-4"
                        underlayColor={colors.background}>
                        <>
                            <Text className="text-lg font-semibold text-foreground">{menu.name}</Text>
                            <Text className="text-foreground/80">
                                {menu.description || 'No description available'}
                            </Text>
                        </>
                    </TouchableHighlight>
                </Link>
                {isOwner && (
                    <Pressable 
                        onPress={() => setShowActions(true)}
                        className="px-4">
                        <Text className="text-2xl text-foreground/60">⋮</Text>
                    </Pressable>
                )}
            </View>

            <Modal
                visible={showActions}
                transparent
                animationType="fade"
                onRequestClose={() => setShowActions(false)}>
                <Pressable 
                    className="flex-1 bg-black/50 items-center justify-center"
                    onPress={() => setShowActions(false)}>
                    <View className="mx-4 w-full max-w-sm overflow-hidden rounded-xl bg-card">
                        <View className="p-4">
                            <Text variant="title3" className="mb-4">
                                Menu Actions
                            </Text>
                            <View className="gap-2">
                                <Pressable
                                    className="rounded-lg p-3 active:bg-muted"
                                    onPress={() => {
                                        setShowActions(false);
                                        router.push(`/owner/companies/${truck.company_id}/trucks/${truck.id}/menu/${menu.id}/edit`);
                                    }}>
                                    <View className="flex-row items-center">
                                        <Icon name="pencil" size={20} color={colors.foreground} />
                                        <Text className="ml-2">Edit Menu</Text>
                                    </View>
                                </Pressable>
                                <Pressable
                                    className="rounded-lg p-3 active:bg-muted"
                                    onPress={handleDelete}>
                                    <View className="flex-row items-center">
                                        <Icon name="trash-can" size={20} color={colors.destructive} />
                                        <Text className="ml-2 text-destructive">Delete Menu</Text>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

export const TruckDetailsScreen = () => {
    const router = useRouter();
    const { colors } = useColorScheme();
    const [user] = useUserAtom();
    const { truckId: id } = useLocalSearchParams();
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
                                            router.push(
                                                `/owner/companies/${truck.company_id}/trucks/${truck.id}/menu/create`
                                            )
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
                                            truck={truck}
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
                                {isOwner && (
                                    <Button
                                        variant="primary"
                                        className="mb-4"
                                        onPress={() =>
                                            router.push(
                                                `/owner/companies/${truck.company_id}/trucks/${truck.id}/events/create`
                                            )
                                        }>
                                        <Icon name="plus" size={20} color={colors.foreground} />
                                        <Text className="ml-2">Create Event</Text>
                                    </Button>
                                )}
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
