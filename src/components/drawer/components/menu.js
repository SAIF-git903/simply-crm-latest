import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { DRAWER_MENU_BORDER_COLOR, 
    DRAWER_MENU_BACKGROUND_COLOR } from '../../../variables/themeColors';    

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
        width: '100%',
        height: 40,
        marginTop: (Platform.OS === 'ios') ? 55 : 45,
        borderColor: DRAWER_MENU_BORDER_COLOR,
        backgroundColor: DRAWER_MENU_BACKGROUND_COLOR,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
    }
});
