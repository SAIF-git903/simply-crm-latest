import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  Text,
  TextInput,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import notifee, {EventType} from '@notifee/react-native';

import DrawerContent from './components/drawerContent';
// Screens
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Records from './screens/Records';
import RecordDetails from './screens/Record/';
import ForgotPassword from './screens/ForgotPassword';
import Calendar from './screens/Calendar';
import AddRecord from './components/addRecords';
import ReferenceScreen from './components/addRecords/referenceRecordLister';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {navigationRef, reset} from './NavigationService';
import {
  handleForegroundNotifications,
  requestNotificationPermission,
  requestUserPermission,
} from '../NotificationService';
import {refreshRecordData} from './actions';
library.add(far, fas, fab);
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

let defaultTextRender = Text.render;
Text.render = function (...args) {
  let origin = defaultTextRender.call(this, ...args);

  return React.cloneElement(origin, {
    style: [
      {color: 'black', fontFamily: 'Poppins-Regular'},
      origin.props.style,
    ],
  });
};

let defaultTextInputRender = TextInput.render;
TextInput.render = function (...args) {
  let origin = defaultTextInputRender.call(this, ...args);

  return React.cloneElement(origin, {
    style: [{height: 50}, origin.props.style],
  });
};

StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.20)');
StatusBar.setTranslucent(true);
StatusBar.setBarStyle('light-content', true);

export default class Router extends Component {
  async componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen

    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    if (Platform.OS === 'ios') {
      requestUserPermission();
    } else {
      requestNotificationPermission();
    }
    // handleBackgroundNotifications();
    handleForegroundNotifications();

    // messaging().onMessage((onMessageReceived) =>
    //   console.log('onMessageReceived', onMessageReceived),
    // );
    // Listen to foreground notification events
    this.foregroundListener = notifee.onForegroundEvent(
      async ({type, detail}) => {
        console.log('detail', detail);
        switch (type) {
          case EventType.DISMISSED:
            await notifee.cancelNotification(detail.notification.id);
            break;
          case EventType.PRESS:
            if (detail?.notification?.data) {
              if (detail?.notification?.data?.moduleName) {
                if (detail?.notification?.data?.recordId) {
                  navigationRef.navigate('Record Details', {
                    moduleName: detail?.notification?.data?.moduleName,
                    moduleLable: detail?.notification?.data?.moduleName,
                    recordId: detail?.notification?.data?.recordId,
                    navigation: navigationRef,
                    listerInstance: {
                      ...this,
                      moduleName: detail?.notification?.data?.moduleName,
                      refreshData: refreshRecordData(this),
                    },
                    isDashboard: true,
                  });
                } else {
                  navigationRef.navigate('Records', {
                    moduleName: detail?.notification?.data?.moduleName,
                    moduleLable: detail?.notification?.data?.moduleName,
                    navigation: navigationRef,
                  });
                }
              } else {
                reset([{name: 'Drawer'}]);
              }
            }

            await notifee.cancelNotification(detail?.notification?.id);

            break;
        }
      },
    );

    // Notification Click Handling

    // messaging().onNotificationOpenedApp((remoteMessage) => {
    //   console.log('Notification caused app to open:', remoteMessage);
    // });
  }

  componentWillUnmount() {
    // Remove the event listener to avoid memory leaks
    if (this.foregroundListener) {
      this.foregroundListener();
    }
  }

  createLoginStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Drawer" component={this.createDrawer} />
      <Stack.Screen name="Record Details" component={RecordDetails} />
      <Stack.Screen name="Add Record" component={AddRecord} />
      <Stack.Screen name="Edit Record" component={AddRecord} />
      <Stack.Screen name="Reference Screen" component={ReferenceScreen} />
      <Stack.Screen name="Forgot Password" component={ForgotPassword} />
    </Stack.Navigator>
  );

  createDrawer = () => (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerType={'front'}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Records" component={Records} />
      <Drawer.Screen name="Calendar" component={Calendar} />
    </Drawer.Navigator>
  );

  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          {this.createLoginStack()}
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
