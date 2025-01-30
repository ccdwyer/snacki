import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from '@react-navigation/native';

import { Text, Pressable, HStack, Card } from '~/components/gluestack-ui';
import { Database } from '~/types/supabaseTypes';

type Event = Database['public']['Tables']['events']['Row'];

interface EventListItemProps {
    event: Event;
    onPress?: () => void;
}

export const EventListItem = ({ event, onPress }: EventListItemProps) => {
    const theme = useTheme();

    return (
        <Pressable onPress={onPress}>
            <Card className="mb-4 rounded-lg border border-border bg-card p-4 active:bg-muted">
                <Text className="text-lg font-bold text-foreground">{event.title}</Text>
                <Text className="mb-2 text-foreground/60">
                    {event.description || 'No description available'}
                </Text>
                <HStack className="items-center">
                    <FontAwesome name="calendar" size={16} color={theme.colors.primary} />
                    <Text className="ml-2 text-primary">
                        {new Date(event.start_time || '').toLocaleDateString()}
                    </Text>
                </HStack>
                {event.location_desc && (
                    <HStack className="mt-1 items-center">
                        <FontAwesome name="map-marker" size={16} color={theme.colors.primary} />
                        <Text className="ml-2 text-primary">{event.location_desc}</Text>
                    </HStack>
                )}
            </Card>
        </Pressable>
    );
};
