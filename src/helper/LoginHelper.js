import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import {LOGINDETAILSKEY, LOGINFORM, URLDETAILSKEY} from '../variables/strings';
import {LOGIN_USER_SUCCESS} from '../actions/types';
import {addDatabaseKey} from '.';
import {fetchUserData} from '../actions/userActions';
import store from '../store';
import {
  API_loginAndFetchModules,
  API_locateInstance,
  API_forgotPassword,
} from './api';

export const getInstancesList = async (
  email,
  password,
  url,
  navigation,
  loginInstance,
  dispatch,
) => {
  try {
    const URLDetails = JSON.parse(await AsyncStorage.getItem(URLDETAILSKEY));
    if (URLDetails !== null) {
      doUserLogin(
        URLDetails.userName,
        URLDetails.password,
        URLDetails.url,
        navigation,
        loginInstance,
        dispatch,
      );
    } else {
      const responseJson = await API_locateInstance(email, password);
      if (responseJson.output.success !== 0) {
        const output = responseJson.output;
        if (output.length > 1) {
          // multi urls
          Toast.show('Please select the url to login');
          loginInstance.setState({
            loading: false,
            showUrlList: true,
            urlList: output,
            password,
            username: output[0].username,
            dispatch,
          });
        } else if (output.length === 1) {
          // single url
          assignUrl(
            output[0].url,
            output[0].username,
            password,
            navigation,
            loginInstance,
            dispatch,
          );
        } else {
          //no urls

          Toast.show('No Url Found');
          loginInstance.setState({loading: false});
        }
      } else {
        loginInstance.setState({loading: false});
        Alert.alert(
          'Login failed',
          'Please check your email and password',
          [{text: 'Ok', onPress: () => {}}],
          {cancelable: true},
        );
      }
    }
  } catch (error) {
    console.log(error);
    showNetworkError(loginInstance);
  }
};

export const assignUrl = async (
  crmUrl,
  crmUsername,
  crmPassword,
  navigation,
  loginInstance,
  dispatch,
) => {
  try {
    const urlDetails = {
      url: crmUrl,
      userName: crmUsername,
      password: crmPassword,
    };
    AsyncStorage.setItem(URLDETAILSKEY, JSON.stringify(urlDetails));
    await addDatabaseKey(URLDETAILSKEY);
    doUserLogin(
      crmUsername,
      crmPassword,
      crmUrl,
      navigation,
      loginInstance,
      dispatch,
    );
  } catch (error) {
    console.log(error);
    showNetworkError(loginInstance);
  }
};

export const doUserLogin = async (
  username,
  password,
  url,
  navigation,
  loginInstance,
  dispatch,
) => {
  try {
    let trimmedUrl = url.replace(/ /g, '').replace(/\/$/, '');
    trimmedUrl =
      trimmedUrl.indexOf('://') === -1 ? 'https://' + trimmedUrl : trimmedUrl;
    if (url.includes('www.')) {
      trimmedUrl = trimmedUrl.replace('www.', '');
    }
    if (url.includes('http://')) {
      trimmedUrl = trimmedUrl.replace('http://', 'https://');
    }

    const responseJson = await API_loginAndFetchModules(
      trimmedUrl,
      username,
      password,
    );
    if (responseJson.success) {
      const loginDetails = {
        username,
        password,
        url: trimmedUrl,
        session: responseJson.result.login.session,
        userTz: responseJson.result.login.user_tz,
        crmTz: responseJson.result.login.crm_tz,
        vtigerVersion: parseInt(
          responseJson.result.login.vtiger_version.charAt(0),
          10,
        ),
        dateFormat: responseJson.result.login.date_format,
        modules: responseJson.result.modules,
        menu: responseJson.result.menu,
        userId: responseJson.result.login.userid,
        isAdmin: responseJson.result.login.isAdmin,
      };

      store
        .dispatch(fetchUserData(loginDetails))
        .then(async () => {
          AsyncStorage.setItem(LOGINDETAILSKEY, JSON.stringify(loginDetails));
          await addDatabaseKey(LOGINDETAILSKEY);
          loginUserSuccess(dispatch, loginDetails, navigation);
        })
        .catch(e => {
          console.log(e);
          loginInstance.setState({
            loading: false,
            showUrlList: false,
            componentToLoad: LOGINFORM,
          });
          Alert.alert(
            'Authentication failed',
            'Something went wrong, please try again later',
            [{text: 'Ok', onPress: () => {}}],
            {cancelable: true},
          );
        });
    } else {
      loginInstance.setState({loading: false, showUrlList: false});
      Alert.alert(
        'Authentication failed',
        'Check your username and password',
        [{text: 'Ok', onPress: () => {}}],
        {cancelable: true},
      );
    }
  } catch (error) {
    console.log(error);
    try {
      const loginDetails = JSON.parse(
        await AsyncStorage.getItem(LOGINDETAILSKEY),
      );
      if (loginDetails !== null) {
        loginUserSuccess(dispatch, loginDetails, navigation);
      } else {
        showNetworkError(loginInstance);
      }
    } catch (error) {
      console.log(error);
      showNetworkError(loginInstance);
    }
  }
};

const showNetworkError = loginInstance => {
  loginInstance.setState({loading: false, showUrlList: false});
  Alert.alert(
    'Wrong url or Network error',
    'Check your internet connection and your url.',
    [{text: 'Ok', onPress: () => {}}],
    {cancelable: true},
  );
};

const loginUserSuccess = (dispatch, loginDetails, navigation) => {
  dispatch({type: LOGIN_USER_SUCCESS, payload: loginDetails});
  // const resetAction = NavigationActions.reset({
  //     index: 0,
  //     actions: [
  //         NavigationActions.navigate({ routeName: 'HomeScreen' })
  //     ]
  // });

  navigation.replace('Drawer');
};

export const resetPassword = async (email, forgotPasswordInstance) => {
  try {
    const responseJson = await API_forgotPassword(email);
    if (responseJson.output.success !== 0) {
      forgotPasswordInstance.setState({buttonText: 'BACK', loading: false});
      Toast.show(
        "Thank you - we've now sent password reset instructions to the email you entered.",
      );
    } else {
      //Failed
      forgotPasswordInstance.setState({
        buttonText: 'RESET PASSWORD',
        loading: false,
      });
      const information = responseJson.output.information;
      Toast.show(information);
    }
  } catch (error) {
    console.log(error);
    showNetworkError(loginInstance);
  }
};
