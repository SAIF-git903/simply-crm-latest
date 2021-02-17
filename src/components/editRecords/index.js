import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Header from '../addRecords/header';
import Viewer from './viewer';
import { saveEditRecordHelper, } from '../../helper';
import {CALENDAR} from "../../variables/constants";

class EditRecord extends Component {
    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        //TODO fixed unserialized values ??
        this.props.navigation.setOptions({
            id: this.props.route.params.id,
            lister: this.props.route.params.lister,
            isDashboard: this.props.route.params.isDashboard
        });
    }

    callViewer(headerInstance) {
        headerInstance.setState({ loading: true });
        saveEditRecordHelper(this.viewer, headerInstance, this.props.dispatch, this.props.route.params.lister);
    }

    render() {
        let moduleName;
        if (this.props.route.params.isDashboard){
            moduleName = this.props.route.params.lister.props.moduleName;
        } else {
            moduleName = this.props.selectedButton;
        }
        if (moduleName === CALENDAR) {
            let ids = this.props.route.params.id.split('x');
            if (parseInt(ids[0], 10) === 18) {
                moduleName = 'Events';
            }
            //TODO editRecord dont work for Calendar (Task)
            //else if (parseInt(ids[0], 10) === 9) {
            //    moduleName = 'Task';
            //}
        }
        return (
            <View style={styles.backgroundStyle}>
                <Header
                    navigation={this.props.navigation}
                    moduleName={moduleName}
                    moduleId={this.props.moduleId}
                    moduleLable={this.props.moduleLable}
                    callViewer={this.callViewer.bind(this)}
                    isEdit={true}
                />
                <View style={{ width: '100%', height: '100%', paddingBottom: 100 }}>
                    <Viewer
                        recordId={this.props.route.params.id}
                        navigation={this.props.navigation}
                        moduleName={moduleName}
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

export default connect(mapStateToProps)(EditRecord);
