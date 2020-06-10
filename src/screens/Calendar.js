import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import { Agenda } from 'react-native-calendars';
const moment = require('moment-timezone');

import Header from '../components/common/Header';

export default function Calendar() {
    const [items, setItems] = useState({});
    const navigation = useNavigation();

    function renderAddRecordButton() {
        return <TouchableOpacity onPress={() => navigation.navigate('Add Record', { lister: this.lister })}>
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

    function renderItem(item) {
        return <View style={styles.itemWrapper}>
            <View style={styles.item}>
                <Text>{item.name}</Text>
            </View>
        </View>
    }

    function timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    function loadItems(day) {
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);
                if (!items[strTime]) {
                    items[strTime] = [];
                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            height: Math.max(50, Math.floor(Math.random() * 150))
                        });
                    }
                }
            }
            const newItems = {};
            Object.keys(items).forEach(key => { newItems[key] = items[key]; });
            setItems(newItems)
        }, 1000);
    }

    return (
        <View style={styles.backgroundStyle}>
            <Header
                title={'Calendar'}
                customRightButton={renderAddRecordButton()}
            />
            <View style={styles.wrapper}>
                <Agenda
                    items={items}
                    selected={moment().format('YYYY-MM-DD')}
                    loadItemsForMonth={(month) => loadItems(month)}
                    pastScrollRange={50}
                    futureScrollRange={50}
                    renderItem={(item, firstItemInDay) => renderItem(item)}
                    renderEmptyDate={() => <View style={styles.emptyWrapper}>
                        <View style={styles.empty} />
                    </View>}
                    renderEmptyData={() => { return (<View />); }}
                    rowHasChanged={(r1, r2) => { return r1.text !== r2.text }}
                    refreshing={false}
                    theme={{
                        textDayFontFamily: 'Poppins-Bold',
                        textDayHeaderFontFamily: 'Poppins-Regular',
                        textMonthFontFamily: 'Poppins-Regular'
                    }}
                />
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
        paddingRight: 10,
        flex: 1,
        justifyContent: 'center'
    },
    item: {
        backgroundColor: 'white',
        padding: 10
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