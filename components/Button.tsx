import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    View,
    type PressableStateCallbackType,
    type ViewStyle,
} from 'react-native';

import { Text } from './nativewindui/Text';
import { cn } from '~/lib/cn';

const buttonVariants = cva(
    'flex flex-row items-center justify-center rounded-lg px-4 py-3 transition-all duration-200 ease-in-out active:opacity-90 disabled:opacity-50 border border-transparent',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-white hover:border-primary',
                secondary: 'bg-card text-foreground hover:border-primary',
                destructive: 'bg-card text-destructive hover:border-primary',
                ghost: 'bg-transparent hover:border-primary',
            },
            size: {
                default: 'text-base',
                sm: 'text-sm',
                lg: 'text-lg',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    }
);

const buttonTextVariants = cva('text-[15px] font-medium text-center', {
    variants: {
        variant: {
            primary: 'text-primary-foreground',
            secondary: 'text-foreground',
            destructive: 'text-destructive-foreground',
            ghost: 'text-foreground',
        },
        size: {
            default: 'text-[15px]',
            sm: 'text-[13px]',
            lg: 'text-[16px]',
            icon: 'text-[15px]',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'default',
    },
});

export interface ButtonProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Pressable>, 'style' | 'children'>,
        VariantProps<typeof buttonVariants> {
    loading?: boolean;
    loadingText?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    style?: ViewStyle;
    children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode);
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            disabled,
            loading,
            loadingText,
            children,
            startIcon,
            endIcon,
            style,
            ...props
        },
        ref
    ) => {
        const isWeb = Platform.OS === 'web';
        const isDisabled = disabled || loading;

        const renderContent = (state: PressableStateCallbackType) => (
            <View
                className={cn(
                    'flex-row items-center justify-center gap-2',
                    state.pressed && 'opacity-70'
                )}>
                {loading && (
                    <ActivityIndicator
                        size="small"
                        color={
                            variant === 'primary' || variant === 'destructive'
                                ? '#fff'
                                : undefined
                        }
                    />
                )}
                {!loading && startIcon}
                {typeof children === 'string' ? (
                    <Text className={buttonTextVariants({ variant, size })} numberOfLines={1}>
                        {loading ? loadingText || 'Loading...' : children}
                    </Text>
                ) : typeof children === 'function' ? (
                    children(state)
                ) : (
                    children
                )}
                {!loading && endIcon}
            </View>
        );

        return (
            <Pressable
                ref={ref}
                disabled={isDisabled}
                className={cn(
                    buttonVariants({ variant, size, className }),
                    isWeb && 'cursor-pointer transition-colors',
                    isWeb && !isDisabled && variant === 'primary' && 'hover:bg-primary/90 bg-primary',
                    isWeb && !isDisabled && variant === 'secondary' && '',
                    isWeb && !isDisabled && variant === 'destructive' && 'hover:bg-destructive/90',
                )}
                style={[
                    style,
                    Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.15,
                            shadowRadius: 2,
                        },
                        android: {
                            elevation: 2,
                        },
                    }),
                ]}
                {...props}>
                {renderContent}
            </Pressable>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
