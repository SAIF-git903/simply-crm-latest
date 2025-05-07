import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestLocationPermission = async () => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      console.log('Location permission granted');
      return true;
    } else {
      console.warn('Location permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};
