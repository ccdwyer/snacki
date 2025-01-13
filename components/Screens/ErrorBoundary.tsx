import React from 'react';
import { View, Image } from 'react-native';

import { Button } from '../nativewindui/Button';

import { Text } from '~/components/nativewindui/Text';

export const ErrorBoundary = ({
    children,
    error,
    dismiss,
}: {
    children: React.ReactNode;
    error?: Error | null;
    dismiss?: () => void;
}) => {
    if (!error) {
        return <>{children}</>;
    }

    return (
        <View className="flex-1 items-center justify-center gap-2">
            <Image
                source={require('~/assets/broken_food_truck.png')}
                className="h-64 w-80"
                resizeMode="contain"
            />
            <Text variant="largeTitle">Uh oh!</Text>
            <Text variant="body">Error Encountered:</Text>
            <Text variant="body" className="mt-[-8]">
                {error?.message}
            </Text>
            <Button className="mt-8" onPress={() => dismiss?.()}>
                <Text className="font-bold">Try Again</Text>
            </Button>
        </View>
    );
};