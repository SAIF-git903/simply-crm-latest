import store from '../../store';
import AsyncStorage from "@react-native-community/async-storage";
import {LOGINDETAILSKEY} from "../../variables/strings";
import {addDatabaseKey} from "../DatabaseKeyHelper";
import {LOGIN_USER_SUCCESS} from "../../actions/types";

async function makeCall(body, request_url, headers, method = 'POST') {
    const { auth: { loginDetails: loginDetails } } = store.getState();
    const { session, url } = loginDetails;

    if (request_url === undefined) {
        request_url = `${url}/modules/Mobile/api.php`;
    }
    if (headers === undefined) {
        headers = {
            'cache-control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
    const body_data = {
        _session: (body._session) ? body._session : session,
        _operation: body._operation,
        username: body.username,
        password: body.password,
        module: body.module,
        relatedmodule: body.relatedModule,
        record: body.record,
        ids: JSON.stringify(body.ids),
        query: body.query,
        values: body.values,
        page: body.page,
        specialFields: (body.specialFields !== undefined && body.specialFields.length > 0) ? JSON.stringify(body.specialFields) : undefined,
        limit: body.limit,
        searchText: (body.searchText !== '') ? body.searchText : undefined,
    };
    //clear undefined
    for (const [key, value] of Object.entries(body_data)) {
        if (value === undefined) {
            delete body_data[key];
        }
    }

    let responseJson = await doFetch(request_url, method, headers, body_data);

// console.log('responseJson.error.code');
// console.log(responseJson?.error?.code);
    //TODO check me
    if (
        responseJson.error !== undefined
        && responseJson.error.code !== undefined
        && parseInt(responseJson.error.code, 10) === 1501
    ) {
        const newResponseJson = await API_loginAndFetchModules(loginDetails.url, loginDetails.username, loginDetails.password);
        if (newResponseJson.success) {
            //TODO combine with LoginHelper.js ??
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
            //TODO check me
            console.log('before update session');
            AsyncStorage.setItem(LOGINDETAILSKEY, JSON.stringify(newLoginDetails));
            await addDatabaseKey(LOGINDETAILSKEY);
            await store.dispatch({ type: LOGIN_USER_SUCCESS, payload: newLoginDetails });
            console.log('after update session');

            body_data._session = newLoginDetails.session;
            responseJson = await doFetch(request_url, method, headers, body_data);
        } else {
            //TODO check me
            throw new Error('Cant get new session. Please re login');
        }
    }

    return responseJson;
}

async function doFetch(request_url, method, headers, body_data) {
    const response = await fetch((request_url), {
        method: method,
        headers: headers,
        body: (method === 'POST') ? JSON.stringify(body_data) : null
    });
    console.log(`### ${method} API CALL ###: ${request_url}`);
    console.log(body_data);
    let responseJson = await response.json().catch(
        function (error) {
            console.log('JSON parse failed on:');
            console.log(response);
            throw error;
        }
    );
    console.log(responseJson);
    return responseJson;
}

export function API_locateInstance(email, password) {
    const en_email = encodeURIComponent(email);
    const en_password = encodeURIComponent(password);
    return makeCall(
        {},
        `https://sai.simplyhq.com/index.php?action=LocateInstance&email=${en_email}&password=${en_password}&api_key=jNuaPq7MRfLDvnLs5gZ9XgU1H7n3URma`,
        {
            'cache-control': 'no-cache',
        },
        'GET'
    );
}

export function API_loginAndFetchModules(trimmedUrl, username, password) {
    return makeCall(
        {
            _operation: 'loginAndFetchModules',
            username,
            password
        },
        `${trimmedUrl}/modules/Mobile/api.php`
    );
}

export function API_forgotPassword(email) {
    return makeCall(
        {},
        `https://sai.simplyhq.com/index.php?action=AppForgotPassword&email=${email}&api_key=jNuaPq7MRfLDvnLs5gZ9XgU1H7n3URma`,
        {
            'cache-control': 'no-cache',
        },
        'GET'
    );
}

export function API_listModuleRecords(module, page, specialFields, limit, searchText) {
    return makeCall({
        _operation: 'listModuleRecords',
        module,
        page: (page) ? page : 1,
        limit: (limit) ? limit : 25,
        specialFields,
        searchText
    });
}

export function API_describe(module) {
    return makeCall({
        _operation: 'describe',
        module
    });
}

export function API_structure(module) {
    return makeCall({
        _operation: 'structure',
        module
    });
}

export function API_fetchRecord(body, request_url) {
    body._operation = 'fetchRecord';
    //TODO get only editable fields (displaytype = 2) for module on backend in fetchRecord function
    body.page = (body.page) ? body.page : 1;
    body.limit = (body.limit) ? body.limit : 25;
    return makeCall(
        body,
        request_url,
    );
}

export function API_history(module, record) {
    return makeCall({
        _operation: 'history',
        module,
        record
    });
}

export function API_fetchRecordWithGrouping(module, record) {
    return makeCall({
        _operation: 'fetchRecordWithGrouping',
        module,
        record
    });
}

export function API_fetchRecordsWithGrouping(module, ids) {
    return makeCall({
        _operation: 'fetchRecordsWithGrouping',
        module,
        ids
    });
}

export function API_deleteRecord(module, record) {
    return makeCall({
        _operation: 'deleteRecords',
        module,
        record
    });
}

export function API_fetchComments(record) {
    return makeCall({
        _operation: 'relatedRecordsWithGrouping',
        record,
        relatedModule: 'ModComments',
    });
}

export function API_saveRecord(module, values, record) {
    return makeCall({
        _operation: 'saveRecord',
        module,
        values,
        record
    });
}

export function API_query(query) {
    return makeCall({
        _operation: 'query',
        query
    });
}

export async function API_trackCall(record) {
    try {
        const response = await makeCall({
            _operation: 'trackcall',
            record
        });

        if (response) {
            console.log('Call tracked successfully.');
        } else {
            throw Error('Failed to track call.');
        }
    } catch (e) {
        console.log(e);
    }
}