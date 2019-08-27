import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { DRAWER_MENU_BACKGROUND_COLOR, 
         DRAWER_BORDER_COLOR } from '../../../variables/themeColors';    

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
        height: 40,
        marginTop: 10,
        borderColor: DRAWER_BORDER_COLOR,
        backgroundColor: DRAWER_MENU_BACKGROUND_COLOR,      
        flexDirection: 'row',       
        borderBottomWidth: 0.5,
    }
});
