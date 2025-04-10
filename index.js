import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppRegistry, LogBox, Platform, UIManager} from 'react-native';
import {name as appName} from './app.json';
import Router from './src/router';
import store from './src/store';
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreAllLogs();
console.disableYellowBox = true;

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('remoteMessage', remoteMessage);
  // const {title, body} = remoteMessage.notification;
  onDisplayNotification(
    remoteMessage?.data?.title,
    remoteMessage?.data?.body,
    remoteMessage?.data,
  );
});

// notifee.onBackgroundEvent(async ({type, detail}) => {
//   const {notification, pressAction} = detail;

//   // Check if the user pressed the "Mark as read" action
//   if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
//     // Remove the notification
//     if (notification?.data) {
//       if (notification?.data?.moduleName) {
//         if (notification?.data?.recordId) {
//           navigationRef.navigate('Record Details', {
//             moduleName: notification?.data?.moduleName,
//             moduleLable: notification?.data?.moduleName,
//             recordId: notification?.data?.recordId,
//             navigation: navigationRef,
//           });
//         } else {
//           navigationRef.navigate('Records', {
//             moduleName: notification?.data?.moduleName,
//             moduleLable: notification?.data?.moduleName,
//             navigation: navigationRef,
//           });
//         }
//       } else {
//         reset([{name: 'Drawer'}]);
//       }
//     }
//     await notifee.cancelNotification(notification?.id);
//   }
// });

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => App);
