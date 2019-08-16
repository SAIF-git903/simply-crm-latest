import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './header';
import Lister from './lister';

export default class RecordLister extends Component {
    render() {
        return (
            <View style={styles.backgroundStyle}>
                <Lister 
                navigation={this.props.navigation}
                moduleName={this.props.moduleName}
                moduleLable={this.props.moduleLable}
                moduleId={this.props.moduleId} 
                />
                <Header 
                moduleName={this.props.moduleName}
                moduleLable={this.props.moduleLable}
                navigation={this.props.navigation}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1,
        backgroundColor: 'red'
    }
});
