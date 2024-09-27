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
import IconButton from '../components/IconButton';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {resetPassword} from '../helper';
import {fontStyles} from '../styles/common';
import {headerIconColor} from '../variables/themeColors';

class ForgotPassword extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: this.props.route.params.email || '',
      buttonText: 'RESET PASSWORD',
      loading: false,
    };

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

  onEmailChanged(text) {
    this.setState({...this.state, email: text});
  }

  onButtonPress() {
    Keyboard.dismiss();

    const {email} = this.state;
    if (this.state.buttonText === 'BACK') {
      this.props.navigation.goBack(null);
    } else {
      this.setState(
        {
          loading: true,
        },
        () => {
          resetPassword(email, this);
        },
      );
    }

    Animated.spring(this.buttonAnimatedValue, {
      toValue: 0.7,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(this.buttonAnimatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  }

  getClearButton() {
    let clear = null;
    if (this.state.email.length !== 0) {
      clear = (
        <IconButton
          icon={'times-circle'}
          solid
          size={14}
          onPress={() => this.setState({email: ''})}
        />
      );
    }
    return clear;
  }

  onBackPress() {
    this.props.navigation.goBack(null);
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
      <Text style={fontStyles.loginButtonLabel}>{this.state.buttonText}</Text>
    );
  }

  render() {
    const buttonAnimatedStyle = {
      transform: [{scale: this.buttonAnimatedValue}],
    };

    return (
      <View style={{width: '100%', height: '100%', backgroundColor: '#0085DE'}}>
        {/*Logo*/}
        <View style={styles.logoMainHolder}>
          <View style={{width: '100%', flex: 1, padding: 10, paddingTop: 40}}>
            <TouchableOpacity onPress={this.onBackPress.bind(this)}>
              {/* <Icon name="arrow-left" size={28} color="white" /> */}

              <MaterialIcons name="arrow-back" size={30} color={'white'} />
            </TouchableOpacity>
          </View>
          <View style={styles.logoSubHolder}>
            <Image
              source={require('../../assets/images/logo_new_white.png')}
              style={styles.logoStyle}
            />
          </View>
        </View>

        {/*Input Component*/}
        <View style={{flex: 1.5}}>
          <View style={styles.inputMainHolder}>
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
                placeholder="Enter your e-mail"
                placeholderTextColor="#ddd"
                ref="email"
                autoCapitalize="none"
                returnKeyType="done"
                value={this.state.email}
                onChangeText={this.onEmailChanged.bind(this)}
              />
              {this.getClearButton()}
            </View>
          </View>
          <View style={styles.loginButtonHolder}>
            <TouchableOpacity
              disabled={this.state.loading}
              onPress={this.onButtonPress.bind(this)}>
              <Animated.View
                style={[styles.loginButtonStyle, buttonAnimatedStyle]}>
                {this.state.loading
                  ? this.renderLoading()
                  : this.renderLoginButton()}
              </Animated.View>
            </TouchableOpacity>
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
    justifyContent: 'center',
    // padding: 50,
  },
  logoSubHolder: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyle: {
    height: 80,
    width: 180,
    resizeMode: 'contain',
  },

  inputMainHolder: {
    height: 60,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  inputSubHolder: {
    backgroundColor: '#0069AE',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
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
    marginLeft: 8,
  },
  forgotPasswordHolder: {
    height: 50,
    alignItems: 'flex-end',
    paddingRight: 15,
    paddingTop: 8,
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Helvetica',
  },
  loginButtonHolder: {
    width: '100%',
    height: '40%',
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
    alignItems: 'center',
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
});
export default connect(null)(ForgotPassword);
