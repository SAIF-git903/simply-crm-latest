import { DRAWER_BUTTON_SELECTED } from '../actions/types';
import { HOME } from '../variables/constants';

const INITIAL_STATE = 
{ selectedButton: HOME, moduleId: '', moduleLable: '' };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DRAWER_BUTTON_SELECTED:
            return { 
                ...state, 
                selectedButton: action.payload.buttonType, 
                moduleId: action.payload.moduleId,
                moduleLable: action.payload.moduleLable
            };
        default:     
            return state;
    }
};
