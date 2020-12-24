import {
    describeModule,
    fetchRecordHistory
} from '../helper/api';

const FETCH_HISTORY = 'updates/FETCH_HISTORY';
const FETCH_HISTORY_FULFILLED = 'updates/FETCH_HISTORY_FULFILLED';
const FETCH_HISTORY_REJECTED = 'updates/FETCH_HISTORY_REJECTED';

const initialState = {
    fields: [],
    history: [],
    isLoading: false
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case FETCH_HISTORY:
            return {
                ...(action.payload ? state : initialState),
                isLoading: true
            };

        case FETCH_HISTORY_FULFILLED:
            const { fields, history } = action.payload;

            return {
                ...state,
                history,
                fields,
                isLoading: false
            };

        case FETCH_HISTORY_REJECTED:
            return {
                ...initialState
            };

        default:
            return state;
    }
}

export const fetchHistory = (moduleName, recordId, keepState) => async (dispatch) => {
    const fetchHistoryFulfilled = (payload) => {
        return ({
            type: FETCH_HISTORY_FULFILLED,
            payload
        })
    };

    const fetchHistoryRejected = () => {
        return ({
            type: FETCH_HISTORY_REJECTED
        })
    };

    dispatch({
        type: FETCH_HISTORY,
        payload: keepState
    });

    try {
        const describeResponse = await describeModule(moduleName);
        if (!describeResponse.success) {
            throw Error(`Failed to call describe method on ${moduleName}`);
        }

        const historyResponse = await fetchRecordHistory(moduleName, recordId);
        if (!historyResponse.success) {
            throw Error(`Failed to fetch history of ${moduleName}`);
        }

        dispatch(fetchHistoryFulfilled({
            fields: describeResponse.result.describe.fields,
            history: historyResponse.result.history
        }));
    } catch (e) {
        console.log(e);
        dispatch(fetchHistoryRejected());
    }
};