import React, { Component } from 'react';
import { Animated } from 'react-native';

export default class SectionContent extends Component {
    render() {
        const contentAnimation = 
        { transform: [{ scale: this.props.animatedScale }], height: this.props.animatedHeight };
        return (
            <Animated.View style={[contentAnimation]}>
                {this.props.content}
            </Animated.View>
        );
    }
}
