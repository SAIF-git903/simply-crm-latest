import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';

export default function IconButton({ icon, size, onPress, color, solid }) {
    return (
        <TouchableOpacity
            style={styles.wrapper}
            onPress={onPress}
        >
            <Icon
                solid={solid}
                name={icon}
                color={color || '#92ADD1'}
                size={size}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 54,
        width: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -20
    }
});