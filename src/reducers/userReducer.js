import {
    FETCH_USER_DATA,
    FETCH_USER_DATA_FULFILLED,
    FETCH_USER_DATA_REJECTED
} from '../actions/types';

const initialState = {
    userData: null,
    loading: false
};

export default (state = initialState, action) => {
    switch (action.type) {

        case FETCH_USER_DATA:
            return { ...initialState, loading: true };

        case FETCH_USER_DATA_FULFILLED: {
            return { ...state, userData: action.payload, loading: false }
        }

        case FETCH_USER_DATA_REJECTED: {
            return { ...state, loading: false }
        }

        default:
            return state;
    }
};
