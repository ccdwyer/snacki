import { useQuery } from '@tanstack/react-query';

import { supabaseClient } from '~/clients/supabase';
import { Database } from '~/types/supabaseTypes';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuSection = Database['public']['Tables']['menu_sections']['Row'] & {
    menu_items: MenuItem[];
};
type Menu = Database['public']['Tables']['menus']['Row'] & {
    menu_sections: MenuSection[];
};

export const useGetMenuById = (menuId: string) => {
    return useQuery({
        queryKey: ['menu', menuId],
        queryFn: async () => {
            const { data: menu, error } = await supabaseClient
                .from('menus')
                .select(
                    `*,
                    menu_sections (
                        *,
                        menu_items (*)
                    )`
                )
                .eq('id', menuId)
                .order('created_at', { referencedTable: 'menu_sections' })
                .order('created_at', { referencedTable: 'menu_sections.menu_items' })
                .single();

            if (error) throw error;
            return menu as Menu;
        },
        enabled: !!menuId,
    });
};
