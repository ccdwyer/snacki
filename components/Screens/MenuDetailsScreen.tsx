import { Icon } from '@roninoss/icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

import { ErrorBoundary } from './ErrorBoundary';

import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { useGetMenuById } from '~/queries/MenuQueries';
import { Database } from '~/types/supabaseTypes';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuSection = Database['public']['Tables']['menu_sections']['Row'] & {
    menu_items: MenuItem[];
};
type Menu = Database['public']['Tables']['menus']['Row'] & {
    menu_sections: MenuSection[];
};

const MenuItemCard = ({ item }: { item: MenuItem }) => {
    const { colors } = useColorScheme();
    return (
        <View className="mb-4 rounded-lg border border-gray-200 bg-card p-4">
            <View className="flex-row items-start justify-between">
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
                    <Text className="text-foreground/80">{item.description}</Text>
                    <Text className="mt-1 font-medium text-foreground">
                        ${(item.price ?? 0).toFixed(2)}
                    </Text>
                </View>
                <View className="ml-4 flex-row items-center gap-2">
                    <Icon name="heart" size={20} color={colors.grey2} />
                    <Icon name="close-circle-outline" size={20} color={colors.grey2} />
                </View>
            </View>
        </View>
    );
};

export const MenuDetailsScreen = () => {
    const { menuId } = useLocalSearchParams();
    const id = Array.isArray(menuId) ? menuId[0] : menuId;
    const { data: menu, isLoading, error, refetch } = useGetMenuById(id);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Set initial active section when menu data loads
    React.useEffect(() => {
        if (menu?.menu_sections?.[0]) {
            setActiveSection(menu.menu_sections[0].id);
        }
    }, [menu]);

    return (
        <ErrorBoundary error={error} loading={isLoading} dismiss={refetch}>
            {!menu && (
                <View className="flex-1 items-center justify-center">
                    <Text>Menu Not Found</Text>
                </View>
            )}
            {menu && (
                <View className="flex-1 bg-background">
                    {/* Header */}
                    <View className="bg-teal-600 px-4 py-6">
                        <Text className="text-center text-2xl font-bold text-white">
                            {menu.name}
                        </Text>
                        {menu.description && (
                            <Text className="mt-1 text-center text-white/90">
                                {menu.description}
                            </Text>
                        )}
                    </View>

                    {/* Section Tabs */}
                    <View className="border-foreground/30 border-b">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 8 }}>
                            {menu.menu_sections?.map((section) => (
                                <View
                                    key={section.id}
                                    className="min-w-[100px] px-2"
                                    accessibilityRole="tab"
                                    accessibilityState={{ selected: activeSection === section.id }}>
                                    <Text
                                        onPress={() => setActiveSection(section.id)}
                                        className={cn(
                                            'py-2 text-center text-sm font-medium',
                                            activeSection === section.id
                                                ? 'border-b-2 border-teal-600 text-primary'
                                                : 'text-foreground'
                                        )}>
                                        {section.name}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Menu Items */}
                    <ScrollView className="flex-1 p-4">
                        {menu.menu_sections
                            ?.find((section) => section.id === activeSection)
                            ?.menu_items?.map((item) => <MenuItemCard key={item.id} item={item} />)}
                    </ScrollView>
                </View>
            )}
        </ErrorBoundary>
    );
};

export default MenuDetailsScreen;
