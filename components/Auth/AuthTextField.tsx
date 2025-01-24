import React from 'react';
import { Platform, View } from 'react-native';

import { TextField } from '~/components/nativewindui/TextField/TextField';
import { Text } from '~/components/nativewindui/Text';

type AuthTextFieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'email-address' | 'default';
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    textContentType?: 'password' | 'emailAddress' | 'name' | 'username';
    onSubmitEditing?: () => void;
    returnKeyType?: 'done' | 'next' | 'go';
    blurOnSubmit?: boolean;
    ref?: React.RefObject<any>;
};

export const AuthTextField = React.forwardRef<any, AuthTextFieldProps>(({
    label,
    value,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
    autoCapitalize = 'none',
    textContentType,
    onSubmitEditing,
    returnKeyType = 'next',
    blurOnSubmit = false,
}, ref) => {
    const isWeb = Platform.OS === 'web';

    return (
        <View className="gap-1.5">
            {isWeb && (
                <Text variant="caption1" className="text-secondary">
                    {label}
                </Text>
            )}
            <TextField
                ref={ref}
                className="rounded-lg bg-transparent"
                containerClassName="rounded-lg border border-border bg-card"
                placeholder={isWeb ? `Enter your ${label.toLowerCase()}` : label}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                textContentType={textContentType}
                secureTextEntry={secureTextEntry}
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                blurOnSubmit={blurOnSubmit}
                enablesReturnKeyAutomatically
            />
        </View>
    );
});
