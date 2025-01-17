import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UserAtomState, useUserAtom } from '~/atoms/AuthentictionAtoms';
import { supabaseClient } from '~/clients/supabase';
import { Database } from '~/types/supabaseTypes';

const getTrucksForCurrentUser = async (userId: string | undefined) => {
    if (!userId) throw new Error('User ID is required');
    const { data, error } = await supabaseClient
        .from('food_trucks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const useGetTrucksForCurrentUser = () => {
    const [user] = useUserAtom();

    return useQuery({
        queryKey: ['trucks', user?.id],
        queryFn: () => getTrucksForCurrentUser(user?.id),
    });
};

const upsertTruck = async (
    truck: Database['public']['Tables']['food_trucks']['Insert'],
    user: UserAtomState
) => {
    if (!user?.id) throw new Error('User ID is required');
    const { data, error } = await supabaseClient.from('food_trucks').upsert(truck).select();
    if (error) throw error;
    return data.filter((truck) => truck.user_id === user.id);
};

export const useUpsertTruckForCurrentUser = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: Database['public']['Tables']['food_trucks']['Row'][]) => void;
    onError?: (error: Error) => void;
}) => {
    const [user] = useUserAtom();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (truck: Database['public']['Tables']['food_trucks']['Insert']) =>
            upsertTruck(truck, user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['trucks', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['truck', data[0].id] });
            onSuccess?.(data);
        },
        onError: (error: Error) => {
            onError?.(error);
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
