import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
    DRAWER_MENU_BACKGROUND_COLOR,
    DRAWER_BORDER_COLOR
} from '../../../variables/themeColors';

export default class Menu extends Component {
    render() {
        return (
            <View style={styles.menuStyle}>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menuStyle: {
        //flex: 1,
        width: '100%',
        height: 50,
        marginTop: (Platform.OS === 'android') ? 10 : 0,
        borderBottomWidth: 0.5,
        borderColor: DRAWER_BORDER_COLOR,
        backgroundColor: DRAWER_MENU_BACKGROUND_COLOR,
        flexDirection: 'row',
    }
});
