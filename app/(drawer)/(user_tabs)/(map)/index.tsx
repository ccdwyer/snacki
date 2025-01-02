import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import MapView, { Marker } from 'react-native-maps';

const region = {
  latitude: 27.273270,
  longitude: -80.342148,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
}

const markers = [
  {
    id: 1,
    latitude: 27.273270,
    longitude: -80.342148,
    title: 'Truck 1',
    description: 'Truck 1 description',
  },
  {
    id: 2,
    latitude: 27.273270,
    longitude: -80.442148,
    title: 'Truck 2',
    description: 'Truck 2 description',
  },
  {
    id: 3,
    latitude: 27.173270,
    longitude: -80.242148,
    title: 'Truck 3',
    description: 'Truck 3 description',
  },
]

export default function MapScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <Container>
        <MapView region={region} style={{ flex: 1 }}>
          {markers.map((marker) => (
            <Marker key={marker.id} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} title={marker.title} description={marker.description  } />
          ))}
        </MapView>
      </Container>
    </>
  );
}