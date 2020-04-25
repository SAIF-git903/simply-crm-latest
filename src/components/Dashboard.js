import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import Todo from './todo';
import UpdateWidget from './dashboardUpdates';
import DashboardHeader from './DashboardHeader';

class Dashboard extends Component {

    render() {
        return (
            <View style={styles.backgroundStyle}>
                <DashboardHeader
                    moduleLable={'Home'}
                    navigation={this.props.navigation}
                />
                <View style={styles.recordListerBackground}>
                    <UpdateWidget navigation={this.props.navigation} />
                </View>
            </View>
        );
    }

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

const mapStateToProp = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProp)(Dashboard);
