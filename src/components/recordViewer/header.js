import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';

import { commonStyles, fontStyles } from '../../styles/common';
import {
    HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
    HEADER_IMAGE_SELECTED_COLOR
} from '../../variables/themeColors';

class Header extends Component {
    componentDidMount() {
        //console.log('Mounting header');
    }

    onBackButtonPress() {
        //console.log(this.props.navigation);
        //console.log(this.props.navigation.goBack);
        this.props.navigation.goBack(null);
    }

    renderBackButton() {
        if (this.props.width > 600) {
            //This is tablet
            if (this.props.isPortrait) {
                return (
                    <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                        <Image
                            source={{ uri: 'leftarrow' }}
                            style={{
                                width: 30,
                                resizeMode: 'contain',
                                tintColor: HEADER_IMAGE_COLOR,
                                height: 40
                            }}
                        />
                    </TouchableOpacity>
                );
            }
            return undefined;
        } else {
            //This is phone
            return (
                <TouchableOpacity
                    onPress={this.onBackButtonPress.bind(this)}
                >
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        color={'white'}
                        size={28}
                    />
                </TouchableOpacity>
            );
        }
    }

    render() {
        return (
            <View style={commonStyles.headerBackground}>
                <SafeAreaView style={commonStyles.headerContentStyle}>
                    {
                        this.renderBackButton()
                    }
                    <Text
                        style={[fontStyles.navbarTitle, { marginLeft: -30, backgroundColor: 'transparent' }]}
                        pointerEvents={'none'}
                    >
                        Record Details
                    </Text>
                </SafeAreaView>
            </View>
        );
    }
}

const mapStateToProp = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProp)(Header);

