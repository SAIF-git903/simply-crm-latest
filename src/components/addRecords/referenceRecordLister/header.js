import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';


import { commonStyles, fontStyles } from '../../../styles/common';
import { viewSearchAction, updateSearchModule } from '../../../actions';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';

class Header extends Component {
    componentDidMount() {
        //console.log('Mounting header');
    }

    onBackButtonPress() {
        //console.log(this.props.navigation);
        //console.log(this.props.navigation.goBack);
        this.props.navigation.goBack(null);
    }
    onSearchButtonPress() {
        if (this.props.width < 600) {
            this.props.updateSearchModule(this.props.moduleName);
            this.props.navigation.navigate('SearchScreen');
        } else if (!this.props.isPortrait) {
            this.props.viewSearchAction(this.props.moduleName);
        } else {
            this.props.updateSearchModule(this.props.moduleName);
            this.props.navigation.navigate('SearchScreen');
        }
    }

    renderBackButton() {
        if (this.props.width > 600) {
            //This is tablet
            if (this.props.isPortrait) {
                return (
                    <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                        <Icon
                            name='angle-left'
                            size={28}
                            color='white'
                        />
                    </TouchableOpacity>
                );
            }
            return undefined;
        } else {
            //This is phone
            return (
                <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
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
                    forceInset={{ top: 'always', bottom: 'never' }}
                >
                    <View style={commonStyles.headerContentStyle}>
                        <View style={{ width: 40 }}>
                            {
                                this.renderBackButton()
                            }
                        </View>
                        <View style={{ flex: 1, marginRight: 40 }}>
                            <Text style={fontStyles.navbarTitle}>{this.props.moduleLable}</Text>
                        </View>
                        {/* <TouchableOpacity onPress={this.onSearchButtonPress.bind(this)}>
                        <Image
                            source={{ uri: 'search' }}
                            style={{
                                width: 27,
                                resizeMode: 'contain',
                                tintColor: HEADER_IMAGE_COLOR,
                                height: 27
                            }}
                        />
                    </TouchableOpacity> */}
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

const mapStateToProp = ({ event, mgr }) => {
    const { isPortrait, width, height } = event;

    return { isPortrait, width, height };
};

export default connect(mapStateToProp, { viewSearchAction, updateSearchModule })(Header);
