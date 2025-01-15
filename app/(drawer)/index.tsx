import { FontAwesome } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { useState } from 'react';
import { View, Image, ScrollView, TextInput, Linking } from 'react-native';
import Animated from 'react-native-reanimated';

import { supabaseClient } from '~/clients/supabase';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';

const AnimatedView = Animated.createAnimatedComponent(View);

const Hero = () => {
    return (
        <View className="relative flex h-[48vh] items-center justify-center overflow-hidden">
            {/* Background Image */}
            <View className="absolute bottom-0 left-0 right-0 top-0">
                <Image
                    source={require('~/assets/Snacki_Banner.jpg')}
                    alt="Tropical beach with food truck"
                    className="absolute bottom-0 left-0 right-0 top-[-85%]"
                    resizeMode="cover"
                />
            </View>

            {/* Overlay */}
            <View className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <View className="container relative z-10 mx-auto items-center px-4 text-center">
                <Text className="mr-4 font-[Bubble] text-5xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] md:text-8xl">
                    Snacki
                </Text>
                <Text className="mb-12 font-[Bubble] text-2xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] md:text-3xl">
                    Your Food Truck's Best Friend
                </Text>
                <Text className="mb-8 text-2xl font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] md:text-3xl">
                    Manage events, schedules, and loyalty programs - all from one delicious app!
                </Text>
            </View>
        </View>
    );
};

const features = [
    {
        icon: <FontAwesome name="calendar" size={24} className="text-teal-500" />,
        title: 'Event Management',
        description:
            'Display your upcoming events and locations. Make it simple for customers to find you.',
    },
    {
        icon: <FontAwesome name="gift" size={24} className="text-teal-500" />,
        title: 'Loyalty Programs',
        description:
            'Reward your regular customers with a built-in loyalty program. Make more customers repeat customers, and reward them for their loyalty.',
    },
    {
        icon: <FontAwesome name="book" size={24} className="text-teal-500" />,
        title: 'Take Event Requests',
        description: 'Let customers book events with you, right through the app.',
    },
    {
        icon: <FontAwesome name="list" size={24} className="text-teal-500" />,
        title: 'Menu and Order Management',
        description:
            'Let customers view your menu, and if desired order and pay for food right from the app.',
    },
    {
        icon: <FontAwesome name="instagram" size={24} className="text-teal-500" />,
        title: 'Social Media Integration',
        description:
            'Share photos and updates with your customers, and let them know where you will be next.',
    },
    {
        icon: <FontAwesome name="mobile-phone" size={24} className="text-teal-500" />,
        title: 'Communicate with Customers',
        description:
            'Send push notifications to your past customers when you are open near them, or when you have a new special.',
    },
];

