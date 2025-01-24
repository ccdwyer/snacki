import { useTheme } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Alert, TextInput, ScrollView } from 'react-native';

import { Container } from '../Container';

import { useUserAtom } from '~/atoms/AuthentictionAtoms';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import { useGetMenuById } from '~/queries/MenuQueries';
import {
    useUpsertMenuForCurrentUser,
    useDeleteMenuItemForCurrentUser,
    useDeleteMenuSectionForCurrentUser,
} from '~/queries/UsersTruckQueries';

type MenuFormProps = {
    mode: 'create' | 'update';
    truckId: string;
    menuId?: string;
};

type MenuSection = {
    id?: string;
    name: string;
    description: string;
    items: MenuItem[];
};

type MenuItem = {
    id?: string;
    name: string;
    description: string;
    price: string;
};

export default function MenuFormScreen({ mode, truckId, menuId }: MenuFormProps) {
    const router = useRouter();
    const theme = useTheme();
    const { colors } = theme;
    const [user] = useUserAtom();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [sections, setSections] = useState<MenuSection[]>([]);

    const { mutate: upsertMenu, isError, isPending } = useUpsertMenuForCurrentUser();
    const { data: existingMenu } = useGetMenuById(mode === 'update' ? menuId || '' : '');
    const deleteMenuItem = useDeleteMenuItemForCurrentUser();
    const deleteMenuSection = useDeleteMenuSectionForCurrentUser();

    useEffect(() => {
        if (isError) {
            Alert.alert('Error', 'Failed to save menu');
        }
    }, [isError]);

    useEffect(() => {
        if (mode === 'update' && existingMenu) {
            setName(existingMenu.name);
            setDescription(existingMenu.description || '');
            setSections(
                existingMenu.menu_sections?.map((section) => ({
                    id: section.id,
                    name: section.name,
                    description: section.description || '',
                    items:
                        section.menu_items?.map((item) => ({
                            id: item.id,
                            name: item.name,
                            description: item.description || '',
                            price: (item.price ?? 0).toString(),
                        })) || [],
                })) || []
            );
        }
    }, [mode, existingMenu]);

    const formCompleted =
        name.trim().length > 0 &&
        sections.length > 0 &&
        sections.every(
            (section) =>
                section.name.trim().length > 0 &&
                section.items.length > 0 &&
                section.items.every(
                    (item) => item.name.trim().length > 0 && parseFloat(item.price) > 0
                )
        );

    const handleAddSection = () => {
        setSections([
            ...sections,
            {
                name: '',
                description: '',
                items: [],
            },
        ]);
    };

    const handleUpdateSection = (index: number, field: keyof MenuSection, value: string) => {
        const newSections = [...sections];
        newSections[index] = {
            ...newSections[index],
            [field]: value,
        };
        setSections(newSections);
    };

    const handleRemoveSection = (index: number) => {
        const section = sections[index];
        if (mode === 'update' && section.id) {
            Alert.alert(
                'Delete Section',
                'Are you sure you want to delete this section? This will also delete all items in this section. This action cannot be undone.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            if (section.id && menuId) {
                                deleteMenuSection.mutate(
                                    {
                                        menuSectionId: section.id,
                                        menuId,
                                        truckId,
                                    },
                                    {
                                        onSuccess: () => {
                                            setSections(sections.filter((_, i) => i !== index));
                                        },
                                        onError: (error) => {
                                            Alert.alert('Error', error.message);
                                        },
                                    }
                                );
                            }
                        },
                    },
                ]
            );
        } else {
            setSections(sections.filter((_, i) => i !== index));
        }
    };

    const handleAddItem = (sectionIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].items.push({
            name: '',
            description: '',
            price: '',
        });
        setSections(newSections);
    };

    const handleUpdateItem = (
        sectionIndex: number,
        itemIndex: number,
        field: keyof MenuItem,
        value: string
    ) => {
        const newSections = [...sections];
        if (field === 'price') {
            // Only allow numbers and a single decimal point
            const isValidPrice = /^\d*\.?\d*$/.test(value);
            if (!isValidPrice) return;
        }
        newSections[sectionIndex].items[itemIndex] = {
            ...newSections[sectionIndex].items[itemIndex],
            [field]: value,
        };
        setSections(newSections);
    };

    const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
        const item = sections[sectionIndex].items[itemIndex];
        if (mode === 'update' && item.id) {
            Alert.alert(
                'Delete Item',
                'Are you sure you want to delete this item? This action cannot be undone.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            if (item.id && sections[sectionIndex].id) {
                                deleteMenuItem.mutate(
                                    {
                                        menuItemId: item.id,
                                        menuSectionId: sections[sectionIndex].id!,
                                        truckId,
                                    },
                                    {
                                        onSuccess: () => {
                                            const newSections = [...sections];
                                            newSections[sectionIndex].items = newSections[
                                                sectionIndex
                                            ].items.filter((_, i) => i !== itemIndex);
                                            setSections(newSections);
                                        },
                                        onError: (error) => {
                                            Alert.alert('Error', error.message);
                                        },
                                    }
                                );
                            }
                        },
                    },
                ]
            );
        } else {
            const newSections = [...sections];
            newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
                (_, i) => i !== itemIndex
            );
            setSections(newSections);
        }
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Menu name is required');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to create a menu');
            return;
        }

        const menuData = {
            menu: {
                name: name.trim(),
                description: description.trim(),
                food_truck_id: truckId,
                id: mode === 'update' ? menuId : undefined,
            },
            sections: sections.map((section) => ({
                section: {
                    name: section.name.trim(),
                    description: section.description.trim(),
                    id: mode === 'update' ? section.id : undefined,
                    menu_id: menuId || '',
                },
                items: section.items.map((item) => ({
                    name: item.name.trim(),
                    description: item.description.trim(),
                    price: parseFloat(item.price),
                    id: mode === 'update' ? item.id : undefined,
                    menu_section_id: section.id || '',
                })),
            })),
        };

        upsertMenu(
            { menuData, truckId },
            {
                onSuccess: () => {
                    router.back();
                },
                onError: (error) => {
                    console.error('Failed to save menu:', error);
                    Alert.alert('Error', 'Failed to save menu: ' + error.message);
                },
            }
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: mode === 'create' ? 'Create Menu' : 'Update Menu',
                    headerRight: () => (
                        <Button
                            variant="ghost"
                            onPress={handleSubmit}
                            disabled={!formCompleted || isPending}>
                            <Text className="text-primary">Save</Text>
                        </Button>
                    ),
                }}
            />
            <Container>
                <ScrollView className="flex-1">
                    <View className="gap-4 space-y-4 p-4">
                        <View className="p-4">
                            <View className="mb-4">
                                <Text variant="caption2" className="mb-1">
                                    Menu Name *
                                </Text>
                                <TextInput
                                    className="placeholder:text-foreground/50 w-full rounded-lg border border-gray-300 bg-gray-500/20 px-4 py-2 text-foreground focus:border-primary"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter menu name"
                                />
                            </View>

                            <View className="space-y-6">
                                {sections.map((section, sectionIndex) => (
                                    <View key={sectionIndex} className="mb-6">
                                        <View className="mt-8 flex-row align-bottom">
                                            <View className="mr-2 flex-1">
                                                <Text variant="caption2" className="mb-1">
                                                    Section Name *
                                                </Text>
                                                <TextInput
                                                    className="placeholder:text-foreground/50 w-full rounded-lg border-b border-gray-300 bg-gray-500/20 px-4 py-2 text-foreground focus:border-primary"
                                                    value={section.name}
                                                    onChangeText={(value) =>
                                                        handleUpdateSection(
                                                            sectionIndex,
                                                            'name',
                                                            value
                                                        )
                                                    }
                                                    placeholder="Enter section name"
                                                />
                                            </View>
                                            <Button
                                                className="aspect-square self-end bg-red-500"
                                                variant="primary"
                                                onPress={() => handleRemoveSection(sectionIndex)}>
                                                <Icon name="trash-can" size={20} color="#FFF" />
                                            </Button>
                                        </View>

                                        <View className="">
                                            {section.items.map((item, itemIndex) => (
                                                <View
                                                    key={itemIndex}
                                                    className="mt-4 border-l-4 border-primary py-2 pl-4">
                                                    <View className="flex-row items-center justify-between">
                                                        <View className="mr-2 flex-1">
                                                            <Text
                                                                variant="caption2"
                                                                className="mb-1">
                                                                Item Name *
                                                            </Text>
                                                            <TextInput
                                                                className="placeholder:text-foreground/50 w-full rounded-lg border border-gray-300 bg-gray-500/20 px-4 py-2 text-foreground focus:border-primary"
                                                                value={item.name}
                                                                onChangeText={(value) =>
                                                                    handleUpdateItem(
                                                                        sectionIndex,
                                                                        itemIndex,
                                                                        'name',
                                                                        value
                                                                    )
                                                                }
                                                                placeholder="Enter item name"
                                                            />
                                                        </View>
                                                        <Button
                                                            variant="primary"
                                                            className="aspect-square self-end bg-red-500"
                                                            onPress={() =>
                                                                handleRemoveItem(
                                                                    sectionIndex,
                                                                    itemIndex
                                                                )
                                                            }>
                                                            <Icon
                                                                name="trash-can"
                                                                size={20}
                                                                color="#FFF"
                                                            />
                                                        </Button>
                                                    </View>

                                                    <View className="mt-2">
                                                        <Text variant="caption2" className="mb-1">
                                                            Description
                                                        </Text>
                                                        <TextInput
                                                            className="placeholder:text-foreground/50 w-full rounded-lg border border-gray-300 bg-gray-500/20 px-4 py-2 text-foreground focus:border-primary"
                                                            value={item.description}
                                                            onChangeText={(value) =>
                                                                handleUpdateItem(
                                                                    sectionIndex,
                                                                    itemIndex,
                                                                    'description',
                                                                    value
                                                                )
                                                            }
                                                            placeholder="Enter item description"
                                                        />
                                                    </View>

                                                    <View className="mt-2">
                                                        <Text variant="caption2" className="mb-1">
                                                            Price *
                                                        </Text>
                                                        <TextInput
                                                            className="placeholder:text-foreground/50 w-full rounded-lg border border-gray-300 bg-gray-500/20 px-4 py-2 text-foreground focus:border-primary"
                                                            value={item.price}
                                                            onChangeText={(value) =>
                                                                handleUpdateItem(
                                                                    sectionIndex,
                                                                    itemIndex,
                                                                    'price',
                                                                    value
                                                                )
                                                            }
                                                            placeholder="Enter price"
                                                            keyboardType="decimal-pad"
                                                        />
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                        <Button
                                            className="mt-4"
                                            variant="primary"
                                            onPress={() => handleAddItem(sectionIndex)}>
                                            <View className="flex-row items-center justify-center">
                                                <Icon name="plus" size={20} color="#000" />
                                                <Text className="ml-2">
                                                    Add New Item to {section.name}
                                                </Text>
                                            </View>
                                        </Button>
                                    </View>
                                ))}
                                <Button variant="primary" onPress={handleAddSection}>
                                    <View className="flex-row items-center justify-center">
                                        <Icon name="plus" size={24} color="#000" />
                                        <Text className="ml-2">Add New Section</Text>
                                    </View>
                                </Button>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Container>
        </>
    );
}
