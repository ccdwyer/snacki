import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UserAtomState, useUserAtom } from '~/atoms/AuthentictionAtoms';
import { useSelectedCompany } from '~/atoms/CompanyAtoms';
import { supabaseClient } from '~/clients/supabase';
import { Database } from '~/types/supabaseTypes';

type Truck = Database['public']['Tables']['food_trucks']['Row'];
type TruckInsert = Database['public']['Tables']['food_trucks']['Insert'];
type CuisineTypeRelation = Database['public']['Tables']['food_truck_cuisine_types']['Insert'];
type MenuInsert = Database['public']['Tables']['menus']['Insert'];
type MenuSectionInsert = Database['public']['Tables']['menu_sections']['Insert'];
type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];

interface UpsertTruckOptions {
    onSuccess?: () => void;
}

export const useGetTrucksForCurrentCompany = () => {
    const [selectedCompany] = useSelectedCompany();
    return useQuery({
        queryKey: ['trucks', selectedCompany?.id],
        queryFn: async () => {
            if (!selectedCompany?.id) throw new Error('Company ID is required');

            const { data: trucks, error } = await supabaseClient
                .from('food_trucks')
                .select(`
                    *,
                    cuisine_types:food_truck_cuisine_types(cuisine_types(*))
                `)
                .eq('company_id', selectedCompany?.id);

            if (error) {
                throw error;
            }

            return trucks as Truck[];
        },
        enabled: !!selectedCompany?.id,
    });
};

export const useUpsertTruckForCurrentCompany = (options?: UpsertTruckOptions) => {
    const [selectedCompany] = useSelectedCompany();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cuisineTypeIds,
            ...truckData
        }: TruckInsert & { cuisineTypeIds?: string[] }) => {
            if (!selectedCompany?.id) throw new Error('Company ID is required');
            // First, upsert the truck
            const { data: truck, error: truckError } = await supabaseClient
                .from('food_trucks')
                .upsert({ ...truckData, company_id: selectedCompany?.id })
                .select()
                .single();

            if (truckError) throw truckError;

            // If we have cuisine types to update
            if (cuisineTypeIds && cuisineTypeIds.length > 0) {
                // First delete existing relations
                const { error: deleteError } = await supabaseClient
                    .from('food_truck_cuisine_types')
                    .delete()
                    .eq('food_truck_id', truck.id);

                if (deleteError) throw deleteError;

                // Then insert new relations
                const cuisineTypeRelations: CuisineTypeRelation[] = cuisineTypeIds.map(
                    (cuisineTypeId) => ({
                        food_truck_id: truck.id,
                        cuisine_type_id: cuisineTypeId,
                    })
                );

                const { error: insertError } = await supabaseClient
                    .from('food_truck_cuisine_types')
                    .insert(cuisineTypeRelations);

                if (insertError) throw insertError;
            }

            return truck;
        },
        onSuccess: (data) => {
            // Invalidate and refetch trucks query
            queryClient.invalidateQueries({ queryKey: ['trucks'] });
            queryClient.invalidateQueries({ queryKey: ['trucks', selectedCompany?.id] });
            queryClient.invalidateQueries({ queryKey: ['truck', data.id] });
            options?.onSuccess?.();
        },
    });
};

const deleteTruck = async (truckId: string, user: UserAtomState) => {
    if (!user?.id) throw new Error('User ID is required');
    const { error } = await supabaseClient
        .from('food_trucks')
        .delete()
        .eq('id', truckId)
        .eq('user_id', user.id);
    if (error) throw error;
    return { success: true };
};

export const useDeleteTruckForCurrentUser = ({
    onSuccess,
    onError,
}: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}) => {
    const [user] = useUserAtom();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (truckId: string) => deleteTruck(truckId, user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trucks', user?.id] });
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
};

const deleteMenu = async (menuId: string, truckId: string) => {
    console.log('Deleting menu from database:', { menuId, truckId });
    const { data, error } = await supabaseClient
        .from('menus')
        .delete()
        .eq('id', menuId)
        .eq('food_truck_id', truckId)
        .select()
        .single();
    
    if (error) {
        console.error('Error deleting menu:', error);
        throw error;
    }
    
    console.log('Menu deleted successfully:', data);
    return data;
};

export const useDeleteMenuForCurrentUser = () => {
    const [user] = useUserAtom();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ menuId, truckId }: { menuId: string; truckId: string }) => {
            return deleteMenu(menuId, truckId);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['truck', variables.truckId] });
            queryClient.invalidateQueries({ queryKey: ['trucks'] });
            queryClient.invalidateQueries({ queryKey: ['menu', variables.menuId] });
        },
    });
};

