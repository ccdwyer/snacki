import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "~/clients/supabase";
import { useUserAtom } from "~/atoms/AuthentictionAtoms";

const getUserCompanies = async (userId: string) => {
    // Get companies where user is owner or employee using raw query
    const { data, error } = await supabaseClient
        .from('companies')
        .select(`
            *,
            company_employees (
                is_manager,
                user_id
            )
        `)
        .eq('owner_id', userId);

    const { data: employeeCompanies, error: employeeError } = await supabaseClient
        .from('companies')
        .select(`
            *,
            company_employees (
                is_manager,
                user_id
            )
        `)
        .eq('company_employees.user_id', userId);

    if (error || employeeError) {
        console.error('Error fetching user companies', error || employeeError);
        return [];
    }

    // Combine and deduplicate results
    const allCompanies = [...(data || []), ...(employeeCompanies || [])];
    const uniqueCompanies = Array.from(new Map(allCompanies.map(item => [item.id, item])).values());
    return uniqueCompanies;
}

export const useGetUserCompanies = (userId: string | null) => {
    return useQuery({
        queryKey: ['user-companies', userId],
        queryFn: () => {
            if (!userId) {
                throw new Error('User ID is required');
            }
            return getUserCompanies(userId);
        },
        enabled: !!userId,
    });
}

type CompanyEmployee = {
    id: string;
    company_id: string;
    user_id: string;
    is_manager: boolean;
    created_at: string;
    updated_at: string;
    auth_user: {
        email: string;
        user_metadata: {
            first_name?: string;
            last_name?: string;
            avatar_url?: string;
            [key: string]: any;
        };
    };
};

const getCompanyEmployees = async (companyId: string): Promise<CompanyEmployee[]> => {
    const { data, error } = await supabaseClient
        .rpc('get_company_employees', {
            company_id_input: companyId
        }) as { data: CompanyEmployee[] | null; error: any };
        
    if (error) {
        console.error('Error fetching company employees', error);
        throw error;
    }

    return data || [];
};

export const useGetCompanyEmployees = (companyId: string) => {
    return useQuery({
        queryKey: ['company-employees', companyId],
        queryFn: () => getCompanyEmployees(companyId),
        enabled: !!companyId,
    });
};

interface AddEmployeeParams {
    companyId: string;
    email: string;
    name: string;
    isManager?: boolean;
}

export const useAddCompanyEmployee = () => {
    const queryClient = useQueryClient();
    const [user] = useUserAtom();
    
    return useMutation({
        mutationFn: async ({ companyId, email, name, isManager = false }: AddEmployeeParams) => {
            const { data, error } = await supabaseClient
                .rpc('add_company_employee', {
                    _company_id: companyId,
                    _email: email,
                    _is_manager: isManager,
                    _employee_name: name,
                });

            if (error) throw error;
            return data;
        },
        onSuccess: (_data, variables) => {
            // Invalidate company employees list
            queryClient.invalidateQueries({ queryKey: ['company-employees', variables.companyId] });
            // Invalidate user companies list (in case this is a new company for the invited user)
            queryClient.invalidateQueries({ queryKey: ['user-companies'] });
        },
    });
};

const getCompanyEventsForDateRange = async (companyId: string, startDate: string, endDate: string) => {
    const { data, error } = await supabaseClient
        .from('events')
        .select(`
            *,
            event_food_trucks!inner(
                food_trucks!inner(
                    company_id
                )
            )
        `)
        .eq('event_food_trucks.food_trucks.company_id', companyId)
        .gte('start_time', startDate)
        .lte('end_time', endDate)
        .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
}

export const useGetCompanyEventsForDateRange = (companyId: string, startDate: string, endDate: string) => {
    return useQuery({ 
        queryKey: ['company-events', companyId, startDate, endDate], 
        queryFn: () => getCompanyEventsForDateRange(companyId, startDate, endDate),
        enabled: !!companyId && !!startDate && !!endDate
    });
}

export const useGetCompanyEventsForToday = (companyId: string) => {
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const endOfToday = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    return useGetCompanyEventsForDateRange(companyId, startOfToday, endOfToday);
}