import React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

import { Button } from '~/components/Button';

import { Text } from '~/components/nativewindui/Text';

export const ErrorBoundary = ({
    children,
    error,
    dismiss,
    loading,
}: {
    children: React.ReactNode;
    error?: Error | null;
    dismiss?: () => void;
    loading?: boolean;
}) => {
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#0d9488" />
            </View>
        );
    }

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
            <Button 
                variant="primary" 
                className="mt-8" 
                onPress={() => dismiss?.()}
            >
                <Text className="font-bold">Try Again</Text>
            </Button>
        </View>
    );
};
