import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionBox from './section/sectionBox';
import { fontStyles } from '../../styles/common';

export default function FormSection({ children, title }) {
    return (
        <View style={styles.wrapper}>
            <Text style={{ ...fontStyles.sectionTitle, paddingLeft: 20, paddingBottom: 10 }}>
                {title}
            </Text>

            <SectionBox>
                {children}
            </SectionBox>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 10
    }
})