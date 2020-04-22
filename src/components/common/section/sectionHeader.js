import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { faFolder } from '@fortawesome/free-regular-svg-icons';

import { DRAWER_BORDER_COLOR } from '../../../variables/themeColors';
import { TOOLS, SALES } from '../../../variables/constants';
import { fontStyles } from '../../../styles/common';

export default class SectionHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    componentDidMount() {
        this.props.openSection();
        this.setState({ selected: true });
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
    }

    onToggleSection() {
        this.setState({ selected: !this.state.selected }, () => {
            if (this.state.selected) {
                this.props.openSection();
            } else {
                this.props.closeSection();
            }

        })
    }

    getIcon() {
        return faFolder;
    }

    render() {
        let arrowIcon = this.state.selected ? faAngleRight : faAngleDown;
        return (
            <TouchableWithoutFeedback onPress={this.onToggleSection.bind(this)}>
                <View style={[styles.headerBackground,
                {
                    backgroundColor: this.props.backgroundColor,
                    borderBottomWidth: this.props.hideBorder ? 0 : .5
                }, this.props.style, (this.props.drawerMenu ? styles.drawerMenuStyle : null)]}>
                    {(this.props.headerImage) ?
                        <View
                            style={{ width: 40 }}
                        >
                            <FontAwesomeIcon
                                icon={this.getIcon()}
                                size={20}
                                color={this.props.imageColor}
                                style={{
                                    marginRight: 10,
                                    marginLeft: 8
                                }}
                            />
                        </View>
                        :
                        undefined
                    }
                    <Text style={[(this.props.drawerMenu ? fontStyles.drawerMenuButtonText : fontStyles.sectionTitle), { paddingLeft: this.props.drawerMenu ? 0 : 5 }]}>{this.props.name}</Text>

                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <TouchableWithoutFeedback onPress={this.onToggleSection.bind(this)}>
                            <View style={{ width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 6 }}>
                                <FontAwesomeIcon
                                    icon={arrowIcon}
                                    color={'#707070'}
                                />
                            </View>

                        </TouchableWithoutFeedback>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    drawerMenuStyle: {
        borderBottomWidth: 0.5,
        borderColor: '#868d98',
    },
    headerBackground: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: DRAWER_BORDER_COLOR,
        padding: 5
    },
    imageStyle: {
        height: 20,
        width: 20,
        marginRight: 10,
        marginLeft: 5,

    },
    imageStyleSelected: {
        height: 25,
        width: 25,
    },
    arrowImageStyle: {
        width: 15,
        height: 15,

    },
    arrowImageStyleSelected: {
        width: 15,
        height: 15

    },
    arrowAnimatedViewStyle: {
        flex: 1,
    }
});
