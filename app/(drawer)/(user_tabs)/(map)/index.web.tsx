import { Stack } from 'expo-router';
import { View } from 'react-native';

import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';

export default function MapScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Events' }} />
            <Container>
                <View className="flex-1 items-center justify-center">
                    <Text variant="title2" className="mb-2">
                        Map View
                    </Text>
                    <Text className="text-center text-gray-500">
                        The map is currently only available on mobile devices.
                        {'\n'}
                        Please use the mobile app to view the map.
                    </Text>
                </View>
            </Container>
        </>
    );
}
