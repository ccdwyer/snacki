import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

export type User = {
    name: string;
    refreshToken: string;
    accessToken: string;
};

export type UserAtomState = User | null;

export const UserAtom = atom<UserAtomState>(null);

export const useUserAtom = () => {
    return useAtom(UserAtom);
};

export const useSignIn = (user: User) => {
    const [, set] = useUserAtom();
    return useCallback(() => {
        set(user);
    }, [user, set]);
};

export const useSignOut = () => {
    const [, set] = useUserAtom();
    return useCallback(() => {
        set(null);
    }, [set]);
};
