import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SwipeOut from 'react-native-swipeout';
import { deleteRecord } from '../../../actions';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../../variables/themeColors';

class CampaignsRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    onEditPress() {
        //console.log('Edit Pressed');
        const { navigate } = this.props.navigation;
        navigate('EditRecordScreen', { id: this.props.id });
     }

    onDeletePress() {
        Alert.alert('Are you sure want to delete this record ?', this.props.lable,
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: this.deleteRecord.bind(this) }
            ],
            { cancelable: true }
          );
    }

    deleteRecord() {
        this.setState({ 
            loading: true
        });
        this.props.dispatch(deleteRecord(this.props.listerInstance, this.props.id, this.props.index, this));
    }

    render() {
        const swipeOutButtons = [{
            component: (
            <View 
            style={{ 
                flex: 1, 
                justifyContent: 'center',
                alignItems: 'center', 
                borderColor: '#d3d3d3',
                borderBottomWidth: 1,
                borderTopWidth: 1,
                
                backgroundColor: 'green' }} 
            >
                <Image resizeMode={'contain'} source={{ uri: 'edit' }} style={{ width: 30, height: 30 }} />
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
                borderColor: '#d3d3d3',
                borderBottomWidth: 1,
                borderTopWidth: 1,
                backgroundColor: 'red' }} 
            >
                <Image resizeMode={'contain'} source={{ uri: 'delete' }} style={{ width: 30, height: 30 }} />
            </View>
        ),
        onPress: this.onDeletePress.bind(this)
        }];

        return (
            <SwipeOut buttonWidth={70} right={swipeOutButtons} autoClose>
            <TouchableOpacity 
            onPress={() => { this.props.onRecordSelect(this.props.id, this.props.index); }}
            >
            <View 
            style={[styles.backgroundStyle, { 
                borderTopWidth: (this.props.index === 0) ? 1 : 0,
                backgroundColor: 
                (this.props.selectedIndex === this.props.index) ? 
                RECORD_SELECTED_COLOR : RECORD_COLOR }]}
            >
                <Text style={{ flex: 1, marginLeft: 10 }}>
                    {this.props.lable}
                </Text>
            </View>
            </TouchableOpacity>
            </SwipeOut>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        height: 50,
        borderColor: '#d3d3d3',
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 5,
        borderBottomWidth: 1
    }
});

export default connect(null)(CampaignsRecord);
