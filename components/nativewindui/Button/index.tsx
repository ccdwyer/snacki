import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { ActivityIndicator, Platform, Pressable, PressableProps, StyleSheet } from 'react-native';

import { cn } from '../../../lib/utils';
import { Text } from '../Text';

const buttonVariants = cva(
    'items-center justify-center rounded-lg active:opacity-70 disabled:opacity-50',
    {
        variants: {
            variant: {
                primary: 'bg-primary',
                secondary: 'bg-transparent',
                tonal: 'bg-gray-100 dark:bg-gray-800',
                plain: '',
            },
            size: {
                none: '',
                sm: 'h-8 px-3',
                md: 'h-10 px-4',
                lg: 'h-12 px-6',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

type ButtonProps = Omit<PressableProps, 'disabled'> &
    Omit<VariantProps<typeof buttonVariants>, 'variant'> & {
        variant?: 'primary' | 'secondary' | 'tonal' | 'plain';
        loading?: boolean;
        className?: string;
        disabled?: boolean;
    };

export function Button({
    className,
    variant,
    size,
    disabled,
    loading,
    children,
    style,
    ...props
}: ButtonProps) {
    const combinedStyle = StyleSheet.flatten([
        style,
        {
            opacity: disabled || loading ? 0.5 : 1,
        },
    ]);

    const getContrastColor = () => {
        switch (variant) {
            case 'primary':
                return 'text-white';
            case 'secondary':
            case 'tonal':
            case 'plain':
            default:
                return 'text-primary';
        }
    };

    const renderChildren = () => {
        if (loading) {
            return (
                <ActivityIndicator
                    color={Platform.select({
                        ios: variant === 'primary' ? '#FFFFFF' : '#007AFF',
                        android: variant === 'primary' ? '#FFFFFF' : '#2196F3',
                    })}
                />
            );
        }

        if (typeof children === 'string') {
            return <Text className={cn(getContrastColor())}>{children}</Text>;
        }

        return children;
    };

    return (
        <Pressable
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={disabled || loading}
            style={combinedStyle}
            {...props}>
            {renderChildren()}
        </Pressable>
    );
}
