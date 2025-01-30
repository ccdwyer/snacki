import { useTheme } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import React from 'react';

import { Box, Image, Text, HStack, VStack, Card } from '~/components/gluestack-ui';
import { Truck } from '~/types/Truck';

interface FoodTruckListItemProps {
    truck: Truck;
}

export const FoodTruckListItem: React.FC<FoodTruckListItemProps> = ({ truck }) => {
    const theme = useTheme();
    return (
        <Card variant="elevated" className="mb-4 w-60">
            <Box className="mb-2 aspect-video w-full">
                <Image
                    source={{ uri: 'https://picsum.photos/200/300' }}
                    className="h-full rounded-lg"
                    alt={`${truck.name} food truck`}
                />
            </Box>
            <HStack className="justify-between">
                <VStack>
                    <Text className="text-lg font-bold">{truck.name}</Text>
                    <Text className="text-foreground/80 text-sm">
                        {truck.rating} ⭐️ ({truck.ratingCount})
                    </Text>
                </VStack>
                <VStack className="items-end">
                    <Icon
                        name={truck.isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={truck.isFavorite ? theme.colors.primary : theme.colors.text}
                    />
                    <Text className="text-foreground/80 text-sm">
                        {Math.round(Math.random() * 10)} mi
                    </Text>
                </VStack>
            </HStack>
        </Card>
    );
};
