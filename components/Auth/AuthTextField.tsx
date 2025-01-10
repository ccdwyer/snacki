import React from 'react';
import { Platform } from 'react-native';

import { TextField } from '~/components/nativewindui/TextField/TextField';

type AuthTextFieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'email-address' | 'default';
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    textContentType?: 'password' | 'emailAddress' | 'name' | 'username';
};

export function AuthTextField({
    label,
    value,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
    autoCapitalize = 'none',
    textContentType,
}: AuthTextFieldProps) {
    return (
        <TextField
            placeholder={Platform.OS === 'android' ? '' : label}
            label={Platform.OS === 'ios' ? '' : label}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            textContentType={textContentType}
            secureTextEntry={secureTextEntry}
            autoCorrect={false}
            value={value}
            onChangeText={onChangeText}
            returnKeyType="next"
            enablesReturnKeyAutomatically
        />
    );
}
