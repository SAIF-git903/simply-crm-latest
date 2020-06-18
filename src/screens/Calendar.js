import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    RefreshControl,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import { WeekCalendar, CalendarProvider, AgendaList, CalendarList } from 'react-native-calendars';
const moment = require('moment-timezone');
import SwipeOut from 'react-native-swipeout';

import { UPDATE_RECORD_VIEWER } from '../actions/types';
import {
    getCalendarRecords,
    deleteCalendarRecord,
    editRecord,
    editRecordCompleted
} from '../ducks/calendar';
import Header from '../components/common/Header';
import { fontStyles } from '../styles/common';

export default function Calendar() {

    const [currentDate, setCurrentDate] = useState(new moment())
    const [showCalendar, setShowCalendar] = useState(false);

    const dispatch = useDispatch();
    const {
        records,
        isLoading,
        isRefreshing,
        recordsLoading
    } = useSelector(state => state.calendar);

    const navigation = useNavigation();

    const dates = mapItemsToAgendaList(records);

    useFocusEffect(
        React.useCallback(() => {
            fetchData()
        }, [])
    )

    function renderAddRecordButton() {
        return <TouchableOpacity onPress={() => navigation.navigate('Add Record', {
            lister: {
                refreshData: () => fetchData()
            }
        })}>
            <View
                style={{
                    backgroundColor: 'rgba(255,255,255,.2)',
                    width: 27,
                    height: 27,
                    borderRadius: 3,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Icon
                    name='plus'
                    size={18}
                    color='white'
                />
            </View>
        </TouchableOpacity>
    }

    function onRecordPress(recordId) {
        dispatch({
            type: UPDATE_RECORD_VIEWER,
            payload: {
                navigation,
                moduleName: 'Calendar',
                showBackButton: true,
                moduleLable: 'Calendar',
                recordId: recordId
            }
        });

        navigation.navigate('Record Details')
    }

    function onEdit(item) {
        navigation.navigate('Edit Record', {
            id: item.id, lister: {
                refreshData: () => fetchData(true)
            }
        });
    }

    function onDelete(item) {
        Alert.alert('Are you sure want to delete this record ?', item.subject,
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        dispatch(deleteCalendarRecord(item.id))
                    }
                }
            ],
            { cancelable: true }
        );
    }

    function renderItem(props) {
        const { item } = props;
        let timeFrame = item.time_start + (item.time_end.length !== 0 ? '-' + item.time_end : '');

        const swipeOutButtons = [{
            component: (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f2f3f8',
                        borderColor: 'white',
                        borderRightWidth: 1
                    }}
                >
                    <Icon
                        name='pencil-alt'
                        solid
                        size={30}
                        color='black'
                    />
                </View>
            ),
            onPress: () => onEdit(item)
        },
        {
            component: (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f2f3f8'
                    }}
                >
                    <Icon
                        name='trash-alt'
                        solid
                        size={30}
                        color='black'
                    />
                </View>
            ),
            onPress: () => onDelete(item)
        }];

        return <SwipeOut
            style={{
                backgroundColor: 'transparent'
            }}
            buttonWidth={70}
            right={swipeOutButtons}
            autoClose
        >
            <TouchableOpacity
                style={{ ...styles.itemWrapper, paddingTop: props.index === 0 ? 10 : 0 }}
                onPress={() => onRecordPress(item.id)}
            >
                <View style={{ ...styles.item, opacity: recordsLoading.includes(item.id) ? 0.35 : 1 }}>
                    <Text style={fontStyles.calendarTitle}>{item.subject}</Text>
                    <Text style={fontStyles.calendarTextMedium}>{item.type}</Text>
                    <Text style={fontStyles.calendarText}>{item.title}</Text>
                    <Text style={fontStyles.calendarText}>{timeFrame}</Text>
                    {
                        item.taskstatus ?
                            <Text style={fontStyles.calendarText}>{item.taskstatus}</Text>
                            : null
                    }
                </View>
                {
                    recordsLoading.includes(item.id)
                        ? <ActivityIndicator
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        />
                        : null
                }

            </TouchableOpacity>
        </SwipeOut>
    }

    function fetchData(isRefreshing) {
        dispatch(getCalendarRecords(isRefreshing))
    }

    function mapItemsToAgendaList(items) {
        let mappedItems = [];


        const sortedItems = items.sort((a, b) => {
            let aNumber = a.date_start.replace(/-/g, '');
            let bNumber = b.date_start.replace(/-/g, '');
            return aNumber - bNumber;
        });

        for (const item of sortedItems) {
            const {
                date_start,
                subject,
                type,
                time_start,
                time_end,
                id
            } = item;

            const itemData = {
                title: date_start,
                subject,
                type,
                time_start,
                time_end,
                id
            }

            const existingDate = mappedItems.find(x => x.title === itemData.title);

            if (existingDate) {
                existingDate.data.push(itemData);
            } else {
                const date = {
                    title: item.date_start,
                    data: [itemData]
                };

                mappedItems.push(date);
            }
        }

        return mappedItems;
    }

    function getMarkedDates() {
        const marked = {};
        dates.forEach(item => {
            // NOTE: only mark dates with data
            if (item.data && item.data.length > 0) {
                marked[item.title] = { marked: true };
            }
        });

        // set current date selected
        const dateObj = marked[new moment(currentDate).format('YYYY-MM-DD')];
        marked[new moment(currentDate).format('YYYY-MM-DD')] = { ...dateObj, selected: true }
        return marked;
    }

    function renderEmpty() {
        if (isLoading) return null;

        return <View
            style={{
                marginTop: 10,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white'
            }}
        >
            <Text style={fontStyles.fieldLabel}>No records found.</Text>
        </View>
    }

    function renderHeader() {
        return <View
            style={{
                zIndex: 6000,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 40,
                paddingTop: 20,
                paddingBottom: 10,
                backgroundColor: 'white'
            }}
        >
            <View
                style={{ width: 30 }}
            />
            <Text style={{
                fontSize: 17,
                fontFamily: 'Poppins-Medium',
                color: '#62717C'
            }}>
                {new moment(currentDate).format('Y MMMM D')}
            </Text>


            <TouchableOpacity
                onPress={() => setShowCalendar(true)}
                style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Icon
                    style={{ marginLeft: 7, marginTop: -3 }}
                    name='calendar-alt'
                    size={20}
                    color='#00BBF2'
                />
            </TouchableOpacity>
        </View >
    }

    return (
        <View style={styles.backgroundStyle}>
            <Header
                title={'Calendar'}
                customRightButton={renderAddRecordButton()}
            />
            <View style={styles.wrapper}>

                <CalendarProvider
                    date={currentDate.format('YYYY-MM-DD')}
                    disabledOpacity={0.6}
                    showTodayButton
                    onDateChanged={(date) => setCurrentDate(new moment(date))}
                >
                    {
                        showCalendar
                            ? <CalendarList
                                current={currentDate.format('YYYY-MM-DD')}
                                firstDay={1}
                                markedDates={getMarkedDates()}
                                onDayPress={(date) => {
                                    console.log(date)
                                    setCurrentDate(new moment(date.dateString))
                                    setShowCalendar(false)
                                }}
                            />
                            : <View>
                                {renderHeader()}
                                <WeekCalendar
                                    firstDay={1}
                                    markedDates={getMarkedDates()}
                                />
                            </View>
                    }
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
                            textTransform: 'uppercase'
                        }}
                        ListEmptyComponent={renderEmpty()}
                        refreshControl={<RefreshControl
                            refreshing={isLoading && isRefreshing || (isLoading && records.length === 0)}
                            onRefresh={() => fetchData(true)}
                        />}
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
        backgroundColor: '#f2f3f8'
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        borderRadius: 3,
    },
    item: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5
    },
    empty: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.07)'
    },
    emptyWrapper: {
        paddingRight: 10,
        justifyContent: 'center',
        flex: 1
    }
});