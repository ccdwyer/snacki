import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as aesjs from 'aes-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { AppState, Platform } from 'react-native';

import { Database } from '~/types/supabaseTypes';

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore {
    private async _encrypt(key: string, value: string) {
        if (Platform.OS === 'web') {
            return value; // On web, we don't encrypt the data
        }

        const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));
        const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
        const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

        await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));
        return aesjs.utils.hex.fromBytes(encryptedBytes);
    }

    private async _decrypt(key: string, value: string) {
        if (Platform.OS === 'web') {
            return value; // On web, data is not encrypted
        }

        const encryptionKeyHex = await SecureStore.getItemAsync(key);
        if (!encryptionKeyHex) {
            return encryptionKeyHex;
        }

        const cipher = new aesjs.ModeOfOperation.ctr(
            aesjs.utils.hex.toBytes(encryptionKeyHex),
            new aesjs.Counter(1)
        );
        const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
        return aesjs.utils.utf8.fromBytes(decryptedBytes);
    }

    async getItem(key: string) {
        if (Platform.OS === 'web') {
            if (typeof localStorage === 'undefined') {
                return null;
            }
            const value = localStorage.getItem(key);
            return value;
        }

        const encrypted = await AsyncStorage.getItem(key);
        if (!encrypted) {
            return encrypted;
        }

        return await this._decrypt(key, encrypted);
    }

    async removeItem(key: string) {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
            return;
        }

        await AsyncStorage.removeItem(key);
        await SecureStore.deleteItemAsync(key);
    }

    async setItem(key: string, value: string) {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
            return;
        }

        const encrypted = await this._encrypt(key, value);
        await AsyncStorage.setItem(key, encrypted);
    }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or anon key is not set');
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: new LargeSecureStore(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabaseClient.auth.startAutoRefresh();
    } else {
        supabaseClient.auth.stopAutoRefresh();
    }
});
