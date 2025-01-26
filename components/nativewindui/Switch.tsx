import React from 'react';
import { Switch as RNSwitch } from 'react-native';

import { useColorScheme } from '~/lib/useColorScheme';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

export const Switch = ({ value, onValueChange, disabled }: SwitchProps) => {
    const { colors } = useColorScheme();

    return (
        <RNSwitch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={{ false: colors.grey3, true: colors.primary }}
            thumbColor={colors.card}
            ios_backgroundColor={colors.grey3}
        />
    );
}; 