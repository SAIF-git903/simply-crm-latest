import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
    View, StatusBar, ScrollView, StyleSheet, ActivityIndicator,
    TouchableOpacity, Text, Alert, Image, SafeAreaView
} from 'react-native';
import { renderDrawerView, removeAllDatabase } from '../helper';
import {
    DRAWER_BACKGROUND, HEADER_COLOR, DRAWER_INNER_BACKGROUND,
    DRAWER_SECTION_HEADER_TEXT_COLOR, DRAWER_SECTION_HEADER_IMAGE_COLOR
} from '../variables/themeColors';
import { fontStyles } from '../styles/common';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';


class HomeDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            drawerViews: [],
            drawerLoadComplete: false,
            signOut: []
        };
    }

    componentWillMount() {
        if (!this.state.drawerLoadComplete) {
            this.setState({ loading: true });
            renderDrawerView(this.props.loginDetails, this);
        }
    }

    onSignOutPress() {
        Alert.alert('Logout !', 'Are you sure all your offline data will be deleted?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Ok', onPress: this.logout.bind(this) },
            ],
            { cancelable: true }
        );
    }

    signOut() {
        return (
            <TouchableOpacity style={styles.singOutWrapper} onPress={this.onSignOutPress.bind(this)} >
                <View style={styles.signOut}>
                    <View style={styles.imageStyle}>
                        <Icon
                            name='power-off'
                            size={20}
                            color={DRAWER_SECTION_HEADER_IMAGE_COLOR}
                        />
                    </View>
                    <Text style={[styles.textStyle, fontStyles.drawerMenuButtonText]}>Sign Out</Text>
                </View>
            </ TouchableOpacity>
        );
    }

    logout() {
        removeAllDatabase(this.navigateToSplash.bind(this));
    }

    navigateToSplash() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'SplashScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: DRAWER_BACKGROUND
            }} >
                <StatusBar
                    backgroundColor={HEADER_COLOR}
                    barStyle="light-content"
                />

                {/* header section */}
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'logo_new_white' }}
                        resizeMode={'contain'}
                        style={{ flex: 1, width: '50%', height: '100%' }}
                    />
                </View>
                {
                    (this.state.loading) ?
                        <ActivityIndicator /> :
                        <ScrollView style={{ backgroundColor: DRAWER_BACKGROUND }}>
                            {this.state.drawerViews}
                            <View style={{ width: '100%', minHeight: '100%', backgroundColor: DRAWER_BACKGROUND }} />

                        </ScrollView>
                }
                {
                    this.signOut()
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    singOutWrapper: {
        height: 40,
        width: '100%',
        backgroundColor: DRAWER_INNER_BACKGROUND
    },
    signOut: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',

    },
    wrapper: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#d3d3d3',
        marginBottom: 10
    },
    slide: {
        height: 50
    },
    textStyle: {
        fontSize: 16,
        color: DRAWER_SECTION_HEADER_TEXT_COLOR,
        paddingLeft: 5
    },
    imageStyle: {
        height: 20,
        width: 20,
        marginRight: 10,
        marginLeft: 15
    },
    header: {
        minHeight: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: .5,
        borderBottomColor: '#868d98'
    }
});

const mapStateToProps = ({ auth }) => {
    const { loginDetails } = auth;
    return { loginDetails };
};

export default connect(mapStateToProps)(HomeDrawer);
