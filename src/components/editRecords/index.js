import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Header from './header';
import Viewer from './viewer';
import { saveEditRecordHelper, } from '../../helper';


class AddRecords extends Component {
    static navigationOptions = {
        header: null
    }

    callViewer(headerInstance) {
        //console.log('call viewer');
        headerInstance.setState({ loading: true });
        saveEditRecordHelper(this.viewer, headerInstance, this.props.dispatch);
    }

    render() {
        return (
            <View style={styles.backgroundStyle}>

                <Viewer
                    navigation={this.props.navigation}
                    moduleName={this.props.selectedButton}
                    moduleId={this.props.moduleId}
                    moduleLable={this.props.moduleLable}
                    onRef={ref => (this.viewer = ref)}
                />

                <Header
                    navigation={this.props.navigation}
                    moduleName={this.props.selectedButton}
                    moduleId={this.props.moduleId}
                    moduleLable={this.props.moduleLable}
                    callViewer={this.callViewer.bind(this)}
                />


            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1,
    }
});

const mapStateToProps = ({ drawer }) => {
    const { selectedButton, moduleId, moduleLable } = drawer;
    return { selectedButton, moduleId, moduleLable };
};

export default connect(mapStateToProps)(AddRecords);
