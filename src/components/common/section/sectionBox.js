import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function SectionBox({ children }) {
    return (<View style={styles.wrapper
    }>
        {children}
    </View>);
}

const styles = StyleSheet.create({
    wrapper: {
        margin: 10,
        marginTop: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        borderRadius: 3,
        backgroundColor: 'white',
        elevation: 2
    }
});