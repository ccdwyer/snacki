export type GeolocationResponse = {
    results: {
        address_components: {
            long_name: string;
            short_name: string;
            types: string[];
        }[];
        formatted_address: string;
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
            viewport: {
                northeast: {
                    lat: number;
                    lng: number;
                };
                southwest: {
                    lat: number;
                    lng: number;
                };
            };
        };
        place_id: string;
        types: string[];
    }[];
    status: string;
};