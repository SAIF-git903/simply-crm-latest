import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { View, Image, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { commonStyles } from '../../styles/common';
import { viewSearchAction, updateSearchModule } from '../../actions';
import {
    HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
    HEADER_IMAGE_SELECTED_COLOR
} from '../../variables/themeColors';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';

class Header extends Component {
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

    onSearchButtonPress() {
        this.props.navigation.navigate('AddRecordScreen');
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
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTextStyle}>{this.props.moduleLable}</Text>
                    </View>
                    <TouchableOpacity onPress={this.onSearchButtonPress.bind(this)}>
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,.2)',
                                width: 27,
                                height: 27,
                                borderRadius: 3,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Icon
                                name='plus'
                                size={18}
                                color='white'
                            />
                        </View>
                    </TouchableOpacity>
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

const mapStateToProp = ({ event, mgr }) => {
    const { isPortrait, width, height } = event;

    return { isPortrait, width, height };
};

export default connect(mapStateToProp, { viewSearchAction, updateSearchModule })(Header);
