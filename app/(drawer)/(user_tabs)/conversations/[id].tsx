import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import { mockConversations } from './index';
import { FontAwesome } from '@expo/vector-icons';
import { MessageListItem } from '~/components/Entities/MessageListItem';

export default function ConversationScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [message, setMessage] = useState('');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const conversation = mockConversations.find((c) => c.id === id);

    if (!conversation) {
        return (
            <>
                <Stack.Screen options={{ title: 'Conversation' }} />
                <Container>
                    <Text>Conversation not found</Text>
                </Container>
            </>
        );
    }

    const renderMessage = ({ item: message }: { item: (typeof conversation.messages)[0] }) => {
        const isCurrentUser = message.sender.id === conversation.participants[0].id;
        return <MessageListItem message={message} isCurrentUser={isCurrentUser} />;
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: conversation.participants.map((p) => p.name).join(', '),
                    headerBackTitle: 'Messages',
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        inverted
                        data={[...conversation.messages].reverse()}
                        renderItem={renderMessage}
                        keyExtractor={(message) => message.id}
                        contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 16 }}
                    />
                    <View className="border-t border-gray-200 px-4 py-2 dark:border-gray-800">
                        <View className="relative flex-row items-end">
                            <TextInput
                                style={{
                                    flex: 1,
                                    maxHeight: 100,
                                    minHeight: 40,
                                    backgroundColor: isDark
                                        ? '#1c1c1e'
                                        : Platform.OS === 'ios'
                                          ? '#e5e7eb'
                                          : '#f3f4f6',
                                    borderRadius: 20,
                                    paddingHorizontal: 16,
                                    paddingRight: 44,
                                    paddingTop: Platform.OS === 'ios' ? 8 : 4,
                                    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
                                    fontSize: 16,
                                    lineHeight: 20,
                                    color: isDark ? '#ffffff' : '#000000',
                                }}
                                placeholder="Message"
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                returnKeyType="send"
                                enablesReturnKeyAutomatically
                                keyboardAppearance={isDark ? 'dark' : 'light'}
                                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                            />
                            <View className="absolute bottom-1 right-1">
                                <TouchableOpacity
                                    onPress={() => {
                                        // Send message functionality would go here
                                        setMessage('');
                                    }}
                                    disabled={!message.trim()}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: message.trim() ? '#00D6C8' : '#d1d5db',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <FontAwesome name="arrow-up" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}
