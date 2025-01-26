interface Location {
    lat: number;
    lng: number;
}

/**
 * Calculate the great-circle distance between two points on the Earth's surface.
 *
 * @param locationOne - The first location object containing lat and lng.
 * @param locationTwo - The second location object containing lat and lng.
 * @returns The distance in miles between the two points.
 */
export function calculateDistanceInMiles(locationOne: Location, locationTwo: Location): number {
    const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

    const R = 3958.8; // Earth's radius in miles
    const dLat = toRadians(locationTwo.lat - locationOne.lat);
    const dLon = toRadians(locationTwo.lng - locationOne.lng);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(locationOne.lat)) *
            Math.cos(toRadians(locationTwo.lat)) *
            Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in miles
}
