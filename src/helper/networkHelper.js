import { AsyncStorage } from 'react-native';
import { LOGINDETAILSKEY } from '../variables/strings';
import { LOGIN_USER_SUCCESS } from '../actions/types';
import store from '../store';
import { addDatabaseKey } from '.';

export const getDatafromNet = async (param, dispatch) => {
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
        console.log('url', `${loginDetails.url}/modules/Mobile/api.php`);
        console.log('params', param);
    const responseJson = await response.json();
    if (!responseJson.success) {
        if (responseJson.error.code === 1501 || responseJson.error.code === '1501') {
            //session expired
            let param = new FormData();
            param.append('_operation', 'loginAndFetchModules');
            param.append('username', loginDetails.username);
            param.append('password', loginDetails.password);

            console.log('url', `${loginDetails.url}/modules/Mobile/api.php`);
            console.log('params', param);
            const newresponse = await fetch((`${loginDetails.url}/modules/Mobile/api.php`), {
                method: 'POST',
                headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'multipart/form-data; charset=utf-8',
                'cache-control': 'no-cache',
                },
                body: param
                });
                const newresponseJson = newresponse.json();
                if (newresponseJson.success) {
                    const newLoginDetails = {
                    username: loginDetails.username,
                    password: loginDetails.password,
                    url: loginDetails.url,
                    session: newresponseJson.result.login.session,
                    userTz: newresponseJson.result.login.user_tz,
                    crmTz: newresponseJson.result.login.crm_tz,
                    vtigerVersion: parseInt(newresponseJson.result.login.vtiger_version.charAt(0), 10),
                    dateFormat: newresponseJson.result.login.date_format,
                    modules: newresponseJson.result.modules,
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
                const newResponseJsonToReturn = newResponseToReturn.json();
                return newResponseJsonToReturn;
            } 
            return newresponseJson;
        } else {
            return responseJson;
        }
    } else {
        return responseJson;
    }
};

