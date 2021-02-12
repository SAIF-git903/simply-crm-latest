import store from '../../store';

async function makeCall(body, request_url, headers, method = 'POST') {
    const { auth: { loginDetails: { session, url } } } = store.getState();

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
        values: body.values
    };
    //clear undefined
    for (const [key, value] of Object.entries(body_data)) {
        if (value === undefined) {
            delete body_data[key];
        }
    }

    const response = await fetch((request_url), {
        method: method,
        headers: headers,
        body: (method === 'POST') ? JSON.stringify(body_data) : null
    });

    console.log(`### API CALL ###: ${request_url}`);
    console.log(body_data);
    const responseJson = await response.json();
    console.log(responseJson);

    //TODO add here get _session if expired
    //if (responseJson.error.code === 1501 || responseJson.error.code === '1501') {

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

export function listModuleRecords(module) {
    return makeCall({
        _operation: 'listModuleRecords',
        module
    });
}

export function describeModule(module) {
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

export function fetchRecordHistory(module, record) {
    return makeCall({
        _operation: 'history',
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

export function saveRecord(module, record, values) {
    return makeCall({
        _operation: 'saveRecord',
        module,
        record,
        values
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