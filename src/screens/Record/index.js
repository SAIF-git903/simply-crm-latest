import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../components/common/Header';
import Viewer from '../../components/recordViewer/viewer';
import Updates from './Updates';
import Comments from './Comments/';
import IconTabBar from '../../components/common/IconTabBar';
import {backgroundColor} from 'react-native-calendars/src/style';

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

  return (
    <View style={styles.backgroundStyle}>
      <Header title={'Record Details'} showBackButton />

      <View style={{width: '100%', flex: 1}}>
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
