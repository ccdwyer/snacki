import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Database } from '~/types/supabaseTypes';

export const selectedCompanyAtom = atomWithStorage<Database['public']['Tables']['companies']['Row'] | null>(
    'selectedCompany',
    null,
);

export const useSelectedCompany = () => {
    return useAtom(selectedCompanyAtom);
};
