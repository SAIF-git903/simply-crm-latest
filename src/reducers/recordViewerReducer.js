import {
  UPDATE_RECORD_VIEWER,
  REFERENCE_LABEL,
  SAVE_SUCCESS,
  COPY_CONTACT_ADDRESS,
  COPY_ORGANISATION_ADDRESS,
} from '../actions/types';

const INITIAL_STATE = {
  navigation: {},
  moduleName: '',
  showBackButton: false,
  moduleLable: '',
  recordId: '',
  label: '',
  uniqueId: '',
  saved: '',
  contactAddress: [],
  organisationAddress: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_RECORD_VIEWER:
      return {
        ...state,
        navigation: action.payload.navigation,
        moduleName: action.payload.moduleName,
        showBackButton: action.payload.showBackButton,
        moduleLable: action.payload.moduleLable,
        recordId: action.payload.recordId,
      };
    case REFERENCE_LABEL:
      return {
        ...state,
        label: action.payload.label,
        recordId: action.payload.recordId,
        uniqueId: action.payload.uniqueId,
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        label: '',
        recordId: action.payload.recordId,
        uniqueId: '',
        saved: action.payload.saved,
        contactAddress: [],
        organisationAddress: [],
      };
    case COPY_CONTACT_ADDRESS:
      return {
        ...state,
        contactAddress: action.payload.contactAddress,
      };
    case COPY_ORGANISATION_ADDRESS:
      return {
        ...state,
        organisationAddress: action.payload.organisationAddress,
      };
    default:
      return state;
  }
};
