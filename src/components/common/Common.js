import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import store from '../../store';
import {API_saveRecord} from '../../helper/api';
import moment from 'moment';
import 'moment-timezone';

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

export function getCommaSeparatedNames(items) {
  const names = items?.map((item) => item.name);
  return names.join(',');
}

// Common function to filter sectioned data based on search text
export const filterSectionedData = (data, searchText) => {
  if (!searchText.trim()) return data; // Return original data if search is empty

  return data
    .map((section) => {
      const filteredData = section.data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
      return filteredData.length > 0 ? {...section, data: filteredData} : null;
    })
    .filter(Boolean); // Remove null sections
};

export const findValueByKey = (obj, key) => {
  for (const category in obj) {
    if (obj[category][key]) {
      return obj[category][key];
    }
  }
  return null;
};

export function convertToUserTimezone(start_time, end_time, userTimezone) {
  // Parse the event times in the system timezone
  const startTime = moment.tz(`${start_time}`, 'HH:mm', 'UTC');
  const endTime = moment.tz(`${end_time}`, 'HH:mm', 'UTC');

  // Convert to user’s timezone
  const startTimeInUserTz = startTime.clone().tz(userTimezone);
  const endTimeInUserTz = endTime.clone().tz(userTimezone);

  // Format for display (e.g., "14:00" for UTC+1)
  return {
    time_start: startTimeInUserTz.format('hh:mm A'),
    time_end: endTimeInUserTz.format('hh:mm A'),
  };
}
