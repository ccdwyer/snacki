import { useTheme } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import React from 'react';
import { View, Image } from 'react-native';

import { Text } from '~/components/nativewindui/Text';
import { Truck } from '~/types/Truck';

interface FoodTruckListItemProps {
    truck: Truck;
}

export const FoodTruckListItem: React.FC<FoodTruckListItemProps> = ({ truck }) => {
    const theme = useTheme();
    return (
        <View className="mb-4 w-60">
            <View className="mb-2 aspect-video w-full">
                <Image
                    source={{ uri: 'https://picsum.photos/200/300' }}
                    className="h-full rounded-lg"
                />
            </View>
            <View className="flex-row justify-between">
                <View>
                    <Text variant="heading">{truck.name}</Text>
                    <Text variant="caption1">
                        {truck.rating} ⭐️ ({truck.ratingCount})
                    </Text>
                </View>
                <View className="items-end">
                    <Icon
                        name={truck.isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={truck.isFavorite ? theme.colors.primary : theme.colors.text}
                    />
                    <Text variant="caption1">{Math.round(Math.random() * 10)} mi</Text>
                </View>
            </View>
        </View>
    );
};
