export interface Truck {
    id: string;
    name: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
        name: string;
        address: string;
    };
    rating: number;
    ratingCount: number;
    cuisineType: string;
    upcomingEvents: {
        id: string;
        name: string;
        startDate: string;
        endDate: string;
        location: {
            latitude: number;
            longitude: number;
            name: string;
            address: string;
        };
    }[];
    isFavorite: boolean;
}
