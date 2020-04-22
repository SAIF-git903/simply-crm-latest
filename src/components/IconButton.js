import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faLock, faEnvelope, faTimesCircle, faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function IconButton({ icon, size, onPress, color }) {
    return (
        <TouchableOpacity
            style={styles.wrapper}
            onPress={onPress}
        >
            <FontAwesomeIcon
                icon={icon}
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