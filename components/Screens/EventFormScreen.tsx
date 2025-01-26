import React, { useState, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { TextInput } from '~/components/ui/TextInput';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import { DatePicker } from '~/components/nativewindui/DatePicker';
import { WebTimePicker } from '~/components/DateTimePicker';
import MultiSelect from '~/components/MultiSelect';
import { ErrorBoundary } from './ErrorBoundary';
import { LocationPicker } from '~/components/LocationPicker';
import {
    useGetSelectedCompanyFoodTrucks,
    useUpsertEventWithCompanyTrucks,
} from '~/queries/CompanyQueries';
import { Database } from '~/types/supabaseTypes';
import { useUserAtom } from '~/atoms/AuthentictionAtoms';
import { LocationPickerLocationSelectedEvent } from '~/components/LocationPicker/LocationPickerEmitter';
import { useTheme } from '@react-navigation/native';

interface EventFormScreenProps {
    onSuccess?: () => void;
}

export const EventFormScreen = ({ onSuccess }: EventFormScreenProps) => {
    const router = useRouter();
    const [user] = useUserAtom();
    const isWeb = Platform.OS === 'web';
    const theme = useTheme();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [locationDesc, setLocationDesc] = useState('');
    const [address, setAddress] = useState('');
    const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [selectedTruckIds, setSelectedTruckIds] = useState<string[]>([]);

    // Add time validation state
    const [showTimeError, setShowTimeError] = useState(false);

    // Add date validation state
    const [showDateError, setShowDateError] = useState(false);
    const [dateErrorMessage, setDateErrorMessage] = useState('');

    // Validate times whenever they change
    React.useEffect(() => {
        const startTimeMs = startTime.getTime();
        const endTimeMs = endTime.getTime();
        const hasError = endTimeMs <= startTimeMs;
        console.log('Time validation:', {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            startTimeMs,
            endTimeMs,
            hasError,
        });
        setShowTimeError(hasError);
    }, [startTime, endTime]);

    // Validate dates whenever they change
    React.useEffect(() => {
        const now = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            setShowDateError(true);
            setDateErrorMessage('Invalid date or time selected');
        } else if (startTime < now) {
            setShowDateError(true);
            setDateErrorMessage('Event cannot be scheduled in the past');
        } else if (startTime > oneYearFromNow) {
            setShowDateError(true);
            setDateErrorMessage('Event cannot be scheduled more than one year in advance');
        } else {
            setShowDateError(false);
            setDateErrorMessage('');
        }
    }, [startTime, endTime]);

    // Refs for keyboard navigation
    const descriptionRef = useRef<any>(null);

    // Queries and mutations
    const {
        data: foodTrucks,
        isLoading: foodTrucksLoading,
        error: foodTrucksError,
        refetch: foodTrucksRefetch,
    } = useGetSelectedCompanyFoodTrucks();

    const { mutate: upsertEventWithCompanyTrucks, isPending: saving } =
        useUpsertEventWithCompanyTrucks();

    // Form validation
    const isValid =
        title.trim() &&
        selectedTruckIds.length > 0 &&
        startTime &&
        endTime &&
        !showTimeError &&
        !showDateError;

    const handleLocationSelected = (event: LocationPickerLocationSelectedEvent) => {
        if (!event.geolocation?.results?.[0]) return;
        const result = event.geolocation.results[0];
        setAddress(event?.details?.description ?? result.formatted_address);
        setGpsCoordinates({
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
        });
    };

    const handleSubmit = () => {
        console.log('Submit pressed, validation:', {
            hasUserId: !!user?.id,
            isValid,
            validationDetails: {
                hasTitle: !!title.trim(),
                hasTrucks: selectedTruckIds.length > 0,
                hasStartTime: !!startTime,
                hasEndTime: !!endTime,
                timeError: showTimeError,
                dateError: showDateError,
            },
        });

        if (!user?.id || !isValid) return;

        const event: Database['public']['Tables']['events']['Insert'] = {
            title: title.trim(),
            description: description.trim(),
            location_desc: locationDesc.trim(),
            address: address.trim(),
            location: gpsCoordinates
                ? { type: 'Point', coordinates: [gpsCoordinates.lng, gpsCoordinates.lat] }
                : null,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            user_id: user.id,
        };

        const selectedTrucks =
            foodTrucks?.filter((truck) => selectedTruckIds.includes(truck.id)) ?? [];

        console.log('Submitting event:', event);
        console.log('Selected trucks:', selectedTrucks);

        upsertEventWithCompanyTrucks(
            { event, foodTrucks: selectedTrucks },
            {
                onSuccess: () => {
                    console.log('Event created successfully');
                    onSuccess?.();
                },
                onError: (error) => {
                    console.error('Failed to create event:', error);
                },
            }
        );
    };

    const [selectedDate, setSelectedDate] = useState(startTime.toISOString().split('T')[0]);

    return (
        <ErrorBoundary
            error={foodTrucksError}
            loading={foodTrucksLoading}
            dismiss={foodTrucksRefetch}>
            <SafeAreaView className="flex-1 bg-background">
                <ScrollView className="flex-1 bg-background p-4" contentContainerClassName="pb-16">
                    <View className="gap-6">
                        <TextInput
                            label="Event Title"
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter event title"
                            returnKeyType="next"
                            onSubmitEditing={() => descriptionRef.current?.focus()}
                        />

                        <TextInput
                            ref={descriptionRef}
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Enter event description"
                            multiline
                            numberOfLines={3}
                        />

                        <View className="gap-2">
                            <Text className="text-base font-medium">Location</Text>
                            <LocationPicker
                                value={{
                                    address,
                                    gpsCoordinates,
                                }}
                                onLocationSelected={handleLocationSelected}
                            />
                        </View>

                        <TextInput
                            label="Location Description"
                            value={locationDesc}
                            onChangeText={setLocationDesc}
                            placeholder="Additional location details (optional)"
                        />

                        <View className="gap-2">
                            <Text className="text-base font-medium">Food Trucks</Text>
                            <MultiSelect
                                data={foodTrucks ?? []}
                                labelField="name"
                                valueField="id"
                                placeholder="Select food trucks"
                                value={selectedTruckIds}
                                onChange={(items: string[]) => setSelectedTruckIds(items)}
                                style={{
                                    backgroundColor: 'transparent',
                                }}
                            />
                            {selectedTruckIds.length === 0 && (
                                <Text className="text-sm text-destructive">
                                    At least one food truck is required
                                </Text>
                            )}
                        </View>

                        <View className="gap-2">
                            <Text className="text-base font-medium">Event Date</Text>
                            <View className="web:max-w-[30%]">
                                <Calendar
                                    current={selectedDate}
                                    minDate={
                                        new Date(new Date().setHours(0, 0, 0, 0))
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                    maxDate={
                                        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                    onDayPress={(day: DateData) => {
                                        setSelectedDate(day.dateString);
                                        // Get current hours and minutes
                                        const startHours = startTime.getHours();
                                        const startMinutes = startTime.getMinutes();
                                        const endHours = endTime.getHours();
                                        const endMinutes = endTime.getMinutes();

                                        // Create new dates with the selected date but preserve times
                                        const [year, month, date] = day.dateString
                                            .split('-')
                                            .map(Number);
                                        const newStartTime = new Date(year, month - 1, date);
                                        newStartTime.setHours(startHours, startMinutes);
                                        setStartTime(newStartTime);

                                        const newEndTime = new Date(year, month - 1, date);
                                        newEndTime.setHours(endHours, endMinutes);
                                        setEndTime(newEndTime);
                                    }}
                                    markedDates={{
                                        [selectedDate]: {
                                            selected: true,
                                            selectedColor: theme.colors.primary,
                                        },
                                    }}
                                    theme={{
                                        backgroundColor: theme.colors.background,
                                        calendarBackground: theme.colors.background,
                                        textSectionTitleColor: theme.colors.text,
                                        selectedDayBackgroundColor: theme.colors.primary,
                                        selectedDayTextColor: theme.colors.text,
                                        todayTextColor: theme.colors.primary,
                                        dayTextColor: theme.colors.text,
                                        textDisabledColor: theme.colors.border,
                                    }}
                                />
                            </View>
                        </View>

                        {isWeb ? (
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <WebTimePicker
                                        label="Start Time"
                                        value={startTime}
                                        onChange={(_, date) => {
                                            if (!date) return;
                                            const newStartTime = new Date(startTime);
                                            newStartTime.setHours(date.getHours());
                                            newStartTime.setMinutes(date.getMinutes());
                                            setStartTime(newStartTime);
                                        }}
                                    />
                                </View>
                                <View className="flex-1">
                                    <WebTimePicker
                                        label="End Time"
                                        value={endTime}
                                        onChange={(_, date) => {
                                            if (!date) return;
                                            const newEndTime = new Date(endTime);
                                            newEndTime.setHours(date.getHours());
                                            newEndTime.setMinutes(date.getMinutes());
                                            setEndTime(newEndTime);
                                        }}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-base font-medium">Start Time</Text>
                                    <DatePicker
                                        value={startTime}
                                        onChange={(event, date) => {
                                            if (!date) return;
                                            const newStartTime = new Date(startTime);
                                            newStartTime.setHours(date.getHours());
                                            newStartTime.setMinutes(date.getMinutes());
                                            setStartTime(newStartTime);
                                        }}
                                        mode="time"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-medium">End Time</Text>
                                    <DatePicker
                                        value={endTime}
                                        onChange={(event, date) => {
                                            if (!date) return;
                                            const newEndTime = new Date(endTime);
                                            newEndTime.setHours(date.getHours());
                                            newEndTime.setMinutes(date.getMinutes());
                                            setEndTime(newEndTime);
                                        }}
                                        mode="time"
                                    />
                                </View>
                            </View>
                        )}
                        {showTimeError && (
                            <View className="mt-2">
                                <Text className="text-sm font-medium text-destructive">
                                    End time must be after start time
                                </Text>
                            </View>
                        )}
                        {showDateError && (
                            <View className="mt-2">
                                <Text className="text-sm font-medium text-destructive">
                                    {dateErrorMessage}
                                </Text>
                            </View>
                        )}

                        <Button
                            variant="primary"
                            onPress={handleSubmit}
                            disabled={!isValid || saving}
                            className="mt-4">
                            <Text className="text-primary-foreground">
                                {saving ? 'Creating Event...' : 'Create Event'}
                            </Text>
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ErrorBoundary>
    );
};
