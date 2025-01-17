import { useQuery } from '@tanstack/react-query';

import { supabaseClient } from '~/clients/supabase';
const getTruckById = async (truckId: string) => {
    const { data, error } = await supabaseClient
        .from('food_trucks')
        .select(
            `
                *,
                cuisine_types:food_truck_cuisine_types(cuisine_types(*)),
                menus(*),
                events:event_food_trucks(events(*))
            `
        )
        .eq('id', truckId)
        .single();
    if (error) throw error;
    return data;
};

export const useGetTruckById = (truckId: string) => {
    return useQuery({
        queryKey: ['truck', truckId],
        queryFn: () => getTruckById(truckId),
    });
};
