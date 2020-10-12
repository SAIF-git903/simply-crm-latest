import store from '../../store';

async function makeCall({ operation, module, recordId, ids, query, values, relatedmodule }) {
    const { auth: { loginDetails: { session, url } } } = store.getState();

    const body = {
        _session: session,
        _operation: operation,
        module,
        relatedmodule,
        record: recordId,
        ids: JSON.stringify(ids),
        query,
        values
    };

    const endpoint = `${url}/modules/Mobile/api.php`;

    const response = await fetch((endpoint), {
        method: 'POST',
        headers: {
            'cache-control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    console.log(`### API CALL ###: ${endpoint}`);
    console.log(body);
    const responseJson = await response.json();
    console.log(responseJson);

    return responseJson;
}

export function fetchComments(recordId) {
    return fetchRelatedRecordsWithGrouping('ModComments', recordId);
}

export function saveComment(relatedTo, content, parentComment, recordId) {
    const { auth: { loginDetails: { userId } } } = store.getState();

    return saveRecord(
        'ModComments',
        recordId,
        {
            "related_to": relatedTo,
            "commentcontent": content,
            "is_private": 0,
            "assigned_user_id": '19x'+userId,
            "parent_comments": parentComment ? parentComment : undefined
        }
    )

}

export function saveRecord(module, recordId, values) {
    return makeCall({
        operation: 'saveRecord',
        module,
        recordId,
        values
    });
}

export function listModuleRecords(module) {
    return makeCall({
        operation: 'listModuleRecords',
        module
    })
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

export function fetchRelatedRecordsWithGrouping(relatedmodule, recordId) {
    return makeCall({
        operation: 'relatedRecordsWithGrouping',
        recordId,
        relatedmodule: relatedmodule,
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