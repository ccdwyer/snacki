import { router } from 'expo-router';
import React from 'react';
import { View, Pressable, Image } from 'react-native';

import type { Conversation } from '~/app/(drawer)/(user_tabs)/conversations';
import { Text } from '~/components/nativewindui/Text';

type ConversationListItemProps = {
    conversation: Conversation;
};

function AvatarWithFallback({ participant }: { participant: Conversation['participants'][0] }) {
    const [imageError, setImageError] = React.useState(false);

    return (
        <View className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100">
            <Text className="absolute inset-0 flex items-center justify-center text-center text-lg font-medium text-gray-500">
                {participant.name.charAt(0)}
            </Text>
            {!imageError && (
                <Image
                    source={{ uri: participant.avatar }}
                    className="absolute inset-0 h-full w-full"
                    onError={() => setImageError(true)}
                />
            )}
        </View>
    );
}

export function ConversationListItem({ conversation }: ConversationListItemProps) {
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: '/(drawer)/(user_tabs)/conversations/[id]',
                    params: { id: conversation.id },
                })
            }
            className="active:bg-gray-100/50 dark:active:bg-gray-800/50">
            <View className="flex-row items-center border-b border-gray-200/60 px-2 py-3 dark:border-gray-800">
                <View className="mr-3">
                    <AvatarWithFallback participant={conversation.participants[0]} />
                </View>
                <View className="flex-1">
                    <Text variant="title3" className="font-semibold">
                        {conversation.participants.map((p) => p.name).join(', ')}
                    </Text>
                    <Text variant="body" className="mt-0.5 text-gray-600" numberOfLines={1}>
                        {lastMessage.content}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
