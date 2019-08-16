import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Linking, Text, Platform, 
    StyleSheet, KeyboardAvoidingView, TouchableOpacity, Animated } from 'react-native';

class SplashComponent extends Component {
    componentWillMount() {
        this.animatedValue = new Animated.Value(0.1);
        this.imageScale = new Animated.Value(1.3);
    }

    componentDidMount() {
        Animated.spring(this.animatedValue, {
            toValue: 1,
            friction: 3,
            tension: 30
        }).start();
        Animated.timing(this.imageScale, {
            toValue: 1,
            duration: 4000
        }).start();
    }

    onSmackcodersPress() {
        Linking.openURL('https://www.smackcoders.com').catch(err => console.error('An error occurred', err));        
    }

    renderChildren() {
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoidingViewStyle}>
                    {this.props.children}
                </KeyboardAvoidingView>
            );
        }
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
                <Animated.Image 
                style={[{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%',
                        }, imageScaleStyle]} 
                source={{ uri: 'loginbackground' }} 
                />
                <View 
                style={{ 
                    position: 'absolute',
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'rgba(100, 100, 100, 0.5)' }}
                />
                <View 
                style={{ 
                    flex: 1,
                    backgroundColor: 'rgba(100, 100, 100, 0)',
                    justifyContent: 'center',
                    alignItems: 'center' }} 
                >
                    <View style={{ width: '100%', alignItems: 'center' }}>
                    <Animated.View style={animatedStyle}>
                        <Text style={styles.appNameStyle}> PocketCRM for Vtiger </Text>
                    </Animated.View>
                    <Image source={{ uri: 'vtigerlogo' }} resizeMode={'contain'} style={styles.logoStyle} />
                    </View>
                </View>
                    {this.renderChildren()}
                    <TouchableOpacity onPress={this.onSmackcodersPress.bind(this)}>
                    <View 
                    style={{ 
                        flexDirection: 'row', 
                        backgroundColor: 'rgba(100, 100, 100, 0)',
                        justifyContent: 'center',
                        paddingBottom: 10 }}
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
                 <Animated.Image 
                style={[{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%',
                        }, imageScaleStyle]} 
                source={{ uri: 'loginbackground' }} 
                />
                <View 
                style={{ 
                    flex: 0.9, 
                    backgroundColor: 'rgba(100, 100, 100, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center' }} 
                >
                    <View style={{ width: '100%', alignItems: 'center' }}>
                    <Animated.View style={animatedStyle}>
                        <Text style={styles.appNameStyle}> PocketCRM for Vtiger </Text>
                    </Animated.View>
                    <Image source={{ uri: 'vtigerlogo' }} resizeMode={'contain'} style={styles.logoStyle} />
                    </View>
                </View>
                <View style={{ flex: 1.1, justifyContent: 'center', backgroundColor: 'rgba(100, 100, 100, 0.5)', }}>
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
                </View>
            </View>
        );
    }

    render() {
        if (this.props.isPortrait) {
            return this.renderSplashPortrait();
        }
            return this.renderSplashLandscape();
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1
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
        elevation: 3
    },
    keyboardAvoidingViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appNameStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    }
});

const mapStateToProp = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProp)(SplashComponent);
