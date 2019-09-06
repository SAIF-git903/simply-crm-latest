import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Image, ActivityIndicator, Text, Animated, TouchableWithoutFeedback, 
    StyleSheet, Alert } from 'react-native';
import { loginUser } from '../actions/';

class LoginForm extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            url: '',
            username: '',
            password: '',
        };
        this.handlePressIn = this.handlePressIn.bind(this);
        this.handlePressOut = this.handlePressOut.bind(this);
    }

    componentWillMount() {
        this.animatedValue = new Animated.Value(0);
        this.buttonAnimatedValue = new Animated.Value(1);
    }

    componentDidMount() {
        Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: 1000,
        }).start();
    }
    
    onUrlChanged(text) {
        this.setState({ ...this.state, url: text });
    }

    onUsernameChanged(text) {
        this.setState({ ...this.state, username: text });
    }

    onPasswordChanged(text) {
        this.setState({ ...this.state, password: text });
    }

    onButtonPress() {
        const { username, password, url } = this.state;
        const https = url.substring(0, 6);
        const http = url.substring(0, 5);

        // if (https !== 'https:' && http !== 'http:') {
        //     Alert.alert('Check your url', 'Url should start with http:// or https://.',
        //     [
        //       { text: 'Ok', onPress: () => {} },
        //     ],
        //     { cancelable: true }
        //   );
        // } else {
            this.props.loginUser(username, password, url, this.props.navigation, this);
        // }
    }

    handlePressIn() {
        Animated.spring(this.buttonAnimatedValue, {
            toValue: 0.7
        }).start();
    }

    handlePressOut() {
        Animated.spring(this.buttonAnimatedValue, {
            toValue: 1
        }).start();
        this.onButtonPress();
    }

    renderLoading() {
        return (
            <View>
                <ActivityIndicator color={'white'} />
            </View>
        );
    }

    renderLoginButton() {
        return (
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }} >Login</Text>
        );
    }

    render() {
        const animatedStyle = { opacity: this.animatedValue };
        const buttonAnimatedStyle = { transform: [{ scale: this.buttonAnimatedValue }] };
        return (
            <View style={{ padding: 5, height: 200, width: '90%', borderRadius: 5 }}>
                {/* <Animated.View 
                style={[styles.formInsideStyle, animatedStyle]}
                >                 */}
                    <View style={styles.inputformStyle}>
                        <View style={styles.inputformImageHolderStyle}>
                            <Image source={{ uri: 'url' }} style={styles.inputformImageStyle} />
                        </View>
                        {/* <View style={styles.verticalLine} /> */}
                        <TextInput 
                        clearButtonMode='always'
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        style={styles.textInputStyle} 
                        placeholder='Enter URL'
                        placeholderTextColor='#ddd'
                        onSubmitEditing={() => { 
                            this.refs.username.focus(); 
                        }}
                        autoCapitalize='none'
                        autoCorrect={false}
                        returnKeyType='next'
                        value={this.state.url}
                        onChangeText={this.onUrlChanged.bind(this)}
                        />
                    </View>
                    {/* <View style={styles.horizontalLine} /> */}
                    <View style={styles.inputformStyle}>
                        <View style={styles.inputformImageHolderStyle}>
                            <Image
                            source={{ uri: 'username' }}
                            style={styles.inputformImageStyle} 
                            />
                        </View>
                        {/* <View style={styles.verticalLine} /> */}
                        <TextInput 
                        clearButtonMode='always'
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        style={styles.textInputStyle} 
                        placeholder='Enter Username'
                        placeholderTextColor='#ddd'
                        ref='username'
                        onSubmitEditing={() => { 
                            this.refs.password.focus(); 
                        }} 
                        autoCapitalize='none'
                        returnKeyType='next'
                        value={this.state.username}
                        onChangeText={this.onUsernameChanged.bind(this)}
                        />
                    </View>
                    {/* <View style={styles.horizontalLine} /> */}
                    <View style={styles.inputformStyle}>
                        <View style={styles.inputformImageHolderStyle}>
                            <Image 
                            source={{ uri: 'password' }} 
                            style={styles.inputformImageStyle} 
                            />
                        </View>
                        {/* <View style={styles.verticalLine} /> */}
                        <TextInput 
                        clearButtonMode='always' 
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={styles.textInputStyle}
                        ref='password' 
                        secureTextEntry 
                        placeholder='Enter Password'
                        placeholderTextColor='#ddd'
                        autoCapitalize='none'
                        returnKeyType='done' 
                        value={this.state.password}
                        onChangeText={this.onPasswordChanged.bind(this)}
                        />
                    </View>
                    {/* <View style={styles.horizontalLine} /> */}
                    <View style={styles.buttonHolderStyle}>
                        <TouchableWithoutFeedback
                        onPressIn={this.handlePressIn} 
                        onPressOut={this.handlePressOut}
                        >
                            <Animated.View style={[styles.buttonStyle, buttonAnimatedStyle]}>
                                {(this.state.loading) ? this.renderLoading() : this.renderLoginButton()}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                {/* </Animated.View> */}
            </View>
        );
   }
}

const styles = StyleSheet.create({
    formInsideStyle: {
        // borderWidth: 1,
        // // backgroundColor: 'white',
        // borderColor: '#d3d3d3',
    },
    inputformStyle: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center', 
        marginTop: 7,
        backgroundColor: 'white',
        borderRadius: 5
    },
    inputformImageHolderStyle: {
        height: '100%',
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputformImageStyle: {
        height: 23,
        width: 23,
        tintColor: '#ddd',
        marginLeft: 8
    },
    horizontalLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#d3d3d3'
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#d3d3d3'
    },
    textInputStyle: {
        height: '100%',
        flex: 1,
        fontSize: 14,
        paddingLeft: 5,
        backgroundColor: 'white',
        margin: 10
    },
    buttonHolderStyle: {
        marginTop: 20,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    buttonStyle: {
        width: 100,
        height: '80%',
        borderRadius: 3,
        // backgroundColor: '#1863ae',
        backgroundColor: '#339DE5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
        
    },
    buttonTextStyle: {
        color: 'white',
        fontWeight: 'bold'
    }
});
export default connect(undefined, { loginUser })(LoginForm);
