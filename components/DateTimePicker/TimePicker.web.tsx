import React from 'react';
import { View } from 'react-native';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/utils';

interface TimePickerProps {
    value: Date;
    onChange: (event: any, date: Date | null) => void;
    label?: string;
}

const formatTime = (date: Date) => {
    try {
        return date.toTimeString().slice(0, 5);
    } catch (e) {
        return '';
    }
};

export const TimePicker = ({ value, onChange, label }: TimePickerProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeStr = e.target.value;
        if (!timeStr) {
            onChange(e, null);
            return;
        }

        const [hours, minutes] = timeStr.split(':').map(Number);
        const newDate = new Date(value);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);

        if (isNaN(newDate.getTime())) {
            onChange(e, null);
            return;
        }

        onChange(e, newDate);
    };

    return (
        <View>
            {label && <Text className="mb-2 text-base font-medium">{label}</Text>}
            <input
                type="time"
                value={formatTime(value)}
                onChange={handleChange}
                className={cn(
                    'h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background',
                    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                    'placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                )}
            />
        </View>
    );
};

export default TimePicker;
