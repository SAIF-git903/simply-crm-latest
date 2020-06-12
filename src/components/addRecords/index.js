import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Header from './header';
import Viewer from './viewer';
import { saveRecordHelper, copyAddress } from '../../helper';


class AddRecords extends Component {
    static navigationOptions = {
        header: null
    }

    callViewer(headerInstance) {
        //console.log('call viewer');
        headerInstance.setState({ loading: true });
        saveRecordHelper(this.viewer, headerInstance, this.props.dispatch, this.props.route.params.lister);
    }

    showCopyOptions(headerInstance) {
        copyAddress(this.viewer, headerInstance);
    }

    render() {
        console.log(this.props)
        return (
            <View style={styles.backgroundStyle}>
                <Header
                    navigation={this.props.navigation}
                    moduleName={this.props.selectedButton}
                    moduleId={this.props.moduleId}
                    moduleLable={this.props.moduleLable}
                    callViewer={this.callViewer.bind(this)}
                    showCopyOptions={this.showCopyOptions.bind(this)}
                />
                <View style={{ width: '100%', height: '100%', paddingBottom: 100 }}>
                    <Viewer
                        navigation={this.props.navigation}
                        moduleName={this.props.selectedButton}
                        moduleId={this.props.moduleId}
                        moduleLable={this.props.moduleLable}
                        onRef={ref => (this.viewer = ref)}
                    />
                </View>
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
