/**
 * Vtiger
 * Copyright - Smackcoders technologies private ltd.
 * Developer - Prince J <princej@smackcoders.com> 
 */

import React, { Component } from 'react';
import { Dimensions, Text } from 'react-native';
import { connect } from 'react-redux';
import MainNavigator from './MainNavigator';
import { dimensionChanged } from './actions';

console.disableYellowBox = true;

let defaultRender = Text.prototype.render;
Text.prototype.render = function (...args) {
    let origin = defaultRender.call(this, ...args);

    return React.cloneElement(origin, {
        style: [{ color: 'black', fontFamily: 'Poppins-Regular' }, origin.props.style]
    })
}

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

