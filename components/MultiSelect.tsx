import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import {
    IMultiSelectRef,
    MultiSelect as MultiSelectComponent,
} from 'react-native-element-dropdown';
import { MultiSelectProps } from 'react-native-element-dropdown/lib/typescript/components/MultiSelect/model';

import { Text } from './nativewindui/Text';

import { cn } from '~/lib/cn';

const MultiSelect = React.forwardRef<IMultiSelectRef, MultiSelectProps<any>>(
    (props, currentRef) => {
        const theme = useTheme();
        return (
            <MultiSelectComponent
                {...props}
                ref={currentRef}
                style={[
                    {
                        backgroundColor: theme.colors.background,
                        paddingVertical: 16,
                        borderWidth: 1,
                        borderColor: 'gray',
                        paddingHorizontal: 16,
                        borderRadius: 8,
                    },
                    props.style,
                ]}
                itemContainerStyle={[
                    {
                        backgroundColor: theme.colors.red,
                    },
                    props.itemContainerStyle,
                ]}
                selectedStyle={[
                    {
                        backgroundColor: theme.colors.primary,
                        borderWidth: 0,
                        borderRadius: 16,
                    },
                    props.selectedStyle,
                ]}
                selectedTextStyle={[
                    {
                        color: '#000',
                    },
                    props.selectedTextStyle,
                ]}
                placeholderStyle={[
                    {
                        color: theme.colors.text,
                    },
                    props.placeholderStyle,
                ]}
                inputSearchStyle={[
                    {
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                    },
                    props.inputSearchStyle,
                ]}
                containerStyle={[
                    {
                        backgroundColor: theme.colors.background,
                    },
                    props.containerStyle,
                ]}
                renderItem={
                    props.renderItem ??
                    ((item, selected) => {
                        return (
                            <View
                                className={cn(
                                    'flex-column flex justify-between border-2 border-solid border-transparent bg-background px-2',
                                    selected && ' border-teal-500 bg-card'
                                )}>
                                <Text>{item.name}</Text>
                                {item.description && (
                                    <Text variant="caption1">Ex: {item.description}</Text>
                                )}
                            </View>
                        );
                    })
                }
                flatListProps={
                    props.flatListProps ?? {
                        contentContainerStyle: {
                            backgroundColor: theme.colors.background,
                            gap: 8,
                        },
                    }
                }
            />
        );
    }
);

export default MultiSelect;
