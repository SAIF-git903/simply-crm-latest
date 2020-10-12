import {
    FETCH_USER_DATA,
    FETCH_USER_DATA_FULFILLED,
    FETCH_USER_DATA_REJECTED
} from './types';

export const fetchUserData = (loginDetails) => async (dispatch) => {
    dispatch({ type: FETCH_USER_DATA })

    try {
        let param = new FormData();
        param.append('_operation', 'fetchRecord');
        param.append('record', '19x' + loginDetails.userId);
        param.append('_session', loginDetails.session);

        const response = await fetch((`${loginDetails.url}/modules/Mobile/api.php`), {
            method: 'POST',
            headers: {
                'cache-control': 'no-cache',
            },
            body: param
        });

        const responseJson = await response.json();

        if (responseJson.success) {
            dispatch(fetchUserDataFulfilled(responseJson.result.record));
            return;
        }

        throw Error();
    } catch (e) {
        dispatch(fetchUserDataRejected());
        throw Error();
    }
};

const fetchUserDataFulfilled = (userData) => (dispatch) => {
    dispatch({
        type: FETCH_USER_DATA_FULFILLED,
        payload: userData
    })
}

const fetchUserDataRejected = () => (dispatch) => {
    dispatch({
        type: FETCH_USER_DATA_REJECTED
    })
}