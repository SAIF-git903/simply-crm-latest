/**
 * Vtiger
 * Copyright - Smackcoders technologies private ltd.
 * Developer - Prince J <princej@smackcoders.com> 
 */

import React, { Component } from 'react';
import { Dimensions, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import MainNavigator from './MainNavigator';
import { dimensionChanged } from './actions';

console.disableYellowBox = true;
AsyncStorage.clear();
class App extends Component {
    componentWillMount() {
        Dimensions.addEventListener('change', this.onDimensionChange.bind(this));
        this.onDimensionChange();
    }

    onDimensionChange() {
        const { width, height } = Dimensions.get('window');
        if (width > height) {
            this.props.dimensionChanged(false, width, height);
        } else {
            this.props.dimensionChanged(true, width, height);
        }
    }
    render() {
        return (
            <MainNavigator />
        );
    }
}

export default connect(undefined, { dimensionChanged })(App);

