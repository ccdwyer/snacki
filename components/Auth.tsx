import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Button } from 'react-native';

import { supabaseClient } from '~/clients/supabase';

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabaseClient.auth.setSession({
        access_token,
        refresh_token,
    });
    if (error) throw error;
    return data.session;
};

const performOAuth = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo,
            skipBrowserRedirect: true,
        },
    });
    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(data?.url ?? '', redirectTo);

    if (res.type === 'success') {
        const { url } = res;
        await createSessionFromUrl(url);
    }
};

const sendMagicLink = async () => {
    const { error } = await supabaseClient.auth.signInWithOtp({
        email: 'example@email.com',
        options: {
            emailRedirectTo: redirectTo,
        },
    });

    if (error) throw error;
    // Email sent.
};

export default function Auth() {
    // Handle linking into app from email app.
    const url = Linking.useURL();
    if (url) createSessionFromUrl(url);

    return (
        <>
            <Button onPress={performOAuth} title="Sign in with Github" />
            <Button onPress={sendMagicLink} title="Send Magic Link" />
        </>
    );
}