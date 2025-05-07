import React, {useEffect, useMemo, useRef} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  AppState,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import UpdateWidget from '../components/dashboardUpdates';
import Header from '../components/common/Header';
import {getEnabledModules} from '../ducks/comments';
import {useDispatch, useSelector} from 'react-redux';
import {generalBgColor} from '../variables/themeColors';
import messaging from '@react-native-firebase/messaging';
import {navigationRef, reset} from '../NavigationService';
import notifee from '@notifee/react-native';
import {isSession, refreshRecordData} from '../actions';
import {getLocationAndSave} from '../components/common/Common';

export default function Dashboard() {
  const is_Session = useSelector((state) => state?.sessionReducer?.isSession);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        getLocationAndSave();
      } else if (nextAppState === 'background') {
        console.log('App has gone to the background.');
        // getLocationAndSave();
      } else if (nextAppState === 'inactive') {
        console.log('App is inactive (possibly being closed).');
        getLocationAndSave();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const MyComponent = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    dispatch(getEnabledModules());

    useEffect(() => {
      const getnavigate = async () => {
        await messaging()
          .getInitialNotification()
          .then(async (remoteMessage) => {
            if (remoteMessage) {
              if (remoteMessage?.data) {
                if (remoteMessage?.data?.moduleName) {
                  if (remoteMessage?.data?.recordId) {
                    navigationRef.navigate('Record Details', {
                      moduleName: remoteMessage?.data?.moduleName,
                      moduleLable: remoteMessage?.data?.moduleName,
                      recordId: remoteMessage?.data?.recordId,
                      navigation: navigationRef,
                      listerInstance: {
                        ...this,
                        moduleName: remoteMessage?.data?.moduleName,
                        refreshData: refreshRecordData(this),
                      },
                      isDashboard: true,
                    });
                  } else {
                    navigationRef.navigate('Records', {
                      moduleName: remoteMessage?.data?.moduleName,
                      moduleLable: remoteMessage?.data?.moduleName,
                      navigation: navigationRef,
                    });
                  }
                } else {
                  reset([{name: 'Drawer'}]);
                }
              }
              await notifee.cancelNotification(detail?.notification?.id);
            }
          });
      };
      getnavigate();
    }, []);

    useEffect(() => {
      if (is_Session) {
        dispatch(isSession(false));
      }
    }, [is_Session]);

    return (
      <View style={styles.backgroundStyle}>
        <Header title={'Home'} />
        <View style={styles.recordListerBackground}>
          <UpdateWidget navigation={navigation} />
        </View>
      </View>
    );
  };
  const MemoizedComponent = useMemo(() => {
    return is_Session ? <MyComponent /> : <MyComponent />;
  }, [is_Session]);

  return <>{MemoizedComponent}</>;
}

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',
    flex: 1,
    // backgroundColor: '#f2f3f8',
    backgroundColor: generalBgColor,
  },
  recordListerBackground: {
    flex: 1,
    backgroundColor: generalBgColor,
  },
});
