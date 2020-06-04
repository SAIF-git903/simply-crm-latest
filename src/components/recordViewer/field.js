import React, { Component } from 'react';
import { View, Text, Linking } from 'react-native';
import { fontStyles } from '../../styles/common';

export default class Field extends Component {
    onPressAction() {
        const { uiType, value } = this.props;

        switch (uiType) {
            case '11':
                Linking.openURL(`tel:${value}`);
                break;

            case '13':
                Linking.openURL(`mailto:${value}`)
                break;

            case '17':
                let website = value;

                const isHttp = website.includes('http://')
                if (isHttp) website = website.replace('http://', 'https://');
                const isHttps = website.includes('https://');
                Linking.openURL(`${isHttps ? '' : 'https://'}${website}`)
                break;

            default:
                break;
        }
    }

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
                        onPress={() => this.onPressAction()}
                        style={fontStyles.fieldValue}
                        numberOfLines={2}
                        selectable={true}
                    >
                        {this.props.value}
                    </Text>
                </View>
            </View>
        );
    }
}
