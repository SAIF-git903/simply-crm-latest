import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, TextInput, Image, ActivityIndicator, Text, Animated, TouchableWithoutFeedback,
    StyleSheet, Alert, Picker, KeyboardAvoidingView, TouchableOpacity, Platform
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { loginUser } from '../actions/';
import { userUrlHelper, assignUrl } from '../helper';

class LoginForm extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            url: '',
            email: '',
            password: '',
            showUrlList: false,
            urlList: [],
            username: ''
        };
        this.handlePressIn = this.handlePressIn.bind(this);
        this.handlePressOut = this.handlePressOut.bind(this);
    }

    componentWillMount() {
        this.animatedValue = new Animated.Value(0);
        this.buttonAnimatedValue = new Animated.Value(1);
        // userUrlHelper('albert.xhani@outlook.com', '987654321');
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

    onEmailChanged(text) {
        this.setState({ ...this.state, email: text });
    }

    onPasswordChanged(text) {
        this.setState({ ...this.state, password: text });
    }

    onButtonPress() {
        const { email, password, url, username } = this.state;

        console.log(url, this.state.showUrlList);
        if (this.state.showUrlList && url !== '') {
            this.setState({ loading: true });
            assignUrl(url, username, password, this.props.navigation, this, this.state.dispatch);
        } else {
            this.props.loginUser(email, password, '', this.props.navigation, this);
        }
    }

    onForgotPasswordPress() {
        console.log('forgot password clicked');
        const { navigate } = this.props.navigation;
        navigate('ForgotPasswordScreen');
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
                <ActivityIndicator color={'#0069AE'} />
            </View>
        );
    }

    renderLoginButton() {
        return (
            <Text style={styles.loginButtonTextStyle} >LOGIN</Text>
        );
    }

    onUrlSelected(url) {
        const selectedUrlDetails = this.state.urlList.find(x => x.url === url);

        this.setState({
            url: selectedUrlDetails.url,
            username: selectedUrlDetails.username
        });

    }

    render() {
        const animatedStyle = { opacity: this.animatedValue };
        const buttonAnimatedStyle = { transform: [{ scale: this.buttonAnimatedValue }] };

        const options = this.state.urlList;
        const optionsForiOS = [];
        options.map((item) => {
            optionsForiOS.push(item.url);
        });


        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#0085DE' }}>

                { /*Logo*/}
                <View style={styles.logoMainHolder}>
                    <View style={styles.logoSubHolder}>
                        <Image source={{ uri: 'vtigerlogo' }} style={styles.logoStyle} />
                    </View>

                </View>

                { /*Login Input Component*/}
                <View style={{ flex: 1 }} >

                    <KeyboardAvoidingView behavior={'padding'}>
                        {
                            (this.state.showUrlList) ?
                                <View style={styles.inputMainHolder}>
                                    <View style={styles.inputSubHolder}>
                                        <Image source={{ uri: 'url' }} style={styles.inputImageStyle} />

                                        {
                                            (Platform.OS === 'android') ?

                                                <Picker
                                                    style={styles.inputTextStyle}

                                                    mode={'dropdown'}
                                                    selectedValue={this.state.url}
                                                    onValueChange={(itemValue) => {
                                                        this.onUrlSelected(itemValue)
                                                    }}
                                                >
                                                    <Picker.Item label='Please Select Url' value={0} />
                                                    {options.map((item, index) => {
                                                        return (<Picker.Item label={item.url} value={item.url} key={index} color='black' />);
                                                    })}
                                                </Picker>

                                                :


                                                <ModalDropdown
                                                    options={optionsForiOS}
                                                    onSelect={(index, value) => {
                                                        this.onUrlSelected(value);
                                                    }}
                                                    // defaultValue={this.state.url}
                                                    //defaultIndex={0}
                                                    style={{
                                                        flex: 1,
                                                        width: '100%',
                                                        padding: 5,
                                                        alignItems: 'flex-start'

                                                    }}
                                                    textStyle={{ fontSize: 16, color: 'white' }}
                                                    dropdownStyle={{ width: '80%', flex: 1, paddingRight: 15 }}
                                                    dropdownTextStyle={{ fontSize: 16 }}
                                                />

                                        }

                                    </View>
                                </View>
                                :
                                <View style={{ height: 30, padding: 10 }} />

                        }

                        <View style={styles.inputMainHolder}>

                            <View style={styles.inputSubHolder}>
                                <Image
                                    source={{ uri: 'login_email' }}
                                    style={styles.inputImageStyle}
                                />

                                <TextInput
                                    autoCorrect={false}
                                    spellCheck={false}
                                    clearButtonMode='always'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    style={[styles.inputTextStyle]}
                                    placeholder='Enter your e-mail'
                                    placeholderTextColor='#ddd'

                                    ref='email'
                                    onSubmitEditing={() => {
                                        this.refs.password.focus();
                                    }}
                                    autoCapitalize='none'
                                    returnKeyType='next'
                                    value={this.state.email}
                                    onChangeText={this.onEmailChanged.bind(this)}
                                />
                            </View>


                        </View>
                        <View style={styles.inputMainHolder}>

                            <View style={styles.inputSubHolder}>
                                <Image
                                    source={{ uri: 'password' }}
                                    style={styles.inputImageStyle}
                                />


                                <TextInput
                                    autoCorrect={false}
                                    spellCheck={false}
                                    clearButtonMode='always'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    style={styles.inputTextStyle}
                                    ref='password'
                                    secureTextEntry
                                    placeholder='Enter your password'
                                    placeholderTextColor='#ddd'
                                    autoCapitalize='none'
                                    returnKeyType='done'
                                    value={this.state.password}
                                    onChangeText={this.onPasswordChanged.bind(this)}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>


                    <View style={styles.forgotPasswordHolder}>
                        <TouchableOpacity onPress={this.onForgotPasswordPress.bind(this)}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                { /*Login Button */}
                <View style={{ flex: 1 }} >

                    <View style={styles.loginButtonHolder}>

                        <TouchableWithoutFeedback
                            onPressIn={this.handlePressIn}
                            onPressOut={this.handlePressOut}
                        >
                            <Animated.View style={[styles.loginButtonStyle, buttonAnimatedStyle]}>
                                {(this.state.loading) ? this.renderLoading() : this.renderLoginButton()}
                            </Animated.View>
                        </TouchableWithoutFeedback>

                    </View>
                    <View style={styles.signUpHolder}>
                        {/* <Text style={{ color: 'white', fontSize: 18 }}>Don't have an account? Sign up for free here</Text> */}
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    logoMainHolder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        // padding: 50,
    },
    logoSubHolder: {
        width: 200,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoStyle: {
        height: 80,
        width: 180,
        resizeMode: 'contain'
    },

    inputMainHolder: {
        height: 60,
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    inputSubHolder: {
        backgroundColor: '#0069AE',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5
    },
    inputTextStyle: {
        backgroundColor: '#0069AE',
        height: '100%',
        flex: 1,
        color: 'white',
        marginLeft: 5,
        marginRight: 5,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        fontSize: 18,

    },
    inputImageStyle: {
        height: 23,
        width: 23,
        tintColor: 'white',
        marginLeft: 8
    },
    forgotPasswordHolder: {
        height: 50,
        alignItems: 'flex-end',
        paddingRight: 15,
        paddingTop: 8
    },
    forgotPasswordText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Helvetica',

    },
    loginButtonHolder: {
        width: '100%',
        flex: 2,
        padding: 15,
        justifyContent: 'center',

    },
    loginButtonStyle: {
        width: '100%',
        height: 50,
        borderRadius: 3,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowColor: 'black',
        shadowOpacity: 0.5,

    },
    loginButtonTextStyle: {
        color: '#0069AE',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
    signUpHolder: {
        flex: 1,
        padding: 10,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

});
export default connect(undefined, { loginUser })(LoginForm);
