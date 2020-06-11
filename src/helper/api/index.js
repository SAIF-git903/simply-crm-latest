import store from '../../store';

async function makeCall(_operation, module, record, ids) {
    const { auth: { loginDetails: { session, url } } } = store.getState();

    const body = {
        _session: session,
        _operation,
        module,
        record,
        ids: JSON.stringify(ids)
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

    console.log(`### API CALL ###: ${endpoint}`)
    console.log(body)
    const responseJson = await response.json();

    console.log(responseJson)

    return responseJson;
}

export function listModuleRecords(module) {
    return makeCall('listModuleRecords', module);
}

export function fetchRecordsWithGrouping(module, ids) {
    return makeCall('fetchRecordsWithGrouping', module, null, ids);
}

export function deleteRecord(module, recordId) {
    return makeCall('deleteRecords', module, recordId);
}

export async function trackCall(recordId) {
    try {
        const response = await makeCall('trackcall', null, recordId);

        if (response) {
            console.log('Call tracked successfully.')
        } else {
            throw Error('Failed to track call.')
        }
    } catch (e) {
        console.log(e)
    }
}