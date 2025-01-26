import { useQuery } from '@tanstack/react-query';

import { supabaseClient } from '~/clients/supabase';
const getTruckById = async (truckId: string) => {
    console.log('Fetching truck:', truckId);
    const { data, error } = await supabaseClient
        .from('food_trucks')
        .select(
            `*,
                    cuisine_types:food_truck_cuisine_types(cuisine_types(*)),
                    menus (
                        *,
                        menu_sections (
                            *,
                            menu_items (*)
                        )
                    ),
                    events:event_food_trucks(events(*))`
        )
        .eq('id', truckId)
        .order('created_at', { referencedTable: 'menus' })
        .order('created_at', { referencedTable: 'menus.menu_sections' })
        .order('created_at', { referencedTable: 'menus.menu_sections.menu_items' })
        .single();

    console.log('Truck query result:', { data, error });

    if (error) {
        if (error.code === 'PGRST116') {
            // No truck found
            console.log('No truck found');
            return null;
        }
        console.error('Error fetching truck:', error);
        throw error;
    }
    return data;
};

export const useGetTruckById = (truckId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['truck', truckId],
        queryFn: async () => {
            const truck = await getTruckById(truckId);
            if (!truck) {
                throw new Error('Truck not found');
            }
            return truck;
        },
        enabled: options?.enabled ?? !!truckId,
    });
};

const getUsersFavoriteTrucks = async (userId: string) => {
    const { data, error } = await supabaseClient
        .from('food_truck_favorites')
        .select(
            `
            *,
            food_truck:food_trucks(*)
        `
        )
        .eq('user_id', userId);
    if (error) throw error;
    return data;
};

export const useGetUsersFavoriteTrucks = (userId: string) => {
    return useQuery({
        queryKey: ['users-favorite-trucks', userId],
        queryFn: async () => {
            return getUsersFavoriteTrucks(userId);
        },
        enabled: !!userId,
    });
};

const getFoodTrucksWithinDistance = async ({
    lat,
    lng,
    distance,
}: {
    lat: number;
    lng: number;
    distance: number;
}) => {
    const { data, error } = await supabaseClient.rpc('get_food_trucks_within_distance', {
        lat_in: lat,
        lng_in: lng,
        distance_miles: distance,
    });
    if (error) throw error;
    return data;
};

export const useGetFoodTrucksWithinDistance = ({
    lat,
    lng,
    distance,
}: {
    lat: number;
    lng: number;
    distance: number;
}) => {
    return useQuery({
        queryKey: ['food-trucks-within-distance', lat, lng, distance],
        queryFn: async () => {
            return getFoodTrucksWithinDistance({ lat, lng, distance });
        },
    });
};
