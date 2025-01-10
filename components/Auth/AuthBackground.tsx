import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, View } from 'react-native';

import { TextStroke } from '~/components/TextStroke';
import { Text } from '~/components/nativewindui/Text';

export function AuthBackground() {
    const theme = useTheme();

    return (
        <>
            <View className="absolute bottom-0 left-0 right-0 top-0 opacity-35">
                <Image
                    source={require('~/assets/foodtruckbg.png')}
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                    }}
                    resizeMode="cover"
                />
            </View>
            <LinearGradient
                colors={
                    theme.dark
                        ? ['rgba(0,0,0,0.0)', 'rgba(0,0,0,1)']
                        : ['rgba(255,255,255,0.0)', 'rgba(255,255,255,1)']
                }
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300 }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />
            <View className="w-full items-center justify-center opacity-80">
                <TextStroke color="white" stroke={4}>
                    <Text className="p-3 font-[Phoria] text-8xl tracking-[0.075em] text-[#00D6C8]">
                        Snacki
                    </Text>
                </TextStroke>
                <Text variant="caption2">Made with ❤️ on Florida's Treasure Coast</Text>
            </View>
        </>
    );
}
