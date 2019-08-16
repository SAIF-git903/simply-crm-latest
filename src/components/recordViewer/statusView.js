import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_BACKGROUND_COLOR } from '../../variables/themeColors';

export default class StatusView extends Component {
    render() {
        return (
            <View style={styles.statusBackground}>
                <Text numberOfLines={1} style={{ color: this.props.textColor }}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    statusBackground: {
        width: '100%',
        height: 20,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        position: 'absolute',
        shadowOffset: { width: 5, height: 2 },
        elevation: 3,
        alignItems: 'center',
        backgroundColor: STATUS_BACKGROUND_COLOR
    }
});
