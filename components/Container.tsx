import { StyleSheet, SafeAreaView } from 'react-native';

import { LocationPickerModal } from './LocationPicker';
import { ScreenIdProvider } from './ScreenIdProvider';

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
