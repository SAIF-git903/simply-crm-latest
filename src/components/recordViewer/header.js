import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';

import { commonStyles, fontStyles } from '../../styles/common';
import {
    HEADER_IMAGE_COLOR,
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
                    <Icon
                        name='angle-left'
                        size={28}
                        color='white'
                    />
                </TouchableOpacity>
            );
        }
    }

    render() {
        return (
            <View style={commonStyles.headerBackground}>
                <SafeAreaView
                    forceInset={{ top: 'always' }}
                >
                    <View style={commonStyles.headerContentStyle}>
                        <View style={{ width: 40 }}>
                            {
                                this.renderBackButton()
                            }
                        </View>
                        <View style={{ flex: 1, marginRight: 40 }} >
                            <Text
                                style={fontStyles.navbarTitle}
                                pointerEvents={'none'}
                            >
                                Record Details
                    </Text>
                        </View>
                    </View>
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

