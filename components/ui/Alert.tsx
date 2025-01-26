import React from 'react';
import { Modal, Platform, View, TouchableOpacity } from 'react-native';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/utils';

export type AlertButton = {
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
};

export interface AlertProps {
    visible: boolean;
    title: string;
    message?: string;
    buttons?: AlertButton[];
    onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
    visible,
    title,
    message,
    buttons = [],
    onDismiss,
}) => {
    if (Platform.OS === 'web') {
        // On web, use the native alert/confirm dialogs
        React.useEffect(() => {
            if (visible) {
                if (buttons.length === 0) {
                    alert(message ? `${title}\n\n${message}` : title);
                    onDismiss?.();
                } else {
                    const confirmed = confirm(message ? `${title}\n\n${message}` : title);
                    const confirmButton = buttons.find(b => b.style !== 'cancel');
                    const cancelButton = buttons.find(b => b.style === 'cancel');
                    
                    if (confirmed && confirmButton) {
                        confirmButton.onPress?.();
                    } else if (!confirmed && cancelButton) {
                        cancelButton.onPress?.();
                    }
                    onDismiss?.();
                }
            }
        }, [visible]);

        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-[300px] bg-card rounded-xl overflow-hidden">
                    <View className="p-4">
                        <Text className="text-lg font-semibold text-center mb-2">
                            {title}
                        </Text>
                        {message && (
                            <Text className="text-base text-muted-foreground text-center">
                                {message}
                            </Text>
                        )}
                    </View>

                    <View className="border-t border-border">
                        {buttons.length === 0 ? (
                            <TouchableOpacity
                                onPress={onDismiss}
                                className="p-4"
                            >
                                <Text className="text-base text-primary text-center font-medium">
                                    OK
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            buttons.map((button, index) => (
                                <React.Fragment key={button.text}>
                                    {index > 0 && (
                                        <View className="h-[1px] bg-border" />
                                    )}
                                    <TouchableOpacity
                                        onPress={() => {
                                            button.onPress?.();
                                            onDismiss?.();
                                        }}
                                        className="p-4"
                                    >
                                        <Text
                                            className={cn(
                                                "text-base text-center font-medium",
                                                button.style === 'destructive' && "text-destructive",
                                                button.style === 'cancel' && "text-muted-foreground",
                                                (!button.style || button.style === 'default') && "text-primary"
                                            )}
                                        >
                                            {button.text}
                                        </Text>
                                    </TouchableOpacity>
                                </React.Fragment>
                            ))
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}; 