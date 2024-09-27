import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  TextInput,
  Image,
  ActivityIndicator,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import ModalDropdown from 'react-native-modal-dropdown';
import SafeAreaView from 'react-native-safe-area-view';
import IconButton from '../components/IconButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {URLDETAILSKEY, LOGINDETAILSKEY} from '../variables/strings';
import {loginUser, loginUserforMslogin} from '../actions/';
import {assignUrl} from '../helper';
import {fontStyles} from '../styles/common';
import {authorize, refresh} from 'react-native-app-auth';
import {API_locateInstanceformslogin} from '../helper/api';

class LoginForm extends Component {
  static navigationOptions = {
    header: null,
  };

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
      token: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.buttonAnimatedValue = new Animated.Value(1);
  }

  componentDidMount() {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  onUrlChanged(text) {
    this.setState({...this.state, url: text});
  }

  onEmailChanged(text) {
    this.setState({...this.state, email: text});
  }

  onPasswordChanged(text) {
    this.setState({...this.state, password: text});
  }

  onButtonPress() {
    AsyncStorage.removeItem(URLDETAILSKEY);
    AsyncStorage.removeItem(LOGINDETAILSKEY);

    Keyboard.dismiss();

    const {email, password, token, url, username} = this.state;

    if (url) {
      this.setState(
        {
          loading: true,
        },
        () => {
          console.log('assign url called in loginform');
          if (token !== null) {
            assignUrl(
              url,
              username,
              password,
              token,
              this.props.navigation,
              this,
              this.state.dispatch,
            );
          } else {
            assignUrl(
              url,
              username,
              password,
              '',
              this.props.navigation,
              this,
              this.state.dispatch,
            );
          }
        },
      );
    } else {
      this.setState(
        {
          showUrlList: false,
        },
        () => {
          this.props.loginUser(
            email,
            password,
            '',
            '',
            this.props.navigation,
            this,
          );
        },
      );
    }

    Animated.spring(this.buttonAnimatedValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(this.buttonAnimatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  }

  onForgotPasswordPress() {
    this.props.navigation.navigate('Forgot Password', {
      email: this.state.email,
    });
  }

  getData = async () => {
    AsyncStorage.removeItem(URLDETAILSKEY);
    AsyncStorage.removeItem(LOGINDETAILSKEY);
    Keyboard.dismiss();
    const {password, url, username} = this.state;

    const config = {
      clientId: '41f6fbd2-7380-4f9a-b497-e28fc5890868',
      redirectUrl: 'graph-simplycrm://react-native-auth-simplycrm/',
      scopes: [
        'openid',
        'offline_access',
        'profile',
        'User.Read',
        'MailboxSettings.Read',
        'Calendars.ReadWrite',
      ],
      additionalParameters: {prompt: 'select_account'},
      serviceConfiguration: {
        authorizationEndpoint:
          'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenEndpoint:
          'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      },
    };

    const authState = await authorize(config);

    const refreshedState = await refresh(config, {
      refreshToken: authState.refreshToken,
    });
    console.log('refreshedState', refreshedState?.accessToken);

    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${refreshedState?.accessToken}`,
      },
    });
    const data = await response.json();

    let emailid = data?.mail;
    let tokenID = refreshedState?.accessToken;
    this.setState({token: tokenID});
    this.setState(
      {
        showUrlList: false,
      },
      () => {
        this.props.loginUserforMslogin(
          emailid,
          tokenID,
          'xxxx',
          '',
          this.props.navigation,
          this,
        );
      },
    );

    // Animated.spring(this.buttonAnimatedValue, {
    //   toValue: 0.7,
    //   useNativeDriver: true,
    // }).start(() => {
    //   Animated.spring(this.buttonAnimatedValue, {
    //     toValue: 1,
    //     useNativeDriver: true,
    //   }).start();
    // });
  };

  getButtonText() {
    let text = (
      <View>
        <ActivityIndicator color={'#0069AE'} />
      </View>
    );
    if (!this.state.loading) {
      text = <Text style={fontStyles.loginButtonLabel}>LOGIN</Text>;
    }
    return text;
  }

  getButtonTextMSLOGIN() {
    let text = (
      <View>
        <ActivityIndicator color={'#0069AE'} />
      </View>
    );
    if (!this.state.loading) {
      text = (
        <View>
          <Text style={fontStyles.loginButtonLabel}>MS LOGIN</Text>;
        </View>
      );
    }
    return text;
  }

  onUrlSelected(url) {
    const selectedUrlDetails = this.state.urlList.find((x) => x.url === url);

    this.setState({
      url: selectedUrlDetails?.url ? selectedUrlDetails.url : '',
      username: selectedUrlDetails?.username
        ? selectedUrlDetails?.username
        : '',
    });
  }

  getUrlList(options, optionsForiOS) {
    let view = <View style={{height: 0, padding: 0}} />;
    if (this.state.showUrlList) {
      view = (
        <View style={styles.textInputWrapper}>
          <Icon
            name="globe"
            solid
            size={23}
            color="#92ADD1"
            style={{width: 24}}
          />
          {this.getInstanceList(options, optionsForiOS)}
        </View>
      );
    }
    return view;
  }

  getInstanceList(options, optionsForiOS) {
    let picker;
    if (Platform.OS === 'android') {
      picker = (
        <Picker
          style={[
            fontStyles.loginInputFieldLabel,
            {flex: 1, backgroundColor: 'transparent'},
          ]}
          mode={'dropdown'}
          selectedValue={this.state.url}
          onValueChange={(itemValue) => {
            this.onUrlSelected(itemValue);
          }}>
          <Picker.Item label="Please Select Url" value={0} />
          {options.map((item, index) => {
            return (
              <Picker.Item
                label={item.url}
                value={item.url}
                key={index}
                color="black"
              />
            );
          })}
        </Picker>
      );
    } else {
      picker = (
        <ModalDropdown
          onDropdownWillShow={() => Keyboard.dismiss()}
          options={optionsForiOS}
          onSelect={(index, value) => {
            this.onUrlSelected(value);
          }}
          style={{
            flex: 1,
            width: '100%',
            padding: 5,
            alignItems: 'flex-start',
          }}
          textStyle={fontStyles.loginInputFieldLabel}
          dropdownStyle={{width: '80%', flex: 1}}
          dropdownTextStyle={[
            fontStyles.loginInputFieldLabel,
            {fontSize: 14, color: 'black'},
          ]}
        />
      );
    }
    return picker;
  }

  getClearButton() {
    let clear = null;
    if (this.state.email.length !== 0) {
      clear = (
        <IconButton
          icon={'close-circle'}
          solid
          size={18}
          onPress={() => this.setState({email: ''})}
        />
      );
    }
    return clear;
  }

  getEye(password, showPassword) {
    let eye = null;
    if (password.length !== 0) {
      eye = (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            solid
            icon={showPassword ? 'eye-off' : 'eye'}
            size={20}
            onPress={() => this.setState({showPassword: !showPassword})}
          />
        </View>
      );
    }
    return eye;
  }

  render() {
    const {password, showPassword} = this.state;

    const buttonAnimatedStyle = {
      transform: [{scale: this.buttonAnimatedValue}],
    };

    const options = this.state.urlList;
    const optionsForiOS = [];
    options.map((item) => {
      optionsForiOS.push(item.url);
    });

    return (
      <View style={styles.wrapper}>
        <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/images/logo_new_white.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.formSection}>
            {/* url selector */}
            {this.getUrlList(options, optionsForiOS)}

            {this.state.token === null && (
              <>
                {/* e-mail field */}
                <View style={styles.textInputWrapper}>
                  <Icon
                    name="envelope"
                    solid
                    size={23}
                    color="#92ADD1"
                    style={{width: 24}}
                  />

                  <TextInput
                    autoGrow={true}
                    autoCorrect={false}
                    spellCheck={false}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    style={[
                      fontStyles.loginInputFieldLabel,
                      styles.inputFieldLabel,
                      {marginBottom: Platform.OS === 'android' ? -5 : 0},
                    ]}
                    placeholder="Enter e-mail"
                    placeholderTextColor="#92ADD1"
                    ref="email"
                    onSubmitEditing={() => {
                      this.refs.password.focus();
                    }}
                    autoCapitalize="none"
                    returnKeyType="next"
                    value={this.state.email}
                    onChangeText={this.onEmailChanged.bind(this)}
                  />
                  {this.getClearButton()}
                </View>

                {/* password field */}
                <View style={styles.textInputWrapper}>
                  <Fontisto
                    name="locked"
                    solid
                    size={23}
                    color="#92ADD1"
                    style={{width: 24}}
                  />
                  <TextInput
                    autoGrow={true}
                    autoCorrect={false}
                    spellCheck={false}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    style={[
                      fontStyles.loginInputFieldLabel,
                      styles.inputFieldLabel,
                      {marginBottom: Platform.OS === 'android' ? -5 : 0},
                    ]}
                    ref="password"
                    clearTextOnFocus={false}
                    placeholder="Enter your password"
                    placeholderTextColor="#92ADD1"
                    autoCapitalize="none"
                    returnKeyType="done"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={this.onPasswordChanged.bind(this)}
                  />
                  {this.getEye(password, showPassword)}
                </View>

                {/* forgot password */}
                <View style={styles.forgotPasswordHolder}>
                  <TouchableOpacity
                    onPress={this.onForgotPasswordPress.bind(this)}>
                    <Text style={fontStyles.forgotPasswordLabel}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/*Login Button */}
            <View style={styles.loginButtonHolder}>
              <TouchableOpacity
                disabled={this.state.loading}
                onPress={this.onButtonPress.bind(this)}>
                <Animated.View
                  style={[styles.loginButtonStyle, buttonAnimatedStyle]}>
                  {this.getButtonText()}
                </Animated.View>
              </TouchableOpacity>
            </View>

            {this.state.token === null && (
              <TouchableOpacity
                style={styles.msloginbtn}
                onPress={() => this.getData()}>
                <View style={[styles.mslogoSection]}>
                  <Image
                    source={require('../../assets/images/microsoft.png')}
                    style={styles.mslogo}
                  />
                </View>
                <Text style={styles.mslogintxt}>Microsoft Login</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.signupSection} />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0085DE',
  },
  logoSection: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  signupSection: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  logo: {
    height: 80,
    width: 180,

    // alignSelf: 'center',
    resizeMode: 'contain',
  },
  textInputWrapper: {
    backgroundColor: '#245BA2',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  inputFieldLabel: {
    paddingLeft: 10,
    flex: 1,
  },
  forgotPasswordHolder: {
    alignSelf: 'flex-end',
  },
  loginButtonHolder: {
    width: '100%',
    justifyContent: 'center',
    paddingTop: 35,
  },
  loginButtonStyle: {
    width: '100%',
    height: 50,
    borderRadius: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  msloginbtn: {
    marginTop: 15,
    width: '100%',
    height: 50,
    borderRadius: 3,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  mslogintxt: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
    fontSize: 18,
    width: '65%',
    textAlign: 'center',
  },
  mslogoSection: {
    height: 30,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mslogo: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});

export default connect(undefined, {loginUser, loginUserforMslogin})(LoginForm);
