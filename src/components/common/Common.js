import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import store from '../../store';
import {API_saveRecord} from '../../helper/api';
import moment from 'moment';

// Function to open phone dialer
export const makePhoneCall = (phoneNumber) => {
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url).catch((err) =>
    console.error('Error opening dialer', err),
  );
};

// Function to open SMS app
export const sendSMS = (phoneNumber, message) => {
  const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  Linking.openURL(url).catch((err) =>
    console.error('Error opening SMS app', err),
  );
};

export const getLocationAndSave = async () => {
  const mobile_os = Platform.OS;
  const mobile_version = DeviceInfo.getVersion();

  Geolocation.getCurrentPosition(
    async (position) => {
      if (position) {
        const {latitude, longitude} = position.coords;
        const timestamp = moment(position.timestamp).format(
          'YYYY-MM-DD hh:mm:ss A',
        );

        const metadata = {
          loc_lat: latitude,
          loc_long: longitude,
          loc_time: timestamp,
          loc_source: 'mobileapp',
          mobile_os,
          mobile_version,
        };

        const data = store.getState();
        const userId = data?.UserReducer?.userData?.id;

        if (userId) {
          const body_data = {
            meta_data: metadata,
          };
          try {
            await API_saveRecord('Users', body_data, userId);
          } catch (apiError) {
            console.error('Failed to save location:', apiError);
          }
        }
      }
    },
    (error) => {
      console.error('Location error:', error.code, error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    },
  );
};
