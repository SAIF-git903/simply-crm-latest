import {Linking} from 'react-native';

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
