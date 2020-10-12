import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Header from './header';
import Viewer from './viewer';

class RecordViewer extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.backgroundStyle}>
                <Header
                    navigation={this.props.navigation}
                    showBackButton
                    moduleLable={this.props.moduleLable}
                />
                <Viewer
                    navigation={this.props.navigation}
                    moduleName={this.props.moduleName}
                    recordId={this.props.recordId}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1,
        backgroundColor: 'white'
    }
});

const mapStateToProps = ({ recordViewer }) => {
    const { navigation, moduleName, showBackButton, moduleLable, recordId } = recordViewer;
    return { navigation, moduleName, showBackButton, moduleLable, recordId };
};

export default connect(mapStateToProps)(RecordViewer);
