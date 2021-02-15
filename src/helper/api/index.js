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
        page: (body.page) ? body.page : 1,
        specialFields: (body.specialFields !== undefined && body.specialFields.length > 0) ? JSON.stringify(body.specialFields) : undefined,
        limit: (body.limit) ? body.limit : 25,
        searchText: (body.searchText !== '') ? body.searchText : undefined,
    };
    //clear undefined
    for (const [key, value] of Object.entries(body_data)) {
        if (value === undefined) {
            delete body_data[key];
        }
    }

    let responseJson = await doFetch(request_url, method, headers, body_data);

    //TODO check me
    if (
        responseJson.error !== undefined
        && responseJson.error.code !== undefined
        && parseInt(responseJson.error.code, 10) === 1501
    ) {
        const newResponseJson = await loginAndFetchModules(loginDetails.url, loginDetails.username, loginDetails.password);
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
            AsyncStorage.setItem(LOGINDETAILSKEY, JSON.stringify(newLoginDetails));
            await addDatabaseKey(LOGINDETAILSKEY);
            dispatch({ type: LOGIN_USER_SUCCESS, payload: newLoginDetails });

            body_data._session = newLoginDetails.session;
            responseJson = await doFetch(request_url, method, headers, body_data);
        } else {
            console.log('Cant get new session');
            //TODO Toast ??
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
    console.log(`### API CALL ###: ${request_url}`);
    console.log(body_data);
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
}

export function locateInstance(email, password) {
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

export function loginAndFetchModules(trimmedUrl, username, password) {
    return makeCall(
        {
            _operation: 'loginAndFetchModules',
            username,
            password
        },
        `${trimmedUrl}/modules/Mobile/api.php`
    );
}

export function forgotPassword(email) {
    return makeCall(
        {},
        `https://sai.simplyhq.com/index.php?action=AppForgotPassword&email=${email}&api_key=jNuaPq7MRfLDvnLs5gZ9XgU1H7n3URma`,
        {
            'cache-control': 'no-cache',
        },
        'GET'
    );
}

export function listModuleRecords(module, page, specialFields, limit, searchText) {
    return makeCall({
        _operation: 'listModuleRecords',
        module,
        page,
        specialFields,
        limit,
        searchText
    });
}

export function describe(module) {
    return makeCall({
        _operation: 'describe',
        module
    });
}

export function structure(module) {
    return makeCall({
        _operation: 'structure',
        module
    });
}

export function fetchRecord(body, request_url) {
    body._operation = 'fetchRecord';
    return makeCall(
        body,
        request_url
    );
}

export function history(module, record) {
    return makeCall({
        _operation: 'history',
        module,
        record
    });
}

export function fetchRecordWithGrouping(module, record) {
    return makeCall({
        _operation: 'fetchRecordWithGrouping',
        module,
        record
    });
}

export function fetchRecordsWithGrouping(module, ids) {
    return makeCall({
        _operation: 'fetchRecordsWithGrouping',
        module,
        ids
    });
}

export function deleteRecord(module, record) {
    return makeCall({
        _operation: 'deleteRecords',
        module,
        record
    });
}

export function fetchComments(record) {
    return makeCall({
        _operation: 'relatedRecordsWithGrouping',
        record,
        relatedModule: 'ModComments',
    });
}

export function saveRecord(module, values, record) {
    return makeCall({
        _operation: 'saveRecord',
        module,
        values,
        record
    });
}

export function query(query) {
    return makeCall({
        _operation: 'query',
        query
    });
}

export async function trackCall(record) {
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