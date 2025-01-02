import React from 'react';
import { Text } from '~/components/nativewindui/Text';
import { View, Image, Dimensions } from 'react-native';
import { Truck } from '~/types/Truck';
import { Icon } from '@roninoss/icons';
import { useTheme } from '@react-navigation/native';

interface FoodTruckListItemProps {
  truck: Truck;
}

export const FoodTruckListItem: React.FC<FoodTruckListItemProps> = ({ truck }) => {
    const theme = useTheme();
  return (
    <View className="w-60 mb-4">
        <View className="w-full aspect-video mb-2">
            <Image source={{uri: 'https://picsum.photos/200/300'}} className="h-full rounded-lg" />
        </View>
        <View className="flex-row justify-between">
            <View>
                <Text variant="heading">{truck.name}</Text>
                <Text variant="caption1">{truck.rating} ⭐️ ({truck.ratingCount})</Text>
            </View>
            <View className="items-end">
                <Icon name={truck.isFavorite ? "heart" : "heart-outline"} size={24} color={truck.isFavorite ? theme.colors.primary : theme.colors.text} />
                <Text variant="caption1">{Math.round(Math.random() * 10)} mi</Text>
            </View>
        </View>
    </View>
  );
};
