import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../components/common/Header';
import Viewer from '../components/recordViewer/viewer';

export default function RecordDetails() {

    const recordViewerState = useSelector(state => state.recordViewer);
    const { navigation, moduleName, recordId } = recordViewerState;


    return (
        <View style={styles.backgroundStyle} >
            <Header
                title={'Record Details'}
                showBackButton
            />
            <View style={{ width: '100%', height: '100%', paddingBottom: 100 }}>
                <Viewer
                    navigation={navigation}
                    moduleName={moduleName}
                    recordId={recordId}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1,
        backgroundColor: 'white'
    }
});
