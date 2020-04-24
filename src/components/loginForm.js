import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, TextInput, Image, ActivityIndicator, Text, Animated, TouchableWithoutFeedback,
    StyleSheet, Alert, Picker, TouchableOpacity, Platform, Linking, SafeAreaView, KeyboardAvoidingView, KeyboardAvoidingViewBase
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ModalDropdown from 'react-native-modal-dropdown';
import IconButton from '../components/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faTimesCircle, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faLockAlt } from '@fortawesome/pro-solid-svg-icons';
import { loginUser } from '../actions/';
import { userUrlHelper, assignUrl } from '../helper';
import { fontStyles } from '../styles/common';

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
            username: '',
            showPassword: false,
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
            <Text style={fontStyles.loginButtonLabel} >LOGIN</Text>
        );
    }

    onUrlSelected(url) {
        const selectedUrlDetails = this.state.urlList.find(x => x.url === url);

        this.setState({
            url: selectedUrlDetails.url,
            username: selectedUrlDetails.username
        });

    }

    async openSignUpUrl() {
        const url = `https://auth.simply-crm.com/?email=${this.state.email}`
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Cannot open URL on this device, please visit: ${url}`);
        }
    }

    render() {
        const { password, showPassword } = this.state;

        const buttonAnimatedStyle = { transform: [{ scale: this.buttonAnimatedValue }] };

        const options = this.state.urlList;
        const optionsForiOS = [];
        options.map((item) => {
            optionsForiOS.push(item.url);
        });

        return (
            <View style={styles.wrapper}>
                <SafeAreaView style={{ flex: 1 }}>

                    <View style={styles.logoSection}>
                        <Image source={{ uri: 'vtigerlogo' }} style={styles.logo} />
                    </View>

                    <View style={styles.formSection}>
                        {/* url selector */}
                        {
                            (this.state.showUrlList) ?
                                <View style={styles.textInputWrapper}>
                                    <FontAwesomeIcon
                                        icon={faGlobe}
                                        color={'#92ADD1'}
                                        size={23}
                                        style={{ marginRight: 5 }}
                                    />

                                    {
                                        (Platform.OS === 'android') ?

                                            <Picker
                                                style={fontStyles.loginInputFieldLabel}

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
                                                style={{
                                                    flex: 1,
                                                    width: '100%',
                                                    padding: 5,
                                                    alignItems: 'flex-start'
                                                }}
                                                textStyle={fontStyles.loginInputFieldLabel}
                                                dropdownStyle={{ width: '80%', flex: 1 }}
                                                dropdownTextStyle={[fontStyles.loginInputFieldLabel, { fontSize: 14, color: 'black' }]}
                                            />

                                    }

                                </View>
                                :
                                <View style={{ height: 30, padding: 10 }} />

                        }

                        {/* e-mail field */}
                        <View style={styles.textInputWrapper}>
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                color={'#92ADD1'}
                                size={23}
                            />

                            <TextInput
                                autoCorrect={false}
                                spellCheck={false}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                style={[fontStyles.loginInputFieldLabel, styles.inputFieldLabel]}
                                placeholder='Enter e-mail'
                                placeholderTextColor='#92ADD1'
                                ref='email'
                                onSubmitEditing={() => {
                                    this.refs.password.focus();
                                }}
                                autoCapitalize='none'
                                returnKeyType='next'
                                value={this.state.email}
                                onChangeText={this.onEmailChanged.bind(this)}
                            />
                            {this.state.email.length !== 0 ?
                                <IconButton
                                    icon={faTimesCircle}
                                    size={14}
                                    onPress={() => this.setState({ email: '' })}
                                />
                                :
                                null
                            }
                        </View>

                        {/* password field */}
                        <View style={styles.textInputWrapper}>

                            <FontAwesomeIcon
                                icon={faLockAlt}
                                color={'#92ADD1'}
                                size={23}
                            />


                            <TextInput
                                autoCorrect={false}
                                spellCheck={false}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                style={[fontStyles.loginInputFieldLabel, styles.inputFieldLabel]}
                                ref='password'
                                clearTextOnFocus={false}
                                placeholder='Enter your password'
                                placeholderTextColor='#92ADD1'
                                autoCapitalize='none'
                                returnKeyType='done'
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={this.onPasswordChanged.bind(this)}
                            />

                            {
                                password.length !== 0 ?

                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        {/* <IconButton
                                        icon={faTimesCircle}
                                        size={14}
                                        onPress={() => this.setState({ password: '' })}
                                    /> */}

                                        <IconButton
                                            icon={showPassword ? faEyeSlash : faEye}
                                            size={16}
                                            onPress={() => this.setState({ showPassword: !showPassword })}
                                        />
                                    </View>
                                    :
                                    null
                            }

                        </View>

                        {/* forgot password */}
                        <View style={styles.forgotPasswordHolder}>
                            <TouchableOpacity onPress={this.onForgotPasswordPress.bind(this)}>
                                <Text style={fontStyles.forgotPasswordLabel}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/*Login Button */}
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

                    </View>

                    <View style={styles.signupSection}>
                        <Text
                            style={fontStyles.signUpLabel}
                            onPress={() => this.openSignUpUrl()}
                        >
                            Don't have an account? Sign up for free here
                        </Text>

                    </View>
                </SafeAreaView>

            </View >
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0085DE',
    },
    logoSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    formSection: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 15
    },
    signupSection: {
        flex: .2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 10
    },
    logo: {
        height: 80,
        width: 180,
        resizeMode: 'contain'
    },
    textInputWrapper: {
        backgroundColor: '#245BA2',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 3,
        height: 50,
        paddingHorizontal: 15,
        marginBottom: 10
    },
    inputFieldLabel: {
        paddingLeft: 10,
        flex: 1
    },
    forgotPasswordHolder: {
        alignSelf: 'flex-end'
    },
    loginButtonHolder: {
        width: '100%',
        justifyContent: 'center',
        paddingTop: 40
    },
    loginButtonStyle: {
        width: '100%',
        height: 50,
        borderRadius: 3,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default connect(undefined, { loginUser })(LoginForm);
