import React, { useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Timeline from 'react-native-timeline-flatlist'
import Icon from 'react-native-vector-icons/FontAwesome5Pro';

import { fetchHistory } from '../../ducks/updates';
import { fontStyles } from '../../styles/common';

const moment = require('moment-timezone');

export default function Updates({ moduleName, recordId }) {

    const dispatch = useDispatch();
    const {
        fields,
        history,
        isLoading
    } = useSelector(state => state.updates)

    const { crmTz } = useSelector(state => state.auth.loginDetails)

    useEffect(() => {
        dispatch(fetchHistory(moduleName, recordId));
    }, []);

    const data = mapHistoryToData();

    function mapHistoryToData() {
        return history.map(x => {
            const values = [];

            if (x.status !== '2') {
                const valueKeys = Object.keys(x.values);

                for (const field of fields) {
                    if (valueKeys.includes(field.name)) {
                        values.push({
                            fieldName: field.label,
                            current: x.values[field.name].current,
                            previous: x.values[field.name].previous
                        })
                    }
                }
            }

            let comment = null;

            if (values.length === 0) {
                if (x.values.record) {

                    switch (x.values.record.module) {
                        case 'ModComments':
                            comment = x.values.record.label;
                            break;

                        default:
                            break;
                    }
                }
            }

            return {
                modifying_user: x.modifieduser.label,
                statuslabel: assignStatusLabel(x.status, x.values.record?.module),
                values,
                comment,
                time: moment(moment.tz(x.modifiedtime, crmTz).format()).fromNow(),
                icon: assignIcon(x.status)
            }
        })
    }

    function assignStatusLabel(status, moduleName) {
        switch (status) {
            case '2':
                return 'created record';

            case '4':
                if (moduleName === 'ModComments') return 'commented';
                if (moduleName) return `linked to ${moduleName}`
                return 'linked';

            case '0':
                return 'updated';

            case '6':
                return 'made a call';

            default:
                break;
        }
    }

    function assignIcon(status) {
        switch (status) {
            case '2':
                return 'plus';

            case '4':
                return 'comment';

            case '0':
                return 'pen';

            case '6':
                return 'phone';

            default:
                break;
        }
    }

    function onRefresh() {
        dispatch(fetchHistory(moduleName, recordId, true));
    }

    function renderIcon(icon) {
        return <Icon
            name={icon || 'clock'}
            size={22}
            color={'white'}
        />
    }

    function renderDetail(rowData, sectionID, rowID) {

        const renderValuesView = (values) => {
            const renderValue = (stringValue) => !stringValue || stringValue.length === 0 ? 'empty' : stringValue;

            if (!values || values.length === 0) return null;

            return values.map(x => <View
                key={x.fieldName}
            >
                <Text style={styles.text}><Text style={styles.fieldNameText}>{x.fieldName}</Text> updated</Text>
                <Text style={styles.text}><Text style={styles.fieldNameText}>from</Text> {renderValue(x.previous)}</Text>
                <Text style={styles.text}><Text style={styles.fieldNameText}>to</Text> {renderValue(x.current)}</Text>
            </View>
            );
        }

        return <View style={styles.card}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.nameText}>{rowData.modifying_user}</Text>
                <Text style={styles.statusText}> {rowData.statuslabel}</Text>
            </View>

            <Text style={styles.timeText}>{rowData.time}</Text>

            <View style={{ paddingTop: rowData.values.length === 0 && !rowData.comment ? 0 : 5 }}>
                {
                    rowData.comment
                        ? <View>
                            <Text style={styles.fieldNameText}>Comment:</Text>
                            <Text style={styles.text}>{rowData.comment}</Text>
                        </View>
                        : renderValuesView(rowData.values)
                }
            </View>
        </View>
    }

    function renderCircle(rowData, sectionID, rowID) {
        return <View
            style={styles.circle}
        >
            <View style={styles.innerCircle}>
                {renderIcon(rowData.icon)}
            </View>
        </View>
    }

    function renderEmpty() {
        if (isLoading) return null;

        return <View
            style={styles.emptyList}
        >
            <Text style={fontStyles.fieldLabel}>Empty history.</Text>
        </View>
    }

    function renderTimeline() {
        return <Timeline
            renderDetail={(rowData, sectionID, rowID) => renderDetail(rowData, sectionID, rowID)}
            renderCircle={(rowData, sectionID, rowID) => renderCircle(rowData, sectionID, rowID)}
            showTime={false}
            data={data}
            options={{
                contentContainerStyle: {
                    padding: 15,
                },
                ListEmptyComponent: renderEmpty(),
                refreshControl: (
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                    />
                )
            }}
        />
    }

    return (
        <View style={styles.wrapper}>
            {renderTimeline()}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        flex: 1
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 20,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    circle: {
        left: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerCircle: {
        backgroundColor: '#007AFF',
        height: 40,
        width: 40,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyList: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    nameText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#2b879e'
    },
    statusText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#333333'
    },
    timeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#777777'
    },
    fieldNameText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#2b879e'
    },
    text: {
        fontFamily: 'Poppins-Regular'
    }
});
