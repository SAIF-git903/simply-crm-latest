import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from './header';
import Lister from './lister';

export default class RecordLister extends Component {
    render() {
        return (
            <View style={styles.backgroundStyle}>
                <Header
                    moduleName={this.props.moduleName}
                    moduleLable={this.props.moduleLable}
                    navigation={this.props.navigation}
                />
                <Lister
                    navigation={this.props.navigation}
                    moduleName={this.props.moduleName}
                    moduleLable={this.props.moduleLable}
                    moduleId={this.props.moduleId}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1
    }
});
