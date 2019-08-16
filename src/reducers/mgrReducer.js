import { UPDATE_MGR, SHOW_SEARCH, UPDATE_SEARCH_MODULE, SHOW_HOME } from '../actions/types';
import { HOME_MAIN, SEARCH_COMPONENT } from '../variables/constants';

const INITIAL_STATE = 
{ mgrComponentToShow: '', ltrComponentToShow: HOME_MAIN, searchModuleName: '' };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_MGR:
            return { ...state, mgrComponentToShow: action.payload };
        case SHOW_HOME: 
            return { ...state, ltrComponentToShow: HOME_MAIN };
        case SHOW_SEARCH:
            return { ...state, ltrComponentToShow: SEARCH_COMPONENT, searchModuleName: action.payload };
        case UPDATE_SEARCH_MODULE:
            return { ...state, searchModuleName: action.payload };
        default:
            return state;
    }
};
