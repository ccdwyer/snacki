import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '~/clients/supabase';

const getEventById = async (eventId: string) => {
    const { data, error } = await supabaseClient
        .from('events')
        .select(
            `
            *,
            event_food_trucks (
                food_trucks (
                    id,
                    name,
                    description,
                    address,
                    location,
                    range_of_service,
                    company_id,
                    facebook_url,
                    instagram_url,
                    tiktok_url,
                    website_url
                )
            )
        `
        )
        .eq('id', eventId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No event found
            return null;
        }
        throw error;
    }

    return data;
};

export const useGetEventById = (eventId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const event = await getEventById(eventId);
            if (!event) {
                throw new Error('Event not found');
            }
            return event;
        },
        enabled: options?.enabled ?? !!eventId,
    });
};
