import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, Image, Linking, Text, Platform,
    StyleSheet, Animated
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';


class SplashComponent extends Component {
    UNSAFE_componentWillMount() {
        this.animatedValue = new Animated.Value(0.1);
        this.imageScale = new Animated.Value(1.3);
    }

    componentDidMount() {
        Animated.spring(this.animatedValue, {
            toValue: 1,
            friction: 3,
            tension: 30,
            useNativeDriver: true
        }).start();
        Animated.timing(this.imageScale, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true
        }).start();
    }

    renderChildren() {
        // if (Platform.OS === 'ios') {
        //     return (
        //         // <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoidingViewStyle}>
        //             this.props.children
        //         // </KeyboardAvoidingView>
        //     );
        // }
        return (
            <View style={styles.keyboardAvoidingViewStyle}>
                {this.props.children}
            </View>
        );
    }

    renderSplashPortrait() {
        const animatedStyle = {
            transform: [{ scale: this.animatedValue }]
        };

        const imageScaleStyle = {
            transform: [{ scale: this.imageScale }]
        };

        return (
            <View style={styles.backgroundStyle}>
                <SafeAreaView
                    forceInset={{ top: 'always' }}
                    style={{ flex: 1 }}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../../assets/images/logo_new_white.png')} resizeMode={'contain'} style={styles.logoStyle} />
                    </View>

                    {this.renderChildren()}
                </SafeAreaView>
            </View>
        );
    }

    renderSplashLandscape() {
        const animatedStyle = {
            transform: [{ scale: this.animatedValue }]
        };

        const imageScaleStyle = {
            transform: [{ scale: this.imageScale }]
        };

        return (
            <View style={styles.landscapeBackgroundStyle}>
                {/* <Animated.Image 
                style={[{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%',
                        }, imageScaleStyle]} 
                source={{ uri: 'loginbackground' }} 
                /> */}
                <View
                    style={{
                        flex: 0.9,
                        //backgroundColor: 'rgba(100, 100, 100, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        {/* <Animated.View style={animatedStyle}>
                        <Text style={styles.appNameStyle}>Simply CRM</Text>
                    </Animated.View> */}
                        <Image source={require('../../assets/images/logo_new_white.png')} resizeMode={'contain'} style={styles.logoStyle} />
                    </View>
                </View>
                {/* <View style={{ flex: 1.1, justifyContent: 'center', backgroundColor: 'rgba(100, 100, 100, 0.5)', }}>
                    {this.renderChildren()}
                    <TouchableOpacity onPress={this.onSmackcodersPress.bind(this)}>
                        <View 
                        style={{ 
                            flexDirection: 'row',
                            justifyContent: 'center', 
                            marginTop: 30 }}
                        >
                                <Text style={{ color: 'white' }}>Powered by</Text>
                                <Image 
                                source={{ uri: 'smackcoders' }}
                                style={{ width: 17, height: 17 }}
                                resizeMode={'contain'} 
                                />
                                <Text style={{ color: 'white' }}> Smackcoders, Inc.</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}
            </View>
        );
    }

    render() {
        return this.renderSplashPortrait();
        // return this.renderSplashLandscape();
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        backgroundColor: '#0085DE'
    },
    landscapeBackgroundStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    errorTextStyle: {
        color: 'white',
        textAlign: 'center',
        flex: 1
    },
    logoStyle: {
        width: 170,
        height: 104,
        marginTop: 40
    },
    cardStyle: {
        backgroundColor: 'rgba(100, 100, 100, 0.5)',
        flexDirection: 'column',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
    },
    keyboardAvoidingViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appNameStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
    }
});

const mapStateToProp = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProp)(SplashComponent);
