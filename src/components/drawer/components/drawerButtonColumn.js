import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class DrawerButtonColumn extends Component {
    render() {
       return (
            <View style={styles.drawerButtonColumn}>
                {this.props.children}
            </View>
       );
    }
}

const styles = StyleSheet.create({
    drawerButtonColumn: {
       flexDirection: 'row',
       justifyContent: 'space-around',
       marginTop: 5,
       marginBottom: 5,
       flex: 1
    },
});
