import * as Location from 'expo-location';

type AddressComponent = {
  name?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  district?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  latitude?: number;
  longitude?: number;
};

export const formatAddress = (address: AddressComponent): string => {
  const components = [
    address.name,
    address.street,
    address.streetNumber,
    address.district,
    address.city,
    address.region,
    address.postalCode,
    address.country
  ].filter((item): item is string => !!item);

  return components.length > 0 
    ? components.join(', ')
    : address.latitude && address.longitude
      ? `${address.latitude.toFixed(4)}, ${address.longitude.toFixed(4)}`
      : 'Location recorded (address unavailable)';
};

export const getDetailedLocation = async (): Promise<{
  coords: Location.LocationObjectCoords;
  address: string;
}> => {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });
  
  const addressResult = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  return {
    coords: location.coords,
    address: addressResult.length > 0 
      ? formatAddress(addressResult[0] as AddressComponent)
      : formatAddress({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        })
  };
};

