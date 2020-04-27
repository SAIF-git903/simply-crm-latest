import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, ActivityIndicator, Image, Alert, Text, TouchableOpacity,
    StyleSheet
} from 'react-native';
import SwipeOut from 'react-native-swipeout';
import { deleteRecord } from '../../../actions';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../../variables/themeColors';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';


import { fontStyles } from '../../../styles/common';

class EventLableRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    onEditPress() {
        //console.log('Edit Pressed');
        const { navigate } = this.props.navigation;
        navigate('EditRecordScreen', { id: this.props.item.id });
    }

    onDeletePress() {
        Alert.alert('Are you sure want to delete this record ?', this.props.item.eventLable,
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                { text: 'Yes', onPress: this.deleteRecord.bind(this) }
            ],
            { cancelable: true }
        );
    }

    deleteRecord() {
        this.setState({
            loading: true
        });
        this.props.dispatch(deleteRecord(this.props.listerInstance, this.props.item.id, this.props.index, this));
    }

    renderLabel(label) {
        if (!label || label.length === 0) return null;

        return <Text
            numberOfLines={1}
            style={fontStyles.dashboardRecordLabel}
        >
            {label}
        </Text>
    }

    render() {
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
            onPress: this.onEditPress.bind(this)
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
            onPress: this.onDeletePress.bind(this)
        }];

        if (!this.state.loading) {
            return (
                <SwipeOut buttonWidth={70} right={swipeOutButtons} autoClose>
                    <TouchableOpacity
                        onPress={() => { this.props.onRecordSelect(this.props.item.id, this.props.index); }}
                    >
                        <View
                            style={[styles.backgroundStyle, {
                                borderTopWidth: (this.props.index === 0) ? 1 : 0,
                                backgroundColor:
                                    (this.props.selectedIndex === this.props.index) ?
                                        RECORD_SELECTED_COLOR : RECORD_COLOR
                            }]}
                        >
                            <Text
                                numberOfLines={1}
                                style={fontStyles.dashboardRecordLabelBig}
                            >
                                {this.props.item.eventLable}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </SwipeOut>
            );
        }

        return (
            <View
                style={[styles.backgroundStyle, {
                    borderTopWidth: (this.props.index === 0) ? 1 : 0,
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor:
                        (this.props.selectedIndex === this.props.index) ?
                            RECORD_SELECTED_COLOR : RECORD_COLOR
                }]}
            >
                <Text style={fontStyles.fieldValue}>Deleting.....</Text>
                <ActivityIndicator />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        borderColor: '#f2f3f8',
        borderBottomWidth: 1,
        padding: 15
    }
});

export default connect(null)(EventLableRecord);
