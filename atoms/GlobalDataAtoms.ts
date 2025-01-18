import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { supabaseClient } from '~/clients/supabase';
import { Database } from '~/types/supabaseTypes';

export const cuisineTypesAtom = atom<Database['public']['Tables']['cuisine_types']['Row'][]>([]);

export const useCuisineTypes = () => {
    const [cuisineTypes] = useAtom(cuisineTypesAtom);
    return cuisineTypes;
};

const useFetchCuisineTypes = () => {
    const [, setCuisineTypes] = useAtom(cuisineTypesAtom);
    const fetchCuisineTypes = useCallback(async () => {
        const { data: cuisineTypes, error } = await supabaseClient
            .from('cuisine_types')
            .select('*');
        if (error) {
            console.error('Error fetching cuisine types:', error);
        }
        if (cuisineTypes) {
            setCuisineTypes(cuisineTypes);
        }
    }, []);
    useEffect(() => {
        fetchCuisineTypes();
    }, [fetchCuisineTypes]);
};

export const useFetchGlobalData = () => {
    useFetchCuisineTypes();
};
