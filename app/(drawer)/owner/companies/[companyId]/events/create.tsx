import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { EventFormScreen } from '~/components/Screens/EventFormScreen';
import { ScreenIdProvider } from '~/components/ScreenIdProvider';
import { LocationPickerModal } from '~/components/LocationPicker';

export default function CreateEventScreen() {
    const router = useRouter();

    return (
        <ScreenIdProvider>
            <Stack.Screen
                options={{
                    title: 'Create Event',
                    headerBackTitle: 'Events',
                }}
            />
            <EventFormScreen onSuccess={() => router.back()} />
            <LocationPickerModal />
        </ScreenIdProvider>
    );
}
