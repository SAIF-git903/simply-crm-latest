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
        _session: session,
        _operation: body.operation,
        username: body.username,
        password: body.password,
        module: body.module,
        relatedmodule: body.relatedModule,
        record: body.recordId,
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

export function fetchComments(recordId) {
    return fetchRelatedRecordsWithGrouping('ModComments', recordId);
}

export function saveComment(relatedTo, content, parentComment, recordId) {
    const { auth: { loginDetails: { userId } } } = store.getState();

    return makeCall({
        operation: 'saveRecord',
        module: 'ModComments',
        recordId,
        values: {
            "related_to": relatedTo,
            "commentcontent": content,
            "is_private": 0,
            "assigned_user_id": '19x'+userId,
            "parent_comments": parentComment ? parentComment : undefined
        }
    });
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
            operation: 'loginAndFetchModules',
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
        operation: 'listModuleRecords',
        module
    });
}

export function describeModule(module) {
    return makeCall({
        operation: 'describe',
        module
    });
}

export function fetchRecordHistory(module, recordId) {
    return makeCall({
        operation: 'history',
        module,
        recordId
    });
}

export function fetchRecordsWithGrouping(module, ids) {
    return makeCall({
        operation: 'fetchRecordsWithGrouping',
        module,
        ids
    });
}

export function fetchRelatedRecordsWithGrouping(relatedModule, recordId) {
    return makeCall({
        operation: 'relatedRecordsWithGrouping',
        recordId,
        relatedModule: relatedModule,
    });
}

export function deleteRecord(module, recordId) {
    return makeCall({
        operation: 'deleteRecords',
        module,
        recordId
    });
}

export async function trackCall(recordId) {
    try {
        const response = await makeCall({
            operation: 'trackcall',
            recordId
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