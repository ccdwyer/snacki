import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { Text } from '~/components/nativewindui/Text';
import { Database } from '~/types/supabaseTypes';

type Event = Database['public']['Tables']['events']['Row'];

interface EventListItemProps {
    event: Event;
    onPress?: () => void;
}

export const EventListItem = ({ event, onPress }: EventListItemProps) => {
    const theme = useTheme();

    return (
        <Pressable
            onPress={onPress}
            className="mb-4 rounded-lg border border-border bg-card p-4 active:bg-muted">
            <Text variant="heading" className="text-foreground">
                {event.title}
            </Text>
            <Text className="mb-2 text-foreground/60">
                {event.description || 'No description available'}
            </Text>
            <View className="flex-row items-center">
                <FontAwesome name="calendar" size={16} color={theme.colors.primary} />
                <Text className="ml-2 text-primary">
                    {new Date(event.start_time || '').toLocaleDateString()}
                </Text>
            </View>
            {event.location_desc && (
                <View className="mt-1 flex-row items-center">
                    <FontAwesome name="map-marker" size={16} color={theme.colors.primary} />
                    <Text className="ml-2 text-primary">{event.location_desc}</Text>
                </View>
            )}
        </Pressable>
    );
};
