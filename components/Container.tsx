import { createContext, useContext, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import { LocationPickerModal } from './LocationPicker';

import { generateRandomBase64 } from '~/lib/generateRandomBase64';

const ScreenIdContext = createContext<string | null>(null);

const ScreenIdProvider = ({ children }: { children: React.ReactNode }) => {
    const { current: screenId } = useRef<string | null>(generateRandomBase64(25));
    return <ScreenIdContext.Provider value={screenId}>{children}</ScreenIdContext.Provider>;
};

export const useScreenId = () => {
    const context = useContext(ScreenIdContext);
    if (!context) {
        throw new Error('useScreenId must be used within a ScreenIdProvider');
    }
    return context;
};

export const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <ScreenIdProvider>
            <SafeAreaView style={styles.container}>
                {children}
                <LocationPickerModal />
            </SafeAreaView>
        </ScreenIdProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});
