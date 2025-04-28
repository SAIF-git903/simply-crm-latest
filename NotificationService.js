import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted:', authStatus);
    getFCMToken();
  }
}

async function getFCMToken() {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
}

// Display Notification
export async function onDisplayNotification(title, body, data) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId,
    },
    ios: {
      sound: 'default',
    },
  });
}

// Foreground Notification
export function handleForegroundNotifications() {
  messaging().onMessage(async (remoteMessage) => {
    const {title, body} = remoteMessage.notification;
    onDisplayNotification(title, body, remoteMessage.data);
  });
}

// Background Notification
// export function handleBackgroundNotifications() {
//   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log('remoteMessage', remoteMessage);
//     // const {title, body} = remoteMessage.notification;
//     onDisplayNotification(
//       'remoteMessage?.data?.title',
//       'remoteMessage?.data?.body',
//       remoteMessage?.data,
//     );
//   });
// }

export const requestNotificationPermission = async () => {
  // Android 13+
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } catch (err) {
    console.log(err);
  }
};
