import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@roninoss/icons';
import { useTheme } from '@react-navigation/native';

type SwipeActionProps = {
    icon: 'pencil' | 'trash-can';
    onPress: () => void;
    variant?: 'default' | 'destructive';
};

export const SwipeAction = ({ icon, onPress, variant = 'default' }: SwipeActionProps) => {
    const theme = useTheme();
    
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`h-full w-16 items-center justify-center ${
                variant === 'destructive' ? 'bg-red-500' : 'bg-primary'
            }`}>
            <Icon 
                name={icon} 
                size={24} 
                color={variant === 'destructive' ? 'white' : 'black'} 
            />
        </TouchableOpacity>
    );
}; 