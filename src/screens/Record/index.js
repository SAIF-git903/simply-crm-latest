import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

import {useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';

import Header from '../../components/common/Header';
import Viewer from '../../components/recordViewer/viewer';
import Updates from './Updates';
import Comments from './Comments/';
import IconTabBar from '../../components/common/IconTabBar';
import {backgroundColor} from 'react-native-calendars/src/style';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Summery from '../../components/recordViewer/Summery';

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

    const Summary = {
      tabIcon: 'list-ul',
      tabLabel: 'Summary',
      component: (
        <Summery
          key={1}
          tabLabel="Details"
          navigation={navigation}
          moduleName={moduleName}
          recordId={recordId}
        />
      ),
    };
    const viewer = {
      tabIcon: 'file-alt',
      tabLabel: 'Details',
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
      tabLabel: 'Updates',
      component: (
        <Updates
          key={2}
          tabLabel="Updates"
          moduleName={moduleName}
          recordId={recordId}
        />
      ),
    };

    const contacts = {
      tabIcon: 'user',
      tabLabel: 'Contacts',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };

    const deals = {
      tabIcon: 'handshake',
      tabLabel: 'Deals',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const messagehistory = {
      tabIcon: 'sms',
      tabLabel: 'Message History',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const salesOrders = {
      tabIcon: 'clipboard-list',
      tabLabel: 'Sales Orders',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const invoices = {
      tabIcon: 'file-invoice-dollar',
      tabLabel: 'Invoices',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const activities = {
      tabIcon: 'calendar-alt',
      tabLabel: 'Activities',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const emails = {
      tabIcon: 'envelope',
      tabLabel: 'Emails',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const documents = {
      tabIcon: 'file',
      tabLabel: 'Documents',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const members = {
      tabIcon: 'building',
      tabLabel: 'Members',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const tickets = {
      tabIcon: 'ticket-alt',
      tabLabel: 'Tickets',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const products = {
      tabIcon: 'shopping-cart',
      tabLabel: 'Products',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const services = {
      tabIcon: 'hand-holding-usd',
      tabLabel: 'Services',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const simplyvoice = {
      tabIcon: 'phone-call',
      tabLabel: 'Simply Voice',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const feedBack = {
      tabIcon: 'feedback',
      tabLabel: 'Feedback',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const webtracker = {
      tabIcon: 'search',
      tabLabel: 'Web Tracker',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const vendors = {
      tabIcon: 'shield-alt',
      tabLabel: 'Vendors',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const participations = {
      tabIcon: 'groups',
      tabLabel: 'Participations',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };

    const comments = {
      tabIcon: 'comment',
      tabLabel: 'Comments',
      component: <Comments key={3} tabLabel="Comments" recordId={recordId} />,
    };

    tabs.push(
      // Summary,
      viewer,
      updates,
      // contacts,
      // deals,
      // messagehistory,
      // salesOrders,
      // invoices,
      // activities,
      // emails,
      // documents,
      // members,
      // tickets,
      // products,
      // services,
      // simplyvoice,
      // feedBack,
      // webtracker,
      // vendors,
      // participations,
    );

    if (enabledModules.includes(moduleName)) tabs.push(comments);

    return tabs;
  }

  const tabs = createTabs();
  // const tabIcons = tabs.map((x) => x.tabIcon);
  // const tabComponents = tabs.map((x) => x.component);
  const [items, setItems] = useState('Details');
  const [itemsToShow, setItemsToShow] = useState(3);

  const loadMore = () => {
    setItemsToShow(itemsToShow + 5); // Load more items
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 15,
          justifyContent: 'center',
          borderBottomWidth: item.tabLabel === items ? 2 : 0,
          borderBottomColor: item.tabLabel === items ? '#00BBF2' : '#707070',
          padding: 5,
        }}
        onPress={() => setItems(item.tabLabel)}>
        {item.tabLabel === 'Simply Voice' ? (
          <Feather
            name={item.tabIcon}
            color={item.tabLabel === items ? '#00BBF2' : '#707070'}
            size={20}
          />
        ) : item.tabLabel === 'Feedback' ? (
          <MaterialIcons
            name={item.tabIcon}
            color={item.tabLabel === items ? '#00BBF2' : '#707070'}
            size={20}
          />
        ) : item.tabLabel === 'Participations' ? (
          <MaterialIcons
            name={item.tabIcon}
            color={item.tabLabel === items ? '#00BBF2' : '#707070'}
            size={20}
          />
        ) : (
          <Icon
            name={item.tabIcon}
            color={item.tabLabel === items ? '#00BBF2' : '#707070'}
            size={20}
          />
        )}

        <Text
          style={{
            paddingLeft: 10,
            fontFamily:
              item.tabLabel === items ? 'Poppins-Medium' : 'Poppins-Regular',
            color: item.tabLabel === items ? '#00BBF2' : '#707070',
          }}>
          {item.tabLabel}
        </Text>
      </TouchableOpacity>
    );
  };

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
    <View style={{flex: 1}}>
      <Header title={'Record Details'} showBackButton />
      <View style={{height: '7%'}}>
        <FlatList
          data={tabs.slice(0, itemsToShow)}
          horizontal
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ListFooterComponent={
            tabs.length > itemsToShow && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#00BBF2',
                  marginRight: 10,
                  borderRadius: 5,
                }}
                onPress={loadMore}>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: '#fff',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Load More
                </Text>
              </TouchableOpacity>
            )
          }
        />
      </View>
      <View style={{flex: 1}}>
        {tabs.map((val) => {
          if (val.tabLabel === items) {
            return val.component;
          }
        })}
      </View>
      {/* <View style={{width: '100%', flex: 1}}>
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
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',

    backgroundColor: 'white',
  },
});
