import { AsyncStorage, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import { LOGINDETAILSKEY, LOGINFORM, URLDETAILSKEY } from '../variables/strings';
import { LOGIN_USER_SUCCESS } from '../actions/types';
import { addDatabaseKey } from '.';
import { fetchUserData } from '../actions/userActions';
import store from '../store';

export const userUrlHelper = async (email, password, url, navigation, loginInstance, dispatch) => {

    try {
        const URLDetails = JSON.parse(await AsyncStorage.getItem(URLDETAILSKEY));
        if (URLDetails !== null) {
            console.log(URLDetails)
            loginHelper(URLDetails.userName, URLDetails.password, URLDetails.url, navigation, loginInstance, dispatch);
        } else {
            const response = await fetch(`https://sai.simplyhq.com/index.php?action=LocateInstance&email=${email}&password=${password}&api_key=jNuaPq7MRfLDvnLs5gZ9XgU1H7n3URma`, {
                method: 'GET',
                headers: {
                    'cache-control': 'no-cache'
                },
            });
            const responseJson = await response.json();

            console.log(responseJson)

            if (responseJson.output.success !== 0) {
                const output = responseJson.output;
                let crmUrl; let crmUsername; let crmPassword;
                if (output.length > 1) {
                    // multi urls
                    Toast.show('Please select the url to login');
                    loginInstance.setState({ loading: false, showUrlList: true, urlList: output, password, username: output[0].username, dispatch });
                } else if (output.length === 1) {
                    // single url
                    crmUrl = output[0].url; crmUsername = output[0].username; crmPassword = password;
                    assignUrl(crmUrl, crmUsername, crmPassword, navigation, loginInstance, dispatch);
                } else {
                    //no urls
                    Toast.show('No Url Found');
                    loginInstance.setState({ loading: false });
                }
            } else {
                loginInstance.setState({ loading: false });
                Alert.alert('Login failed', 'Please check your email and password',
                    [
                        { text: 'Ok', onPress: () => { } },
                    ],
                    { cancelable: true }
                );
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export const assignUrl = async (crmUrl, crmUsername, crmPassword, navigation, loginInstance, dispatch) => {
    try {
        const urlDetails = { url: crmUrl, userName: crmUsername, password: crmPassword };
        AsyncStorage.setItem(URLDETAILSKEY, JSON.stringify(urlDetails));
        await addDatabaseKey(URLDETAILSKEY);
        loginHelper(crmUsername, crmPassword, crmUrl, navigation, loginInstance, dispatch);
    } catch (error) {
        console.log(error);
    }
};

export const loginHelper = async (username, password, url, navigation, loginInstance, dispatch) => {

    let param = new FormData();
    param.append('_operation', 'loginAndFetchModules');
    param.append('username', username);
    param.append('password', password);
    // param.append('username', 'mobileapp-dev');
    // param.append('password', '45gargle62attain');


    try {
        // console.log('URL', url);

        let trimUrl = url.replace(/ /g, '');

        trimUrl = (trimUrl.indexOf('://') === -1) ? 'https://' + trimUrl : trimUrl;
        if (url.includes('www')) {
            trimUrl = url.replace('www.', '');
        }

        if (url.includes('http://')) {
            trimUrl = url.replace('http://', 'https://')
        }

        //hardcoded for testing
        // trimUrl = 'https://mobileapp-dev.simply-crm.com';
        const response = await fetch(`${trimUrl}/modules/Mobile/api.php`, {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'cache-control': 'no-cache',
                //'Content-Type': 'multipart/form-data; charset=utf-8',
            },
            body: param
        });
        // console.log(response);
        const responseJson = await response.json();
        console.log(responseJson);
        if (responseJson.success) {
            // loginInstance.setState({ loading: false, showUrlList: false });            
            const loginDetails = {
                username,
                password,
                url: trimUrl,
                session: responseJson.result.login.session,
                userTz: responseJson.result.login.user_tz,
                crmTz: responseJson.result.login.crm_tz,
                vtigerVersion: parseInt(responseJson.result.login.vtiger_version.charAt(0), 10),
                dateFormat: responseJson.result.login.date_format,
                modules: responseJson.result.modules,
                userId: responseJson.result.login.userid
            };

            store.dispatch(fetchUserData(loginDetails))
                .then(async () => {
                    AsyncStorage.setItem(LOGINDETAILSKEY, JSON.stringify(loginDetails));
                    await addDatabaseKey(LOGINDETAILSKEY);
                    loginUserSuccess(dispatch, loginDetails, navigation);
                })
                .catch(() => {
                    loginInstance.setState({ loading: false, showUrlList: false, componentToLoad: LOGINFORM });
                    Alert.alert('Authentication failed', 'Something went wrong, please try again later',
                        [
                            { text: 'Ok', onPress: () => { } },
                        ],
                        { cancelable: true }
                    );

                })
        } else {
            loginInstance.setState({ loading: false, showUrlList: false });
            Alert.alert('Authentication failed', 'Check your username and password',
                [
                    { text: 'Ok', onPress: () => { } },
                ],
                { cancelable: true }
            );
        }
    } catch (error) {
        console.log(error);
        try {
            const loginDetails = JSON.parse(await AsyncStorage.getItem(LOGINDETAILSKEY));
            if (loginDetails !== null) {
                loginUserSuccess(dispatch, loginDetails, navigation);
                //loginInstance.setState({ loading: false });                
            } else {
                showNetworkError(loginInstance);
            }
        } catch (error) {
            console.log(error);
            showNetworkError(loginInstance);
        }
    }
};
const showNetworkError = (loginInstance) => {
    loginInstance.setState({ loading: false, showUrlList: false });
    Alert.alert('Wrong url or Network error', 'Check your internet connection and your url.',
        [
            { text: 'Ok', onPress: () => { } },
        ],
        { cancelable: true }
    );
};

const loginUserSuccess = (dispatch, loginDetails, navigation) => {
    dispatch({ type: LOGIN_USER_SUCCESS, payload: loginDetails });
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'HomeScreen' })
        ]
    });
    navigation.dispatch(resetAction);
};

export const resetPassword = async (email, forgotPasswordInstance) => {
    try {
        const response = await fetch(`https://sai.simplyhq.com/index.php?action=AppForgotPassword&email=${email}&api_key=jNuaPq7MRfLDvnLs5gZ9XgU1H7n3URma`, {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache'
            },
        });
        const responseJson = await response.json();
        console.log(responseJson);
        if (responseJson.output.success !== 0) {
            forgotPasswordInstance.setState({ buttonText: 'BACK', loading: false });
            Toast.show('Thank you - we\'ve now sent password reset instructions to the email you entered.');
        } else {
            //Failed
            forgotPasswordInstance.setState({ buttonText: 'RESET PASSWORD', loading: false });
            const information = responseJson.output.information
            Toast.show(information);
        }
    } catch (error) {
        console.log(error);
    }
};
