import AsyncStorage from '@react-native-community/async-storage';
import { LOGINDETAILSKEY } from '../variables/strings';
import { LOGIN_USER_SUCCESS } from '../actions/types';
import store from '../store';
import { addDatabaseKey } from '.';
import {loginAndFetchModules} from "./api";

export const getDataFromNet = async (param, dispatch) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    param.append('_session', loginDetails.session);
    const response = await fetch((`${loginDetails.url}/modules/Mobile/api.php`), {
        method: 'POST',
        headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data; charset=utf-8',
            'cache-control': 'no-cache',
        },
        body: param
    });
    console.log('getDatafromNet');
    console.log(`${loginDetails.url}/modules/Mobile/api.php`);
    console.log(param);
    const responseJson = await response.json();
    console.log(responseJson);
    if (!responseJson.success) {
        if (responseJson.error.code === 1501 || responseJson.error.code === '1501') {
            const newResponseJson = await loginAndFetchModules(loginDetails.url, loginDetails.username, loginDetails.password);
            if (newResponseJson.success) {
                const newLoginDetails = {
                    username: loginDetails.username,
                    password: loginDetails.password,
                    url: loginDetails.url,
                    session: newResponseJson.result.login.session,
                    userTz: newResponseJson.result.login.user_tz,
                    crmTz: newResponseJson.result.login.crm_tz,
                    vtigerVersion: parseInt(newResponseJson.result.login.vtiger_version.charAt(0), 10),
                    dateFormat: newResponseJson.result.login.date_format,
                    modules: newResponseJson.result.modules,
                    menu: newResponseJson.result.menu,
                    userId: newResponseJson.result.login.userid,
                    isAdmin: newResponseJson.result.login.isAdmin,
                };

                AsyncStorage.setItem(LOGINDETAILSKEY, JSON.stringify(newLoginDetails));
                await addDatabaseKey(LOGINDETAILSKEY);
                dispatch({ type: LOGIN_USER_SUCCESS, payload: newLoginDetails });
                param.append('_session', newLoginDetails.session);
                const newResponseToReturn = await fetch((`${loginDetails.url}/modules/Mobile/api.php`), {
                    method: 'POST',
                    headers: {
                        // 'Accept': 'application/json',
                        // 'Content-Type': 'multipart/form-data; charset=utf-8',
                        'cache-control': 'no-cache',
                    },
                    body: param
                });
                return await newResponseToReturn.json();
            }
            return newResponseJson;
        } else {
            return responseJson;
        }
    } else {
        return responseJson;
    }
};