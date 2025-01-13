import {
    QueryClient,
    QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
    );
};