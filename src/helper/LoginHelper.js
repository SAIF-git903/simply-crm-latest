import { AsyncStorage, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { LOGINDETAILSKEY, LOGINFORM } from '../variables/strings';
import { LOGIN_USER_SUCCESS } from '../actions/types';
import { addDatabaseKey } from '.';

export const loginHelper = async (username, password, url, navigation, loginInstance, dispatch) => {
    let param = new FormData();
    param.append('_operation', 'loginAndFetchModules');
    param.append('username', username);
    param.append('password', password);
    try {
        let trimUrl = url;
        if (url.includes('www')) { 
            trimUrl = url.replace('www.', '');
            //console.log(trimUrl);
        }
        console.log(trimUrl);
        console.log(username);
        console.log(password);
        const response = await fetch(`${trimUrl}/modules/Mobile/api.php`, {
        method: 'POST',
        headers: {
            //'Accept': 'application/json',
            'cache-control': 'no-cache',
            //'Content-Type': 'multipart/form-data; charset=utf-8',
        },
        body: param
        });
        console.log(response);
        const responseJson = await response.json();
        if (responseJson.success) {
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
            };
            AsyncStorage.setItem(LOGINDETAILSKEY, JSON.stringify(loginDetails));
            await addDatabaseKey(LOGINDETAILSKEY);
            loginUserSuccess(dispatch, loginDetails, navigation);
            //loginInstance.setState({ loading: false });            
        } else {
            Alert.alert('Authentication failed', 'Check your username and password',
                [
                  { text: 'Ok', onPress: () => {} },
                ],
                { cancelable: true }
              );
              loginInstance.setState({ loading: false });
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
    loginInstance.setState({ loading: false });
    Alert.alert('Wrong url or Network error', 'Check your internet connection and your url.',
    [
      { text: 'Ok', onPress: () => {} },
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
