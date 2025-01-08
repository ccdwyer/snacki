import { Stack, router } from 'expo-router';
import React from 'react';
import { FlatList, View, Image, Pressable } from 'react-native';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import { Avatar } from '~/components/nativewindui/Avatar';

export interface Conversation {
    id: string;
    participants: {
        id: string;
        name: string;
        avatar: string;
    }[];
    messages: {
        id: string;
        content: string;
        sender: {
            id: string;
            name: string;
            avatar: string;
        };
    }[];
}

export const mockConversations: Conversation[] = [
    {
        id: '1',
        participants: [
            { id: 'u1', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1' },
            { id: 'u2', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=2' },
        ],
        messages: [
            {
                id: 'm1',
                content: 'Hey, are you open today?',
                sender: { id: 'u1', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1' },
            },
            {
                id: 'm2',
                content: "Yes, we're here until 8pm!",
                sender: { id: 'u2', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=2' },
            },
            {
                id: 'm3',
                content: "Great, I'll stop by for lunch",
                sender: { id: 'u1', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1' },
            },
        ],
    },
    {
        id: '2',
        participants: [
            { id: 'u3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=3' },
            { id: 'u4', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=4' },
        ],
        messages: Array.from({ length: 25 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Do you have any vegetarian options?`,
            sender:
                i % 2 === 0
                    ? { id: 'u3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=3' }
                    : { id: 'u4', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=4' },
        })),
    },
    {
        id: '3',
        participants: [
            { id: 'u5', name: 'David Brown', avatar: 'https://i.pravatar.cc/150?u=5' },
            { id: 'u6', name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=6' },
        ],
        messages: [
            {
                id: 'm1',
                content: "What's your location today?",
                sender: { id: 'u5', name: 'David Brown', avatar: 'https://i.pravatar.cc/150?u=5' },
            },
        ],
    },
    {
        id: '4',
        participants: [
            { id: 'u7', name: 'Chris Miller', avatar: 'https://i.pravatar.cc/150?u=7' },
            { id: 'u8', name: 'Lisa Taylor', avatar: 'https://i.pravatar.cc/150?u=8' },
        ],
        messages: Array.from({ length: 12 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Can I place a large catering order?`,
            sender:
                i % 2 === 0
                    ? { id: 'u7', name: 'Chris Miller', avatar: 'https://i.pravatar.cc/150?u=7' }
                    : { id: 'u8', name: 'Lisa Taylor', avatar: 'https://i.pravatar.cc/150?u=8' },
        })),
    },
    {
        id: '5',
        participants: [
            { id: 'u9', name: 'Alex Turner', avatar: 'https://i.pravatar.cc/150?u=9' },
            { id: 'u10', name: 'Rachel Green', avatar: 'https://i.pravatar.cc/150?u=10' },
        ],
        messages: Array.from({ length: 8 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Do you accept credit cards?`,
            sender:
                i % 2 === 0
                    ? { id: 'u9', name: 'Alex Turner', avatar: 'https://i.pravatar.cc/150?u=9' }
                    : { id: 'u10', name: 'Rachel Green', avatar: 'https://i.pravatar.cc/150?u=10' },
        })),
    },
    {
        id: '6',
        participants: [
            { id: 'u11', name: 'Tom Wilson', avatar: 'https://i.pravatar.cc/150?u=11' },
            { id: 'u12', name: 'Emily Clark', avatar: 'https://i.pravatar.cc/150?u=12' },
        ],
        messages: Array.from({ length: 15 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - What's today's special?`,
            sender:
                i % 2 === 0
                    ? { id: 'u11', name: 'Tom Wilson', avatar: 'https://i.pravatar.cc/150?u=11' }
                    : { id: 'u12', name: 'Emily Clark', avatar: 'https://i.pravatar.cc/150?u=12' },
        })),
    },
    {
        id: '7',
        participants: [
            { id: 'u13', name: 'Daniel Lee', avatar: 'https://i.pravatar.cc/150?u=13' },
            { id: 'u14', name: 'Sophie Wang', avatar: 'https://i.pravatar.cc/150?u=14' },
        ],
        messages: Array.from({ length: 5 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Are you available for private events?`,
            sender:
                i % 2 === 0
                    ? { id: 'u13', name: 'Daniel Lee', avatar: 'https://i.pravatar.cc/150?u=13' }
                    : { id: 'u14', name: 'Sophie Wang', avatar: 'https://i.pravatar.cc/150?u=14' },
        })),
    },
    {
        id: '8',
        participants: [
            { id: 'u15', name: 'Ryan Cooper', avatar: 'https://i.pravatar.cc/150?u=15' },
            { id: 'u16', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=16' },
        ],
        messages: Array.from({ length: 20 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Can you accommodate allergies?`,
            sender:
                i % 2 === 0
                    ? { id: 'u15', name: 'Ryan Cooper', avatar: 'https://i.pravatar.cc/150?u=15' }
                    : { id: 'u16', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=16' },
        })),
    },
    {
        id: '9',
        participants: [
            { id: 'u17', name: 'Kevin Chen', avatar: 'https://i.pravatar.cc/150?u=17' },
            { id: 'u18', name: 'Amanda White', avatar: 'https://i.pravatar.cc/150?u=18' },
        ],
        messages: Array.from({ length: 3 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - What time do you open?`,
            sender:
                i % 2 === 0
                    ? { id: 'u17', name: 'Kevin Chen', avatar: 'https://i.pravatar.cc/150?u=17' }
                    : { id: 'u18', name: 'Amanda White', avatar: 'https://i.pravatar.cc/150?u=18' },
        })),
    },
    {
        id: '10',
        participants: [
            { id: 'u19', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=19' },
            { id: 'u20', name: 'Linda Martinez', avatar: 'https://i.pravatar.cc/150?u=20' },
        ],
        messages: Array.from({ length: 18 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Do you deliver?`,
            sender:
                i % 2 === 0
                    ? { id: 'u19', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=19' }
                    : {
                          id: 'u20',
                          name: 'Linda Martinez',
                          avatar: 'https://i.pravatar.cc/150?u=20',
                      },
        })),
    },
    {
        id: '11',
        participants: [
            { id: 'u21', name: 'Peter Park', avatar: 'https://i.pravatar.cc/150?u=21' },
            { id: 'u22', name: 'Nancy Brown', avatar: 'https://i.pravatar.cc/150?u=22' },
        ],
        messages: Array.from({ length: 7 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Can I make a reservation?`,
            sender:
                i % 2 === 0
                    ? { id: 'u21', name: 'Peter Park', avatar: 'https://i.pravatar.cc/150?u=21' }
                    : { id: 'u22', name: 'Nancy Brown', avatar: 'https://i.pravatar.cc/150?u=22' },
        })),
    },
    {
        id: '12',
        participants: [
            { id: 'u23', name: 'George Smith', avatar: 'https://i.pravatar.cc/150?u=23' },
            { id: 'u24', name: 'Helen Davis', avatar: 'https://i.pravatar.cc/150?u=24' },
        ],
        messages: Array.from({ length: 22 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - What's on the menu today?`,
            sender:
                i % 2 === 0
                    ? { id: 'u23', name: 'George Smith', avatar: 'https://i.pravatar.cc/150?u=23' }
                    : { id: 'u24', name: 'Helen Davis', avatar: 'https://i.pravatar.cc/150?u=24' },
        })),
    },
    {
        id: '13',
        participants: [
            { id: 'u25', name: 'Frank Johnson', avatar: 'https://i.pravatar.cc/150?u=25' },
            { id: 'u26', name: 'Diana Lee', avatar: 'https://i.pravatar.cc/150?u=26' },
        ],
        messages: Array.from({ length: 10 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Are you pet friendly?`,
            sender:
                i % 2 === 0
                    ? { id: 'u25', name: 'Frank Johnson', avatar: 'https://i.pravatar.cc/150?u=25' }
                    : { id: 'u26', name: 'Diana Lee', avatar: 'https://i.pravatar.cc/150?u=26' },
        })),
    },
    {
        id: '14',
        participants: [
            { id: 'u27', name: 'Bob Wilson', avatar: 'https://i.pravatar.cc/150?u=27' },
            { id: 'u28', name: 'Carol Taylor', avatar: 'https://i.pravatar.cc/150?u=28' },
        ],
        messages: Array.from({ length: 16 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - Do you have gluten-free options?`,
            sender:
                i % 2 === 0
                    ? { id: 'u27', name: 'Bob Wilson', avatar: 'https://i.pravatar.cc/150?u=27' }
                    : { id: 'u28', name: 'Carol Taylor', avatar: 'https://i.pravatar.cc/150?u=28' },
        })),
    },
    {
        id: '15',
        participants: [
            { id: 'u29', name: 'Steve Rogers', avatar: 'https://i.pravatar.cc/150?u=29' },
            { id: 'u30', name: 'Natasha Roman', avatar: 'https://i.pravatar.cc/150?u=30' },
        ],
        messages: Array.from({ length: 13 }, (_, i) => ({
            id: `m${i}`,
            content: `Message ${i + 1} - What's your most popular dish?`,
            sender:
                i % 2 === 0
                    ? { id: 'u29', name: 'Steve Rogers', avatar: 'https://i.pravatar.cc/150?u=29' }
                    : {
                          id: 'u30',
                          name: 'Natasha Roman',
                          avatar: 'https://i.pravatar.cc/150?u=30',
                      },
        })),
    },
];

const useGetConversations = (): Conversation[] => {
    return mockConversations;
};

const AvatarWithFallback = ({ participant }: { participant: Conversation['participants'][0] }) => {
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
};

const ConversationList = () => {
    const conversations = useGetConversations();

    const renderItem = ({ item }: { item: Conversation }) => {
        const lastMessage = item.messages[item.messages.length - 1];
        return (
            <Pressable
                onPress={() =>
                    router.push({
                        pathname: '/(drawer)/(user_tabs)/conversations/[id]',
                        params: { id: item.id },
                    })
                }
                className="active:bg-gray-100/50 dark:active:bg-gray-800/50">
                <View className="flex-row items-center border-b border-gray-200/60 px-2 py-3 dark:border-gray-800">
                    <View className="mr-3">
                        <AvatarWithFallback participant={item.participants[0]} />
                    </View>
                    <View className="flex-1">
                        <Text variant="title3" className="font-semibold">
                            {item.participants.map((p) => p.name).join(', ')}
                        </Text>
                        <Text variant="body" className="mt-0.5 text-gray-600" numberOfLines={1}>
                            {lastMessage.content}
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <FlatList
            data={conversations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
        />
    );
};

export default function MessagesScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Messages' }} />
            <Container>
                <ConversationList />
            </Container>
        </>
    );
}
