import React, { createContext, useContext, useRef } from 'react';

import { generateRandomBase64 } from '~/lib/generateRandomBase64';

const ScreenIdContext = createContext<string | null>(null);

export const ScreenIdProvider = ({ children }: { children: React.ReactNode }) => {
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
