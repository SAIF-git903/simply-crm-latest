import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { fontStyles } from '../../styles/common';

export default class Field extends Component {
    render() {
        return (
            <View style={{
                width: '100%',
                maxHeight: 60,
                height: 60,
                flexDirection: 'row',
                borderBottomWidth: .5,
                borderColor: '#f2f3f8',
                alignItems: 'center',
                padding: 10
            }}>
                <View style={{ flex: .6, alignItems: 'flex-start', paddingRight: 5 }}>
                    <Text
                        style={fontStyles.fieldLabel}
                        numberOfLines={2}
                    >
                        {this.props.label}:
                    </Text>
                </View>
                <View style={{ flex: 1.4, paddingLeft: 10, alignItems: 'flex-start' }}>
                    <Text
                        style={fontStyles.fieldValue}
                        numberOfLines={2}
                    >
                        {this.props.value}
                    </Text>
                </View>
            </View>
        );
    }
}
