import React from 'react';
import { useColorScheme } from 'react-native';

import type { Conversation } from '~/app/(drawer)/(user_tabs)/conversations';
import { Box, Text } from '~/components/gluestack-ui';

type MessageListItemProps = {
    message: Conversation['messages'][0];
    isCurrentUser: boolean;
};

export function MessageListItem({ message, isCurrentUser }: MessageListItemProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Box className={`mb-2 flex-row ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <Box
                className={`max-w-[80%] rounded-2xl border px-4 py-2 ${
                    isCurrentUser
                        ? isDark
                            ? 'border-[#00D6C8] bg-transparent'
                            : 'border-transparent bg-[#00D6C8]'
                        : isDark
                          ? 'border-[#9B6B9E] bg-transparent'
                          : 'border-transparent bg-[#9B6B9E]'
                }`}>
                <Text className="text-white">{message.content}</Text>
            </Box>
        </Box>
    );
}
