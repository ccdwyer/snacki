import { Stack } from 'expo-router';
import { FlatList, ScrollView, View } from 'react-native';

import { Container } from '~/components/Container';
import { FoodTruckListItem } from '~/components/Entities/FoodTruckListItem';
import { Text } from '~/components/nativewindui/Text';
import { ScreenContent } from '~/components/ScreenContent';
import { Truck } from '~/types/Truck';

const PlaceholderTrucks: Truck[] = [
  {
    id: '1',
    name: 'Taco Truck Deluxe',
    description: 'Authentic Mexican street tacos and burritos',
    isFavorite: true,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      name: 'Mission District',
      address: '123 Valencia St, San Francisco, CA 94103'
    },
    rating: 4.5,
    ratingCount: 128,
    cuisineType: 'Mexican',
    upcomingEvents: [
      {
        id: 'e1',
        name: 'Taco Tuesday Special',
        startDate: '2024-01-23T17:00:00Z',
        endDate: '2024-01-23T22:00:00Z',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          name: 'Mission District',
          address: '123 Valencia St, San Francisco, CA 94103'
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Seoul Food Express',
    description: 'Korean fusion cuisine on wheels',
    isFavorite: true,
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      name: 'SoMa',
      address: '456 Howard St, San Francisco, CA 94105'
    },
    rating: 4.8,
    ratingCount: 256,
    cuisineType: 'Korean',
    upcomingEvents: [
      {
        id: 'e2',
        name: 'Kimchi Festival',
        startDate: '2024-01-25T16:00:00Z',
        endDate: '2024-01-25T21:00:00Z',
        location: {
          latitude: 37.7833,
          longitude: -122.4167,
          name: 'SoMa',
          address: '456 Howard St, San Francisco, CA 94105'
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Pizza Wheels',
    description: 'Wood-fired pizzas made fresh',
    isFavorite: true,
    location: {
      latitude: 37.7937,
      longitude: -122.3965,
      name: 'North Beach',
      address: '789 Columbus Ave, San Francisco, CA 94133'
    },
    rating: 4.3,
    ratingCount: 89,
    cuisineType: 'Italian',
    upcomingEvents: []
  }
];

const NearYouTrucks: Truck[] = [
  {
    id: '4',
    name: 'Taco Time',
    description: 'Authentic Mexican street tacos',
    isFavorite: false,
    location: {
      latitude: 37.7594,
      longitude: -122.4367,
      name: 'Mission District',
      address: '123 Valencia St, San Francisco, CA 94110'
    },
    rating: 4.9,
    ratingCount: 342,
    cuisineType: 'Mexican',
    upcomingEvents: [
      {
        id: 'e3',
        name: 'Taco Tuesday Special',
        startDate: '2024-01-23T17:00:00Z',
        endDate: '2024-01-23T22:00:00Z',
        location: {
          latitude: 37.7594,
          longitude: -122.4367,
          name: 'Mission District',
          address: '123 Valencia St, San Francisco, CA 94110'
        }
      }
    ]
  },
  {
    id: '5',
    name: 'Sushi Roll',
    description: 'Fresh sushi and Japanese fusion',
    isFavorite: true,
    location: {
      latitude: 37.7849,
      longitude: -122.4294,
      name: 'Financial District',
      address: '345 Montgomery St, San Francisco, CA 94104'
    },
    rating: 4.6,
    ratingCount: 178,
    cuisineType: 'Japanese',
    upcomingEvents: []
  },
  {
    id: '6',
    name: 'Mediterranean Delights',
    description: 'Authentic Mediterranean cuisine',
    isFavorite: false,
    location: {
      latitude: 37.8014,
      longitude: -122.4016,
      name: 'Russian Hill',
      address: '567 Green St, San Francisco, CA 94133'
    },
    rating: 4.7,
    ratingCount: 225,
    cuisineType: 'Mediterranean',
    upcomingEvents: [
      {
        id: 'e4',
        name: 'Falafel Festival',
        startDate: '2024-01-27T15:00:00Z',
        endDate: '2024-01-27T20:00:00Z',
        location: {
          latitude: 37.8014,
          longitude: -122.4016,
          name: 'Russian Hill',
          address: '567 Green St, San Francisco, CA 94133'
        }
      }
    ]
  }
];

const RecommendedTrucks: Truck[] = [
  {
    id: '7',
    name: 'Taco Fiesta',
    description: 'Authentic Mexican street tacos',
    isFavorite: false,
    location: {
      latitude: 37.7602,
      longitude: -122.4177,
      name: 'Mission District',
      address: '789 Valencia St, San Francisco, CA 94110'
    },
    rating: 4.8,
    ratingCount: 342,
    cuisineType: 'Mexican',
    upcomingEvents: [
      {
        id: 'e5',
        name: 'Taco Tuesday Special',
        startDate: '2024-01-23T17:00:00Z',
        endDate: '2024-01-23T22:00:00Z',
        location: {
          latitude: 37.7602,
          longitude: -122.4177,
          name: 'Mission District',
          address: '789 Valencia St, San Francisco, CA 94110'
        }
      }
    ]
  },
  {
    id: '8',
    name: 'Pho on Wheels',
    description: 'Vietnamese comfort food',
    location: {
      latitude: 37.7875,
      longitude: -122.4324,
      name: 'Tenderloin',
      address: '456 Ellis St, San Francisco, CA 94102'
    },
    rating: 4.5,
    ratingCount: 156,
    cuisineType: 'Vietnamese',
    upcomingEvents: [],
    isFavorite: false
  },
  {
    id: '9',
    name: 'Sweet Treats',
    description: 'Gourmet desserts and pastries',
    isFavorite: false,
    location: {
      latitude: 37.7915,
      longitude: -122.4037,
      name: 'North Beach',
      address: '123 Columbus Ave, San Francisco, CA 94133'
    },
    rating: 4.9,
    ratingCount: 289,
    cuisineType: 'Desserts',
    upcomingEvents: [
      {
        id: 'e6',
        name: 'Ice Cream Social',
        startDate: '2024-01-25T14:00:00Z',
        endDate: '2024-01-25T18:00:00Z',
        location: {
          latitude: 37.7915,
          longitude: -122.4037,
          name: 'North Beach',
          address: '123 Columbus Ave, San Francisco, CA 94133'
        }
      }
    ]
  }

];

export default function TruckListScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Truck List' }} />
      <Container>
        <ScrollView contentContainerClassName='py-4 gap-4'>
          <View>
            <Text variant="title1" className="px-4 mb-2">Favorites</Text>
            <FlatList horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-4" data={PlaceholderTrucks} renderItem={({ item }) => <FoodTruckListItem truck={item} key={item.id} />} />
          </View>
          <View>
            <Text variant="title1" className="px-4 mb-2">Near you</Text>
            <FlatList horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-4" data={NearYouTrucks} renderItem={({ item }) => <FoodTruckListItem truck={item} key={item.id} />} />
          </View>
          <View>
            <Text variant="title1" className="px-4 mb-2">Suggestions for you</Text>
            <FlatList horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-4" data={RecommendedTrucks} renderItem={({ item }) => <FoodTruckListItem truck={item} key={item.id} />} />
          </View>
        </ScrollView>

      </Container>
    </>
  );
}