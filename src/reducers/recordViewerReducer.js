import { UPDATE_RECORD_VIEWER, REFERENCE_LABEL, SAVE_SUCCESS } from '../actions/types';

const INITIAL_STATE = 
{ navigation: {}, 
  moduleName: '', 
  showBackButton: false,
  moduleLable: '', 
  recordId: '',
  label: '',
  uniqueId: '',
  saved: '' };

export default (state = INITIAL_STATE, action) => {
    //console.log(action);
    switch (action.type) {
        case UPDATE_RECORD_VIEWER:
            return { 
                ...state, 
                navigation: action.payload.navigation,
                moduleName: action.payload.moduleName,
                showBackButton: action.payload.showBackButton,
                moduleLable: action.payload.moduleLable,
                recordId: action.payload.recordId };
        case REFERENCE_LABEL:
            return { 
                ...state, 
                label: action.payload.label,
                recordId: action.payload.recordId,
                uniqueId: action.payload.uniqueId };
        case SAVE_SUCCESS:
            return { 
                ...state, 
                label: '',
                recordId: '',
                uniqueId: '',
                saved: action.payload };
        default:
            return state;
    }
};
