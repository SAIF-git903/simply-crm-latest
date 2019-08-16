import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, 
    StyleSheet } from 'react-native';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../variables/themeColors';

class Leads extends Component {
    render() {
        return (
            <TouchableOpacity 
            onPress={() => { this.props.onRecordSelect(this.props.item.id, this.props.index); }}
            >
            <View 
            style={[styles.backgroundStyle, { 
                borderTopWidth: (this.props.index === 0) ? 1 : 0,
                backgroundColor: 
                (this.props.selectedIndex === this.props.index) ? 
                RECORD_SELECTED_COLOR : RECORD_COLOR }]}
            >
                <Text numberOfLines={1} style={{ fontWeight: 'bold', marginLeft: 10, paddingRight: 10 }}>
                    {this.props.item.lable}
                </Text>
            </View>
            </TouchableOpacity>
         
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        height: 30,
        borderColor: '#d3d3d3',
        paddingLeft: 5,
        justifyContent: 'space-around',
        paddingRight: 5,
        borderBottomWidth: 1
    }
});

export default connect(null)(Leads);