const deleteMenuSection = async (
    menuSectionId: string,
    menuId: string,
    user: UserAtomState
) => {
    if (!user?.id) throw new Error('User ID is required');
    const { error } = await supabaseClient
        .from('menu_sections')
        .delete()
        .eq('id', menuSectionId)
        .eq('menu_id', menuId);
    if (error) throw error;
    return { success: true };
};

export const useDeleteMenuSectionForCurrentUser = () => {
    const [user] = useUserAtom();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            menuSectionId,
            menuId,
            truckId,
        }: {
            menuSectionId: string;
            menuId: string;
            truckId: string;
        }) => {
            return deleteMenuSection(menuSectionId, menuId, user);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['truck', variables.truckId] });
        },
    });
};

const deleteMenuItem = async (
    menuItemId: string,
    menuSectionId: string,
    user: UserAtomState
) => {
    if (!user?.id) throw new Error('User ID is required');
    const { error } = await supabaseClient
        .from('menu_items')
        .delete()
        .eq('id', menuItemId)
        .eq('menu_section_id', menuSectionId);
    if (error) throw error;
    return { success: true };
};

export const useDeleteMenuItemForCurrentUser = () => {
    const [user] = useUserAtom();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            menuItemId,
            menuSectionId,
        }: {
            menuItemId: string;
            menuSectionId: string;
            truckId: string;
        }) => {
            return deleteMenuItem(menuItemId, menuSectionId, user);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['truck', variables.truckId] });
        },
    });
};

interface MenuData {
    menu: MenuInsert;
    sections: {
        section: MenuSectionInsert;
        items: MenuItemInsert[];
    }[];
}

export const useUpsertMenuForCurrentUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ menuData, truckId }: { menuData: MenuData; truckId: string }) => {
            // First, upsert the menu
            const { data: menu, error: menuError } = await supabaseClient
                .from('menus')
                .upsert({ ...menuData.menu, food_truck_id: truckId })
                .select()
                .single();

            if (menuError) throw menuError;

            // Then, for each section
            for (const { section, items } of menuData.sections) {
                // Upsert the section with the menu ID
                const { data: menuSection, error: sectionError } = await supabaseClient
                    .from('menu_sections')
                    .upsert({
                        ...section,
                        menu_id: menu.id,
                    })
                    .select()
                    .single();

                if (sectionError) throw sectionError;

                // Finally, handle items for this section
                if (items.length > 0) {
                    // Split items into new and existing
                    const newItems = items
                        .filter((item) => !item.id)
                        .map((item) => ({
                            name: item.name,
                            description: item.description,
                            price: item.price ?? 0,
                            menu_section_id: menuSection.id,
                        }));

                    const existingItems = items
                        .filter((item) => item.id)
                        .map((item) => ({
                            id: item.id,
                            name: item.name,
                            description: item.description,
                            price: item.price ?? 0,
                            menu_section_id: menuSection.id,
                        }));

                    // Insert new items
                    if (newItems.length > 0) {
                        const { error: newItemsError } = await supabaseClient
                            .from('menu_items')
                            .insert(newItems);

                        if (newItemsError) throw newItemsError;
                    }

                    // Update existing items
                    if (existingItems.length > 0) {
                        const { error: existingItemsError } = await supabaseClient
                            .from('menu_items')
                            .upsert(existingItems);

                        if (existingItemsError) throw existingItemsError;
                    }
                }
            }

            return menu;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['truck', variables.truckId] });
            queryClient.invalidateQueries({ queryKey: ['menu', variables.menuData.menu.id] });
        },
    });
};
