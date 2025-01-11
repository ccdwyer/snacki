import { User as SupabaseUser } from '@supabase/supabase-js';
import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { supabaseClient, ensureProfile } from '../clients/supabase';

export type User = {
    id: string;
    email?: string;
    user_metadata: {
        first_name?: string;
        last_name?: string;
    };
    app_metadata: {
        provider?: string;
    };
    aud: string;
    created_at: string;
} & Omit<SupabaseUser, 'user_metadata' | 'app_metadata'>;

export type UserAtomState = User | null;

export const UserAtom = atom<UserAtomState>(null);

export const useUserAtom = () => {
    const [user, setUser] = useAtom(UserAtom);

    useEffect(() => {
        // Initialize from stored session when atom is first used
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user as User);
                ensureProfile(session.user).catch(console.error);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user as User);
                await ensureProfile(session.user).catch(console.error);
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setUser]);

    return [user, setUser] as const;
};

export const useSignIn = (user: User) => {
    const [, set] = useUserAtom();
    return useCallback(() => {
        set(user);
    }, [user, set]);
};

export const useSignOut = () => {
    const [, set] = useUserAtom();
    return useCallback(async () => {
        await supabaseClient.auth.signOut();
        set(null);
    }, [set]);
};

export const useForgotPassword = () => {
    return useCallback(async (email: string) => {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: process.env.EXPO_PUBLIC_PASSWORD_RESET_URL,
        });
        if (error) throw error;
    }, []);
};

export const useUpdatePassword = () => {
    return useCallback(async (newPassword: string) => {
        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
    }, []);
};
