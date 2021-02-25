import {
    FETCH_USER_DATA,
    FETCH_USER_DATA_FULFILLED,
    FETCH_USER_DATA_REJECTED
} from './types';
import { API_fetchRecord } from "../helper/api";

export const fetchUserData = (loginDetails) => async (dispatch) => {
    dispatch({ type: FETCH_USER_DATA });

    try {
        const responseJson = await API_fetchRecord(
            {
                record: '19x' + loginDetails.userId,
                session: loginDetails.session
            },
            `${loginDetails.url}/modules/Mobile/api.php`
        );
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
    });
}

const fetchUserDataRejected = () => (dispatch) => {
    dispatch({
        type: FETCH_USER_DATA_REJECTED
    });
}