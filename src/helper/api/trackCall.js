import store from '../../store';

export default async function trackCall(recordId) {
    try {
        const { auth } = store.getState();
        const { loginDetails } = auth;

        const param = new FormData();
        param.append('_session', loginDetails.session);
        param.append('_operation', 'trackcall');
        param.append('record', recordId)

        const response = await fetch((`${loginDetails.url}/modules/Mobile/api.php`), {
            method: 'POST',
            headers: {
                'cache-control': 'no-cache',
            },
            body: param
        });

        const responseJson = await response.json();

        if (responseJson.success) {
            console.log('Call tracked successfully.')
        } else {
            throw Error('Failed to track call.')
        }
    } catch (e) {
        console.log(e)
    }
}