import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import SwipeOut from 'react-native-swipeout';
import { deleteRecord } from '../../actions';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../variables/themeColors';
import { fontStyles } from '../../styles/common';

class RecordItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    getActions() {
        return [
            {
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
                onPress: this.onEdit.bind(this)
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
                onPress: this.onDelete.bind(this)
            }
        ];
    }

    onEdit() {
        //TODO Non-serializable values were found in the navigation state. Use navigation.setOption() instead
        this.props.navigation.navigate('Edit Record', {
            id: this.props.item.id,
            lister: this.props.listerInstance,
            isDashboard: this.props.isDashboard
        });
    }

    onDelete() {
        Alert.alert('Are you sure want to delete this record ?', this.props.recordName,
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        this.props.listerInstance.setState({
                            isFlatListRefreshing: true
                        }, () => {
                            this.props.dispatch(deleteRecord(this.props.listerInstance, this.props.item.id, this.props.index, () => {
                                this.props.listerInstance.setState({
                                    isFlatListRefreshing: false
                                });
                            }));
                        });
                    }
                }
            ],
            { cancelable: true }
        );
    }

    renderLabel(label, index) {
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

    renderLabels(labels) {
        return labels.map(this.renderLabel);
    }

    renderLoading() {
        return (
            <View
                style={[
                    styles.backgroundStyle,
                    {
                        borderTopWidth: (this.props.index === 0) ? 1 : 0,
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: (this.props.selectedIndex === this.props.index) ? RECORD_SELECTED_COLOR : RECORD_COLOR
                    }
                ]}
            >
                <Text style={fontStyles.fieldValue}>Deleting.....</Text>
                <ActivityIndicator />
            </View>
        );
    }

    renderLine() {
        //TODO swipe must be disabled for refRecordLister ??
        return (
            <View>
                <SwipeOut
                    style={{ backgroundColor: 'white' }}
                    buttonWidth={70}
                    right={this.getActions()}
                    autoClose
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onRecordSelect(this.props.item.id, this.props.index);
                        }}
                    >
                        <View
                            style={[
                                styles.backgroundStyle,
                                {
                                    borderTopWidth: (this.props.index === 0) ? 1 : 0,
                                    backgroundColor: (this.props.selectedIndex === this.props.index) ? RECORD_SELECTED_COLOR : RECORD_COLOR
                                }
                            ]}
                        >
                            <Text
                                key={1}
                                numberOfLines={1}
                                style={fontStyles.dashboardRecordLabelBig}
                            >
                                {this.props.recordName}
                            </Text>
                            {(this.props.labels) ? this.renderLabels(this.props.labels) : null}
                        </View>
                    </TouchableOpacity>
                </SwipeOut>
            </View>
        );
    }

    render() {
        return (
            (this.state.loading) ? this.renderLoading() : this.renderLine()
        );
    }
}

export default connect(null)(RecordItem);

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        borderColor: '#f2f3f8',
        borderBottomWidth: 1,
        padding: 15
    }
});
