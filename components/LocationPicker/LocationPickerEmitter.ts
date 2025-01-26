import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';

import { GeolocationResponse } from '~/types/GeolocationResponse';

export const LocationPickerEmitter = new EventEmitter();

export type LocationPickerLocationSelectedEvent = {
    pickerId: string;
    data: GooglePlaceData;
    details: GooglePlaceDetail & { description: string };
    geolocation: GeolocationResponse;
};