const Features = () => {
    return (
        <View className="width-full bg-white py-20">
            <View className="container mx-auto px-4">
                <Text className="mb-12 text-center text-3xl font-bold text-teal-800">
                    Why Choose Snacki?
                </Text>
                <View className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <View
                            key={index}
                            className="rounded-lg border-2 border-teal-200 bg-yellow-50 p-6 shadow-md">
                            <View className="mb-4">{feature.icon}</View>
                            <Text className="mb-2 text-xl font-semibold text-teal-700">
                                {feature.title}
                            </Text>
                            <Text className="text-teal-600">{feature.description}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const AboutMe = () => {
    return (
        <View className="bg-teal-70 w-full py-16 md:py-24">
            <View className="container mx-auto px-6 md:px-8">
                <View className="text-center">
                    <Text className="mb-4 text-4xl font-bold text-teal-900 md:text-5xl">
                        Meet the Founder
                    </Text>
                </View>

                <View className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
                    {/* Profile Image */}
                    <View className="w-full md:w-1/3">
                        <View className="aspect-square overflow-hidden rounded-2xl bg-teal-100 shadow-md">
                            <Image
                                source={require('~/assets/Chris.jpeg')}
                                alt="Chris Dwyer"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </View>
                    </View>

                    {/* Content */}
                    <View className="w-full md:w-2/3">
                        <View className="space-y-6">
                            <Text className="text-3xl font-bold text-teal-900">
                                Hi, I'm Chris 👋
                            </Text>
                            <Text className="text-lg leading-relaxed text-teal-700">
                                With over a decade of experience building mobile apps for both
                                industry giants and innovative startups, I understand what it takes
                                to create software that makes a real difference. I've had the
                                privilege of working with large companies like GM and
                                Dictionary.com, as well as transformative startups like Bicycle
                                Health.
                            </Text>
                            <Text className="text-lg leading-relaxed text-teal-700">
                                Now, I'm passionate about bringing that expertise to the food truck
                                industry with Snacki. I believe food truck owners deserve powerful,
                                easy-to-use tools that help them focus on what they do best -
                                creating amazing food experiences.
                            </Text>

                            {/* Call to Action */}
                            <View className="mt-8 flex items-center gap-4 sm:flex-col md:flex-row lg:flex-row">
                                <Button
                                    className="rounded-full bg-teal-600 px-8 py-4 shadow-lg active:bg-teal-700"
                                    onPress={() =>
                                        Linking.openURL(
                                            'https://calendly.com/admin-snackiapp/30min'
                                        )
                                    }>
                                    <View className="flex flex-row items-center gap-2">
                                        <FontAwesome name="calendar" size={20} color="white" />
                                        <Text className="text-lg font-semibold text-white">
                                            Schedule a Chat
                                        </Text>
                                    </View>
                                </Button>
                                <Button
                                    className="rounded-full border-2 border-teal-600 bg-transparent px-8 py-4 shadow-lg active:bg-teal-50"
                                    onPress={() => {
                                        Linking.openURL(
                                            'https://www.linkedin.com/in/dwyerchristopher/'
                                        );
                                    }}>
                                    <Text className="text-lg font-semibold text-teal-600">
                                        Find me on LinkedIn
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const EmailSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const { data, error } = await supabaseClient
                .from('interested_individuals')
                .insert([{ name, email, phone }]);

            if (error) throw error;

            setMessage("Thanks for subscribing! We'll keep you updated.");
            setName('');
            setEmail('');
            setPhone('');
        } catch (error) {
            console.error('Error inserting data:', error);
            setMessage('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="w-full bg-gradient-to-br from-teal-50 to-yellow-50 py-16 md:py-24">
            <View className="container mx-auto px-4">
                {/* Header Section */}
                <View className="width-full align-center mb-12 text-center">
                    <Text className="mb-3 text-center text-3xl font-bold text-teal-900 md:text-4xl">
                        Join the Snacki Community
                    </Text>
                    <Text className="mx-auto max-w-2xl text-center text-base text-teal-700 md:text-lg">
                        Be the first to know when Snacki launches. Get exclusive updates and early
                        access to features that will transform your food truck business.
                    </Text>
                </View>

                {/* Form Section */}
                <View className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg md:p-8">
                    <View className="space-y-5">
                        {/* Name Input */}
                        <View>
                            <Text className="mb-1.5 text-sm font-medium text-teal-900">Name</Text>
                            <TextInput
                                placeholder="Enter your name"
                                value={name}
                                onChangeText={setName}
                                className="w-full rounded-xl border border-teal-200 bg-transparent px-4 py-3 text-base text-teal-900 placeholder:text-teal-400"
                            />
                        </View>

                        {/* Email Input */}
                        <View>
                            <Text className="mb-1.5 text-sm font-medium text-teal-900">Email</Text>
                            <TextInput
                                placeholder="you@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="w-full rounded-xl border border-teal-200 bg-transparent px-4 py-3 text-base text-teal-900 placeholder:text-teal-400"
                            />
                        </View>

                        {/* Phone Input */}
                        <View>
                            <Text className="mb-1.5 text-sm font-medium text-teal-900">
                                Phone (optional)
                            </Text>
                            <TextInput
                                placeholder="(555) 555-5555"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                className="w-full rounded-xl border border-teal-200 bg-transparent px-4 py-3 text-base text-teal-900 placeholder:text-teal-400"
                            />
                        </View>

                        {/* Submit Button */}
                        <Button
                            onPress={handleSubmit}
                            disabled={isLoading || !email || !name}
                            className="mt-6 w-full rounded-xl bg-teal-600 py-4 shadow-md active:bg-teal-700 disabled:opacity-50">
                            <Text className="text-center text-base font-semibold text-white">
                                {isLoading ? 'Subscribing...' : 'Subscribe to Updates'}
                            </Text>
                        </Button>

                        {/* Message Display */}
                        {message ? (
                            <Text
                                className={cn(
                                    'mt-4 text-center text-sm',
                                    message.includes('wrong') ? 'text-red-600' : 'text-teal-600'
                                )}>
                                {message}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </View>
        </View>
    );
};

const Footer = () => {
    return (
        <View className="bg-teal-800 py-8 text-white">
            <View className="container mx-auto px-4 text-center">
                <Text>
                    &copy; {new Date().getFullYear()} Snacki. All rights reserved. Serving up
                    success for food trucks everywhere!
                </Text>
            </View>
        </View>
    );
};

export default function Home() {
    return (
        <>
            <Stack.Screen options={{ title: 'Snacki App' }} />
            <ScrollView>
                <View className="flex min-h-screen flex-col bg-gradient-to-b from-yellow-100 to-green-100">
                    <View className="flex-grow">
                        <Hero />
                        <Features />
                        <EmailSignup />
                        <AboutMe />
                    </View>
                    <Footer />
                </View>
            </ScrollView>
        </>
    );
}

cssInterop(FlashList, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
});
