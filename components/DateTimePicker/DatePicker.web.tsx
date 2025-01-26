import React from 'react';
import { View } from 'react-native';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/utils';

interface DatePickerProps {
    value: Date;
    onChange: (event: any, date: Date | null) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    mode?: 'date' | 'datetime' | 'time';
    label?: string;
}

const formatDate = (date: Date) => {
    try {
        return date.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
};

export const DatePicker = ({
    value,
    onChange,
    minimumDate,
    maximumDate,
    mode = 'date',
    label,
}: DatePickerProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateStr = e.target.value;
        if (!dateStr) {
            onChange(e, null);
            return;
        }

        const newDate = new Date(dateStr);
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
                type="date"
                value={formatDate(value)}
                onChange={handleChange}
                min={minimumDate ? formatDate(minimumDate) : undefined}
                max={maximumDate ? formatDate(maximumDate) : undefined}
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

export default DatePicker;
