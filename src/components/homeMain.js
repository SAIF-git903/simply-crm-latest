import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import RecordLister from './recordLister';
import { HOME, PROFILE, SETTINGS } from '../variables/constants';
import Dashboard from './Dashboard';

class HomeMain extends Component {
    componentDidMount() {
        this.init();
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.init();
    }

    init() {
        this.props.navigation.navigate('DrawerClose');
    }

    renderHomeMain() {
        switch (this.props.selectedButton) {
            case HOME:
                return (<Dashboard navigation={this.props.navigation} />);
            case PROFILE:
                return (<View />);
            case SETTINGS:
                return (<View />);
            default:
                return (<RecordLister
                    navigation={this.props.navigation}
                    moduleName={this.props.selectedButton}
                    moduleId={this.props.moduleId}
                    moduleLable={this.props.moduleLable}
                />
                );
        }
    }

    render() {
        return this.renderHomeMain();
    }
}

const mapStateToProps = (state) => {
    const { selectedButton, moduleId, moduleLable } = state.drawer;
    return { selectedButton, moduleId, moduleLable };
};

export default connect(mapStateToProps)(HomeMain);

