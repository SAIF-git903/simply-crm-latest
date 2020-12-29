import React, { useState } from 'react';
import {
    View,
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import SwipeOut from 'react-native-swipeout';

import { deleteRecord } from '../../actions';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../variables/themeColors';
import { fontStyles } from '../../styles/common';

export default function RecordItem(props) {
    const {
        recordName,
        labels,
        listerInstance,
        item,
        index,
        selectedIndex,
        onRecordSelect
    } = props;

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigation = useNavigation();

    function onEdit() {
        navigation.navigate('Edit Record', { id: item.id, lister: listerInstance });
    }

    function onDelete() {
        Alert.alert('Are you sure want to delete this record ?', recordName,
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setIsLoading(true);
                        dispatch(deleteRecord(listerInstance, item.id, index, () => {
                            setIsLoading(false);
                        }))
                    }
                }
            ],
            { cancelable: true }
        );
    }

    function renderLabel(label, index) {
        if (!label || label.length === 0) return null;

        return (
            <Text
                key={index+2}
                numberOfLines={1}
                style={fontStyles.dashboardRecordLabel}
            >
                {label}
            </Text>
        );
    }

    function renderLabels(labels) {
        return labels.map(renderLabel);
    }

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
        onPress: onEdit
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
        onPress: onDelete
    }];

    if (!isLoading) {
        return (
            <View>
                <SwipeOut
                    style={{
                        backgroundColor: 'white'
                    }}
                    buttonWidth={70}
                    right={swipeOutButtons}
                    autoClose
                >
                    <TouchableOpacity
                        onPress={() => { onRecordSelect(item.id, index); }}
                    >
                        <View
                            style={[styles.backgroundStyle, {
                                borderTopWidth: (index === 0) ? 1 : 0,
                                backgroundColor:
                                    (selectedIndex === index) ?
                                        RECORD_SELECTED_COLOR : RECORD_COLOR
                            }]}
                        >
                            <Text
                                key={1}
                                numberOfLines={1}
                                style={fontStyles.dashboardRecordLabelBig}
                            >
                                {recordName}
                            </Text>
                            {labels ? renderLabels(labels) : null}
                        </View>
                    </TouchableOpacity>
                </SwipeOut>
            </View>
        );
    }

    return (
        <View
            style={[styles.backgroundStyle, {
                borderTopWidth: (index === 0) ? 1 : 0,
                justifyContent: 'space-around',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                    (selectedIndex === index) ?
                        RECORD_SELECTED_COLOR : RECORD_COLOR
            }]}
        >
            <Text style={fontStyles.fieldValue}>Deleting.....</Text>

            <ActivityIndicator />
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        borderColor: '#f2f3f8',
        borderBottomWidth: 1,
        padding: 15
    }
});
