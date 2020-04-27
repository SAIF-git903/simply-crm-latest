import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { commonStyles, fontStyles } from './../styles/common';
import {
    HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
    HEADER_IMAGE_SELECTED_COLOR
} from './../variables/themeColors';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';

class DashboardHeader extends Component {
    componentDidMount() {
        //console.log('Mounting header');
    }

    onMenuButtonPress() {
        const { state } = this.props.navigation;
        if (state.routeName === 'DrawerOpen') {
            this.props.navigation.navigate('DrawerClose');
        } else {
            this.props.navigation.navigate('DrawerOpen');
        }
    }

    renderMenuButton() {
        if (this.props.width > 600) {
            //This is tablet
            return undefined;
        } else {
            //This is phone
            return (
                <TouchableOpacity onPress={this.onMenuButtonPress.bind(this)}>
                    <Icon
                        name='bars'
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
                <View style={commonStyles.headerContentStyle}>
                    {
                        this.renderMenuButton()
                    }
                    <View style={{ flex: 1, marginRight: 30 }}>
                        <Text
                            style={fontStyles.navbarTitle}
                        >
                            {this.props.moduleLable}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerTextStyle: {
        color: HEADER_TEXT_COLOR,
        flex: 1,
        fontSize: 15,
        textAlign: 'center'
    }
});

const mapStateToProp = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProp)(DashboardHeader);
