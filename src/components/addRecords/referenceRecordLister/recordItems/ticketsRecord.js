import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, Image, Alert, Text, TouchableOpacity, 
    StyleSheet } from 'react-native';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../../../variables/themeColors';

class TicketsRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    render() {
        if (!this.state.loading) {
            return (
                <TouchableOpacity 
                onPress={() => { this.props.onRecordSelect(this.props.item.id, this.props.item.ticketLable, this.props.index); }}
                >
                <View 
                style={[styles.backgroundStyle, { 
                    borderTopWidth: (this.props.index === 0) ? 1 : 0,
                    backgroundColor: 
                    (this.props.selectedIndex === this.props.index) ? 
                    RECORD_SELECTED_COLOR : RECORD_COLOR }]}
                >
                    <Text numberOfLines={1} style={{ fontWeight: 'bold', marginLeft: 10, paddingRight: 10 }}>
                        {this.props.item.ticketLable}
                    </Text>
                    <Text numberOfLines={1} style={{ fontWeight: 'bold', marginLeft: 10, paddingRight: 10 }}>
                        {this.props.item.priority}
                    </Text>
                </View>
                </TouchableOpacity>
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
                RECORD_SELECTED_COLOR : RECORD_COLOR }]}
            >
                <Text>Deleting.....</Text>
                <ActivityIndicator />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        height: 70,
        borderColor: '#d3d3d3',
        paddingLeft: 5,
        justifyContent: 'space-around',
        paddingRight: 5,
        borderBottomWidth: 1
    }
});

export default connect(null)(TicketsRecord);
