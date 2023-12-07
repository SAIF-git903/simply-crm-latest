import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  WeekCalendar,
  CalendarProvider,
  AgendaList,
  CalendarList,
} from 'react-native-calendars';
import SwipeOut from 'react-native-swipeout';
import Popover from 'react-native-popover-view';

import {UPDATE_RECORD_VIEWER} from '../actions/types';
import {getCalendarRecords, deleteCalendarRecord} from '../ducks/calendar';
import Header from '../components/common/Header';
import {fontStyles} from '../styles/common';

const moment = require('moment-timezone');

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new moment());
  const [showCalendar, setShowCalendar] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const {records, isLoading, isRefreshing, recordsLoading} = useSelector(
    (state) => state.calendar,
  );

  const navigation = useNavigation();

  const new_Data = mapItemsToAgendaList(data);

  let modifyData = [];

  let date = moment(new Date()).format('YYYY-MM-DD');
  modifyData = new_Data.filter((val) => val.title >= date);

  const dates = modifyData.sort((a, b) => {
    const dateA = new Date(a.title);
    const dateB = new Date(b.title);
    return dateA - dateB;
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  useEffect(() => {
    if (records.length >= 0) {
      if (data != null && data != undefined) {
        setData([...data, ...records]);
      } else {
        setData(records);
      }
    }
  }, [records]);

  // const loadmoredata = () => {
  //   if (dates.length > 0) {
  //     fetchData(true, page);
  //   }
  // };

  const renderFooter = () => {
    // if (dates.length > 0 && records?.length > 0) {
    //   return (
    //     <View style={{alignItems: 'center', padding: 10}}>
    //       <ActivityIndicator size="small" animating={isRefreshing} />
    //       <Text style={{color: 'gray'}}>
    //         {isRefreshing ? 'Loading records...' : null}
    //       </Text>
    //     </View>
    //   );
    // }
    if (isLoading) {
      return (
        <View style={{alignItems: 'center', padding: 10}}>
          <ActivityIndicator
            size="small"
            animating={isLoading}
            color={'#00BBF2'}
          />
          <Text style={{color: 'gray'}}>{'Loading...'}</Text>
        </View>
      );
    }
  };

  function renderAddRecordButton() {
    return (
      // <View
      //   style={{
      //     alignItems: 'center',
      //     flexDirection: 'row',
      //     justifyContent: 'center',

      //     // backgroundColor: 'red',
      //   }}>
      <Popover
        isVisible={visible}
        verticalOffset={
          Platform.OS === 'android' ? -StatusBar.currentHeight : 0
        }
        onRequestClose={() => setVisible(false)}
        from={
          <TouchableOpacity
            // style={{marginRight: 10}}
            onPress={() => setVisible(true)}>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,.2)',
                width: 27,
                height: 27,
                borderRadius: 3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="plus" size={18} color="white" />
            </View>
          </TouchableOpacity>
        }>
        <TouchableOpacity
          style={{
            height: 35,
            width: 110,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setVisible(false);
            navigation.navigate('Add Record', {
              lister: {
                refreshData: () => fetchData(),
              },
              submodule: 'Events',
            });
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#EE4B2B',
              fontWeight: '700',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Add Event
          </Text>
        </TouchableOpacity>
        <View
          style={{
            borderWidth: 0.5,
            width: '70%',
            borderColor: '#707070',
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          style={{
            width: 110,

            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            setVisible(false);
            navigation.navigate('Add Record', {
              lister: {
                refreshData: () => fetchData(),
              },
              submodule: 'Tasks',
            });
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#5699E6',
              fontWeight: 'bold',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Add Task
          </Text>
        </TouchableOpacity>
      </Popover>

      // <TouchableOpacity
      //   onPress={() =>
      //     navigation.navigate('Add Record', {
      //       lister: {
      //         refreshData: () => fetchData(),
      //       },
      //     })
      //   }>
      //   <View
      //     style={{
      //       backgroundColor: 'rgba(255,255,255,.2)',
      //       width: 27,
      //       height: 27,
      //       borderRadius: 3,
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //     }}>
      //     <Icon name="plus" size={18} color="white" />
      //   </View>
      // </TouchableOpacity>
      // </View>
    );
  }

  function onRecordPress(recordId) {
    dispatch({
      type: UPDATE_RECORD_VIEWER,
      payload: {
        navigation,
        moduleName: 'Calendar',
        showBackButton: true,
        moduleLable: 'Calendar',
        recordId: recordId,
      },
    });
    navigation.navigate('Record Details');
  }

  function onEdit(item) {
    navigation.navigate('Edit Record', {
      id: item.id,
      lister: {
        refreshData: () => fetchData(true),
      },
    });
  }

  function onDelete(item) {
    Alert.alert(
      'Are you sure want to delete this record ?',
      item.subject,
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            dispatch(deleteCalendarRecord(item.id));
            let newdatas = dates.filter((val) => val.id !== item.Id);
            setData(newdatas);
            fetchData(true);
          },
        },
      ],
      {cancelable: true},
    );
  }

  function renderItem(props) {
    const {item} = props;

    let timeFrame =
      item.time_start +
      (item.time_end?.length !== 0 ? '-' + item.time_end : '');

    const swipeOutButtons = [
      {
        component: (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f2f3f8',
              borderColor: 'white',
              borderRightWidth: 1,
            }}>
            <Icon name="pencil-alt" solid size={30} color="black" />
          </View>
        ),
        onPress: () => onEdit(item),
      },
      {
        component: (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f2f3f8',
            }}>
            <Icon name="trash-alt" solid size={30} color="black" />
          </View>
        ),
        onPress: () => onDelete(item),
      },
    ];

    return (
      <SwipeOut
        style={{
          backgroundColor: 'transparent',
        }}
        buttonWidth={70}
        right={swipeOutButtons}
        autoClose>
        <TouchableOpacity
          style={{
            ...styles.itemWrapper,
            paddingTop: props.index === 0 ? 10 : 0,
          }}
          onPress={() => onRecordPress(item.id)}>
          <View
            style={{
              ...styles.item,
              opacity: recordsLoading.includes(item.id) ? 0.35 : 1,
            }}>
            <Text style={fontStyles.calendarTitle}>{item.subject}</Text>
            <Text style={fontStyles.calendarTextMedium}>{item.type}</Text>
            <Text style={fontStyles.calendarText}>{item.title}</Text>
            <Text style={fontStyles.calendarText}>{timeFrame}</Text>
            {item.taskstatus ? (
              <Text style={fontStyles.calendarText}>{item.taskstatus}</Text>
            ) : null}
          </View>
          {recordsLoading.includes(item.id) ? (
            <ActivityIndicator
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          ) : null}
        </TouchableOpacity>
      </SwipeOut>
    );
  }

  function fetchData(isRefreshing, page) {
    dispatch(getCalendarRecords(isRefreshing, page));
  }

  // function mapItemsToAgendaList(items) {
  //   let mappedItems = [];

  //   const sortedItems = items.sort((a, b) => {
  //     let aNumber = a.date_start.replace(/-/g, '');
  //     let bNumber = b.date_start.replace(/-/g, '');
  //     return aNumber - bNumber;
  //   });

  //   for (const item of sortedItems) {
  //     const {date_start, subject, type, time_start, time_end, id} = item;

  //     const itemData = {
  //       title: date_start,
  //       subject,
  //       type,
  //       time_start,
  //       time_end,
  //       id,
  //     };

  //     const existingDate = mappedItems.find((x) => x.title === itemData.title);

  //     if (existingDate) {
  //       existingDate.data.push(itemData);
  //     } else {
  //       const date = {
  //         title: item.date_start,
  //         data: [itemData],
  //       };
  //       mappedItems.push(date);
  //     }
  //   }

  //   return mappedItems;
  // }

  function mapItemsToAgendaList(items) {
    let mappedItems = [];

    // Create a Set to keep track of unique dates
    const uniqueDates = new Set();

    const sortedItems = items.sort((a, b) => {
      let aNumber = a.date_start.replace(/-/g, '');
      let bNumber = b.date_start.replace(/-/g, '');
      return aNumber - bNumber;
    });

    for (const item of sortedItems) {
      const {date_start, subject, type, time_start, time_end, id} = item;

      const itemData = {
        title: date_start,
        subject,
        type,
        time_start,
        time_end,
        id,
      };

      // Check if the date is already in uniqueDates

      if (!uniqueDates.has(itemData.id)) {
        // Add the date to uniqueDates
        uniqueDates.add(itemData.id);

        // Find if there's an existing date in mappedItems
        const existingDateIndex = mappedItems.findIndex(
          (x) => x.title === itemData.title,
        );

        if (existingDateIndex !== -1) {
          // If the date exists, push the itemData into its data array
          mappedItems[existingDateIndex].data.push(itemData);
        } else {
          // If the date doesn't exist, create a new entry
          const date = {
            title: item.date_start,
            data: [itemData],
          };
          mappedItems.push(date);
        }
      }
    }

    return mappedItems;
  }

  function getMarkedDates() {
    const marked = {};
    dates.forEach((item) => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0) {
        marked[item.title] = {marked: true};
      }
    });

    // set current date selected
    const dateObj = marked[new moment(currentDate).format('YYYY-MM-DD')];
    marked[new moment(currentDate).format('YYYY-MM-DD')] = {
      ...dateObj,
      selected: true,
    };
    return marked;
  }

  function renderEmpty() {
    if (isLoading) {
      return null;
    }

    return (
      <View
        style={{
          marginTop: 10,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'white',
        }}>
        <Text style={[fontStyles.fieldLabel, {fontSize: 15}]}>
          No upcoming Events or Tasks
        </Text>
      </View>
    );
  }

  function renderHeader() {
    return (
      <View
        style={{
          zIndex: 6000,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 40,
          paddingTop: 20,
          paddingBottom: 10,
          backgroundColor: 'white',
        }}>
        <View style={{width: 30}} />
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'Poppins-Medium',
            color: '#62717C',
          }}>
          {new moment(currentDate).format('Y MMMM D')}
        </Text>
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={{
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            style={{marginLeft: 7, marginTop: -3}}
            name="calendar-alt"
            size={20}
            color="#00BBF2"
          />
        </TouchableOpacity>
      </View>
    );
  }

  // const renderlistHeader = () => {
  //   const existingDates = dates.map((item) => item.title);

  //   const currentDate = moment(new Date()).format('YYYY-MM-DD');

  //   const futureDatesAvailable = existingDates.some((date) => {
  //     const dateObj = date;
  //     return dateObj > currentDate;
  //   });
  //   const currentDatesAvailable = existingDates.some((date) => {
  //     const dateObj = date;

  //     return dateObj === currentDate;
  //   });

  //   if (dates.length > 0) {
  //     // if (futureDatesAvailable === false && currentDatesAvailable === false) {
  //     return (
  //       <View
  //         style={{
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           marginVertical: 10,
  //         }}>
  //         <Text style={{color: 'gray', fontFamily: 'Poppins-Regular'}}>
  //           {futureDatesAvailable === false
  //             ? 'No upcoming event and Task'
  //             : currentDatesAvailable === false
  //             ? 'No Today records found'
  //             : null}
  //         </Text>
  //       </View>
  //     );
  //     // }
  //   }
  // };

  return (
    <View style={styles.backgroundStyle}>
      <Header
        title={'Calendar'}
        customRightButton={renderAddRecordButton()}
        //TODO there is only one 'Add new record' button, and it will create a Event, so there is no way to create new Task record
      />
      <View style={styles.wrapper}>
        <CalendarProvider
          date={currentDate.format('YYYY-MM-DD')}
          disabledOpacity={0.6}
          showTodayButton
          onDateChanged={(date) => setCurrentDate(new moment(date))}
          //TODO set me ?? for prevent width: 100%
          // todayButtonStyle={}
        >
          {showCalendar ? (
            <CalendarList
              current={currentDate.format('YYYY-MM-DD')}
              firstDay={1}
              markedDates={getMarkedDates()}
              onDayPress={(date) => {
                setCurrentDate(new moment(date.dateString));
                setShowCalendar(false);
              }}
            />
          ) : (
            <View>
              {renderHeader()}
              <WeekCalendar firstDay={1} markedDates={getMarkedDates()} />
            </View>
          )}

          <AgendaList
            sections={dates}
            renderItem={renderItem}
            sectionStyle={{
              backgroundColor: '#B3BDCA',
              color: 'white',
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 20,
              textTransform: 'uppercase',
            }}
            ListEmptyComponent={renderEmpty()}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={records.length > 0 ? false : true}
            //     title={'Getting records'}
            //     titleColor={'gray'}
            //     onRefresh={() => fetchData()}
            //   />
            // }
            // ListHeaderComponent={renderlistHeader}
            // onEndReached={loadmoredata}
            // onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
          />
        </CalendarProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',
    flex: 1,
    backgroundColor: '#f2f3f8',
  },
  wrapper: {
    flex: 1,
  },
  itemWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    paddingTop: 0,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  item: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
  },
  empty: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.07)',
  },
  emptyWrapper: {
    paddingRight: 10,
    justifyContent: 'center',
    flex: 1,
  },
});
