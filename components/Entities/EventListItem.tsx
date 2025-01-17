import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Pressable } from 'react-native';

import { Text } from '~/components/nativewindui/Text';
import { Database } from '~/types/supabaseTypes';

type Event = Database['public']['Tables']['events']['Row'];

interface EventListItemProps {
    event: Event;
    onPress?: () => void;
}

export const EventListItem = ({ event, onPress }: EventListItemProps) => {
    return (
        <Pressable
            onPress={onPress}
            className="mb-4 rounded-lg border border-gray-200 bg-white p-4 active:bg-gray-50">
            <Text className="text-lg font-semibold text-gray-900">{event.title}</Text>
            <Text className="mb-2 text-gray-600">
                {event.description || 'No description available'}
            </Text>
            <View className="flex-row items-center">
                <FontAwesome name="calendar" size={16} color="#0d9488" />
                <Text className="ml-2 text-teal-600">
                    {new Date(event.start_time || '').toLocaleDateString()}
                </Text>
            </View>
            {event.location_desc && (
                <View className="mt-1 flex-row items-center">
                    <FontAwesome name="map-marker" size={16} color="#0d9488" />
                    <Text className="ml-2 text-teal-600">{event.location_desc}</Text>
                </View>
            )}
        </Pressable>
    );
};
