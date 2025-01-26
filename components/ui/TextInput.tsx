import React, { forwardRef } from 'react';
import { View, TextInput as RNTextInput, TextInputProps, Platform } from 'react-native';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/utils';

export interface CustomTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(({
    label,
    error,
    containerClassName,
    className = '',
    ...props
}, ref) => {
    const isWeb = Platform.OS === 'web';
    
    return (
        <View className={cn("space-y-1.5", containerClassName)}>
            {label && (
                <Text className="text-base font-medium text-foreground">
                    {label}
                </Text>
            )}
            <RNTextInput
                ref={ref}
                className={cn(
                    "px-4 py-3 bg-card text-foreground rounded-lg",
                    isWeb && "outline-none focus:ring-2 focus:ring-primary",
                    error && "border-2 border-destructive",
                    className
                )}
                placeholderTextColor="#666"
                {...props}
            />
            {error && (
                <Text className="text-sm text-destructive">
                    {error}
                </Text>
            )}
        </View>
    );
});

TextInput.displayName = 'TextInput'; 