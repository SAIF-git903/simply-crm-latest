import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Field extends Component {
    render() {
       return (
           <View style={{ width: '100%', height: 35, flexDirection: 'row' }}>
               <View style={{ flex: 1, padding: 5, alignItems: 'flex-end', paddingRight: 5 }}>
                   <Text>{this.props.label} :</Text>
                </View>
                <View style={{ flex: 1, padding: 5, paddingRight: 5 }}>
                   <Text>{this.props.value}</Text>
                </View>
            </View>
       );
    }
}
