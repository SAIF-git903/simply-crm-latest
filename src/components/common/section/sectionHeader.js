import React, { Component } from 'react';
import { View, Image, Text, Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR, DRAWER_SECTION_HEADER_IMAGE_COLOR,
    DRAWER_SECTION_HEADER_BACKGROUND_COLOR, 
    DRAWER_SECTION_BORDER_COLOR } from '../../../variables/themeColors';

export default class SectionHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    componentWillMount() {
        this.init();
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.init();
    }


    onHeaderPress() {
        if (this.state.selected) {
            this.props.closeSection();
            this.setState({ selected: false });
        } else {
            this.props.openSection();
            this.setState({ selected: true });
        }
    }

    init() {
        if (this.props.selected) {
            this.setState({ selected: true });
        } else {
            this.setState({ selected: false });
        }
    }

    render() {
        const arrowAnimation = { transform: [{ rotate: this.props.arrowDegree.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        }) }] };

        return (
            <TouchableWithoutFeedback onPress={this.onHeaderPress.bind(this)}>
                <View style={[styles.headerBackground, { backgroundColor: this.props.backgroundColor }]}>
                    { (this.props.headerImage) ?
                        <Image 
                        source={{ uri: this.props.imageName }}
                        style={(this.state.selected) ? 
                        [styles.imageStyleSelected, { tintColor: this.props.imageSelectedColor }] : 
                        [styles.imageStyle, { tintColor: this.props.imageColor }]}
                        /> :
                        undefined 
                    }
                    <Text style={{ color: this.props.textColor }}>{this.props.name}</Text>
                    <Animated.View style={[styles.arrowAnimatedViewStyle, arrowAnimation]}>
                        <Image 
                            source={{ uri: 'uparrow' }}
                            style={(this.state.selected) ? 
                            [styles.arrowImageStyleSelected, { tintColor: this.props.imageSelectedColor }] : 
                            [styles.arrowImageStyle, { tintColor: this.props.imageColor }]}
                        />
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    headerBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5,
        paddingLeft: 5,
        borderColor: DRAWER_SECTION_BORDER_COLOR,
        borderTopWidth: 1,
        marginTop: 5,
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        height: 40,
    },
    imageStyle: {
        height: 30,
        width: 30,
    },
    imageStyleSelected: {
        height: 30,
        width: 30,
    },
    arrowImageStyle: {
        flex: 1,
    },
    arrowImageStyleSelected: {
        flex: 1,
    },
    arrowAnimatedViewStyle: {
        height: 30,
        width: 30
    }
});
