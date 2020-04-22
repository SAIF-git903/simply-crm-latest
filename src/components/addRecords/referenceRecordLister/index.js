import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Header from './header';
import Lister from './lister';

class RecordLister extends Component {
    static navigationOptions = {
        header: null
    }
    render() {
        const { state } = this.props.navigation;
        return (
            <View style={styles.backgroundStyle}>
                <Lister
                    navigation={this.props.navigation}
                    moduleName={state.params.selectedModule}
                    moduleLable={this.props.moduleLable}
                    moduleId={this.props.moduleId}
                    uniqueId={state.params.uniqueId}
                />
                <Header
                    moduleName={state.params.selectedModule}
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
        // backgroundColor: 'red'
    }
});
const mapStateToProps = ({ drawer }) => {
    const { selectedButton, moduleId, moduleLable } = drawer;
    return { selectedButton, moduleId, moduleLable };
};

export default connect(mapStateToProps)(RecordLister);
