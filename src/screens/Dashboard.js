import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UpdateWidget from '../components/dashboardUpdates';
import Header from '../components/common/Header';
import { getEnabledModules } from '../ducks/comments';
import { useDispatch } from 'react-redux';


export default function Dashboard() {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    dispatch(getEnabledModules())

    return (
        <View style={styles.backgroundStyle}>
            <Header
                title={'Home'}
            />
            <View style={styles.recordListerBackground}>
                <UpdateWidget navigation={navigation} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1,
        backgroundColor: '#f2f3f8'
    },
    recordListerBackground: {
        flex: 1,
    },
});