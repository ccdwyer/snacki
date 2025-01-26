import React from 'react';
import { View, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useGetCompanyEmployees } from '~/queries/CompanyQueries';
import { Text } from '~/components/nativewindui/Text';
import { ErrorBoundary } from '~/components/Screens/ErrorBoundary';
import { Container } from '~/components/Container';
import { Button } from '~/components/Button';
import { Icon } from '@roninoss/icons';
import { useTheme } from '@react-navigation/native';

const EmptyState = () => {
    const router = useRouter();
    const { companyId } = useLocalSearchParams();
    return (
        <View className="flex-1 items-center justify-center gap-4 px-8">
            <Icon name="users" size={64} color="#9CA3AF" />
            <Text variant="title2" className="text-center">
                No Employees Yet
            </Text>
            <Text variant="body" color="secondary" className="text-center">
                Invite employees to help manage your food trucks
            </Text>
            <Button
                variant="primary"
                className="mt-4"
                onPress={() => router.push(`/owner/companies/${companyId}/invite-employee`)}>
                <Text>Invite Employee</Text>
            </Button>
        </View>
    );
};

const EmployeeCard = ({ employee }: { employee: any }) => {
    return (
        <View className="overflow-hidden rounded-lg bg-card p-4">
            <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Text className="text-lg font-medium text-primary">
                        {employee.auth_user.user_metadata.first_name?.[0]?.toUpperCase() ?? 'U'}
                    </Text>
                </View>
                <View className="flex-1">
                    <Text variant="heading" className="mb-1">
                        {employee.auth_user.user_metadata.first_name} {employee.auth_user.user_metadata.last_name}
                    </Text>
                    <Text variant="caption1" className="text-foreground/60">
                        {employee.auth_user.email}
                    </Text>
                </View>
                {employee.is_manager && (
                    <View className="rounded-full bg-primary/10 px-3 py-1">
                        <Text className="text-sm font-medium text-primary">Manager</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const CompanyEmployeesScreen = () => {
    const router = useRouter();
    const theme = useTheme();
    const { companyId } = useLocalSearchParams();
    const id = typeof companyId === 'string' ? companyId : companyId[0];
    const { data: employees, isLoading: loading, error, refetch } = useGetCompanyEmployees(id);

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Employees',
                    headerRight: () => (
                        <Button
                            variant="ghost"
                            className="mr-2"
                            onPress={() => router.push(`/owner/companies/${id}/invite-employee`)}>
                            <Icon name="plus" size={24} color={theme.colors.primary} />
                        </Button>
                    ),
                }}
            />
            <Container>
                <ErrorBoundary loading={loading} error={error} dismiss={refetch}>
                    <ScrollView className="flex-1 p-4">
                        {!employees || employees.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <View className="gap-4">
                                {employees.map((employee) => (
                                    <EmployeeCard key={employee.id} employee={employee} />
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </ErrorBoundary>
            </Container>
        </>
    );
};

export default CompanyEmployeesScreen;