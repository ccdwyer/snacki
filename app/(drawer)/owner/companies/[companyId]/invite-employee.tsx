import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, ScrollView, SafeAreaView, TextInput as RNTextInput } from 'react-native';

import { Button } from '~/components/Button';
import { ErrorBoundary } from '~/components/Screens/ErrorBoundary';
import { Text } from '~/components/nativewindui/Text';
import { Switch } from '~/components/nativewindui/Switch';
import { useAddCompanyEmployee } from '~/queries/CompanyQueries';
import { TextInput } from '~/components/ui/TextInput';
import { Alert } from '~/components/ui/Alert';

export const InviteEmployeeScreen = () => {
    const router = useRouter();
    const { companyId } = useLocalSearchParams();
    const addEmployee = useAddCompanyEmployee();
    
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isManager, setIsManager] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        message?: string;
        isError?: boolean;
    }>({ title: '' });

    // Refs for keyboard navigation
    const nameRef = useRef<RNTextInput>(null);

    const showMessage = (title: string, message?: string, isError = false) => {
        setAlertConfig({ title, message, isError });
        setShowAlert(true);
    };

    const handleSubmit = async () => {
        if (!email) return;
        
        setLoading(true);
        try {
            await addEmployee.mutateAsync({
                companyId: Array.isArray(companyId) ? companyId[0] : companyId,
                email,
                name: '',
                isManager,
            });
            
            showMessage('Success', 'Employee invited successfully');
            router.back();
        } catch (error: any) {
            console.error('Error inviting employee:', error);
            const message = error?.message || 'Failed to invite employee';
            showMessage('Error', message, true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ 
                headerTitle: 'Invite Employee',
                headerBackTitle: 'Employees',
                headerTintColor: '#10b981'
            }} />
            <ErrorBoundary>
                <SafeAreaView className="flex-1 bg-background">
                <ScrollView 
                    className="flex-1 bg-background" 
                    contentContainerClassName="p-4 space-y-6">
                    <TextInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter employee email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        returnKeyType="next"
                        onSubmitEditing={() => nameRef.current?.focus()}
                    />

                    <TextInput
                        ref={nameRef}
                        label="Employee Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter employee name"
                        autoCapitalize="words"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                    />

                    <View className="bg-card p-4 rounded-lg">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 mr-4">
                                <Text className="text-base">Manager Access</Text>
                                <Text className="text-sm text-muted-foreground">Can manage company settings and other employees</Text>
                            </View>
                            <Switch value={isManager} onValueChange={setIsManager} />
                        </View>
                    </View>

                    <Button
                        variant="primary"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={!email || loading}
                        className="rounded-2xl">
                        {loading ? 'Inviting...' : 'Invite Employee'}
                    </Button>
                </ScrollView>
                </SafeAreaView>
            </ErrorBoundary>

            <Alert
                visible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={[
                    {
                        text: 'OK',
                        style: alertConfig.isError ? 'destructive' : 'default',
                        onPress: () => setShowAlert(false)
                    }
                ]}
                onDismiss={() => setShowAlert(false)}
            />
        </>
    );
};

export default InviteEmployeeScreen;
