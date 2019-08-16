import { DIMENSION_CHANGED } from '../actions/types';

const INITIAL_STATE = 
{ isPortrait: true, width: 0, height: 0 };

export default (state = INITIAL_STATE, action) => {
    //console.log(action);
    switch (action.type) {
        case DIMENSION_CHANGED:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};
