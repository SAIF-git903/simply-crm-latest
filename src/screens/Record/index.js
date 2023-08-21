import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';

import Header from '../../components/common/Header';
import Viewer from '../../components/recordViewer/viewer';
import Updates from './Updates';
import Comments from './Comments/';
import IconTabBar from '../../components/common/IconTabBar';
import {backgroundColor} from 'react-native-calendars/src/style';
import {API_fetchButtons} from '../../helper/api';
import {URLDETAILSKEY} from '../../variables/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';

var ScrollableTabView = require('react-native-scrollable-tab-view');

export default function RecordDetails() {
  const recordViewerState = useSelector((state) => state.recordViewer);
  const {enabledModules} = useSelector(
    (state) => state.comments,
    (p, n) => p.enabledModules === n.enabledModules,
  );

  console.log('recordViewerState', recordViewerState);
  console.log('enabledModules', enabledModules);
  const {navigation, moduleName, recordId} = recordViewerState;
  function createTabs() {
    const tabs = [];

    const viewer = {
      tabIcon: 'file-alt',
      component: (
        <Viewer
          key={1}
          tabLabel="Details"
          navigation={navigation}
          moduleName={moduleName}
          recordId={recordId}
        />
      ),
    };

    const updates = {
      tabIcon: 'history',
      component: (
        <Updates
          key={2}
          tabLabel="Updates"
          moduleName={moduleName}
          recordId={recordId}
        />
      ),
    };

    const comments = {
      tabIcon: 'comment',
      component: <Comments key={3} tabLabel="Comments" recordId={recordId} />,
    };

    tabs.push(viewer, updates);

    if (enabledModules.includes(moduleName)) tabs.push(comments);

    return tabs;
  }

  const tabs = createTabs();
  const tabIcons = tabs.map((x) => x.tabIcon);
  const tabComponents = tabs.map((x) => x.component);

  useEffect(() => {
    getButtons();
  }, []);

  const getButtons = async () => {
    let modulename = moduleName === 'Contacts' ? moduleName : null;

    try {
      const URLDetails = JSON.parse(await AsyncStorage.getItem(URLDETAILSKEY));
      let url = URLDetails.url;
      let trimmedUrl = url.replace(/ /g, '').replace(/\/$/, '');
      trimmedUrl =
        trimmedUrl.indexOf('://') === -1 ? 'https://' + trimmedUrl : trimmedUrl;
      if (url.includes('www.')) {
        trimmedUrl = trimmedUrl.replace('www.', '');
      }
      if (url.includes('http://')) {
        trimmedUrl = trimmedUrl.replace('http://', 'https://');
      }

      let res = await API_fetchButtons(trimmedUrl, modulename);
      console.log('res', res);
    } catch (error) {
      console.log('err', error);
    }
  };

  return (
    <View style={styles.backgroundStyle}>
      {moduleName === 'Contacts' ? (
        <Header title={'Record Details'} showBackButton showDetailButton />
      ) : (
        <Header title={'Record Details'} showBackButton />
      )}

      {moduleName === 'Contacts' && (
        <View style={{width: '100%', flex: 0.3}}>
          <View style={{backgroundColor: '#fff'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 10,
                marginVertical: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{height: 65, width: 65}}>
                  <Image
                    source={require('../../../assets/images/user.png')}
                    style={{height: '100%', width: '100%'}}
                  />
                </View>
                <View style={{paddingLeft: 10}}>
                  <Text style={{fontSize: 18, fontWeight: '700'}}>
                    FirstName LastName
                  </Text>

                  <Text style={{fontSize: 15}}>Organization Name</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Entypo name="edit" size={28} color="#9a9a9c" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={{width: '100%', flex: moduleName === 'Contacts' ? 0.7 : 1}}>
        <ScrollableTabView
          prerenderingSiblingsNumber={Infinity}
          style={{backgroundColor: '#f2f3f8'}}
          renderTabBar={() => <IconTabBar tabIcons={tabIcons} />}
          tabBarActiveTextColor={'#00BBF2'}
          tabBarInactiveTextColor={'#707070'}
          tabBarUnderlineStyle={{
            backgroundColor: '#00BBF2',
            height: 3,
          }}
          contentProps={{
            keyboardShouldPersistTaps: 'handled',
          }}
          tabBarTextStyle={{
            fontSize: 14,
            paddingTop: 10,
          }}>
          {tabComponents}
        </ScrollableTabView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
});
