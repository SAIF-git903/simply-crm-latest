import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ReferenceHeader from './header';
import ReferenceLister from './lister';

class RecordLister extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.backgroundStyle}>
                <ReferenceHeader
                    navigation={this.props.navigation}
                    moduleName={this.props.route.params.selectedModule}
                    moduleLable={this.props.route.params.moduleLable}
                />
                <ReferenceLister
                    navigation={this.props.navigation}
                    moduleName={this.props.route.params.selectedModule}
                    moduleLable={this.props.route.params.moduleLable}
                    moduleId={this.props.moduleId}
                    uniqueId={this.props.route.params.uniqueId}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1,
        // backgroundColor: 'red'
    }
});
const mapStateToProps = ({ drawer }) => {
    const { selectedButton, moduleId, moduleLable } = drawer;
    return { selectedButton, moduleId, moduleLable };
};

export default connect(mapStateToProps)(RecordLister);
