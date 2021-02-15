import { Alert } from 'react-native';
import {
  DIMENSION_CHANGED, UPDATE_MGR,
  SHOW_SEARCH, DRAWER_BUTTON_SELECTED,
  UPDATE_SEARCH_MODULE, MODULE_SELECT,
  SHOW_HOME, REFERENCE_LABEL, SAVE_SUCCESS,
} from './types';
import { RECORD_ADDER, HOME_MAIN, RECORD_VIEWER } from '../variables/constants';
import {
  getInstancesList, renderDrawerView, fetchRecordHelper, fetchRefRecordHelper, viewRecord,
  viewRecordRenderer, deleteRecordHelper, refreshRefRecordHelper,
  refreshRecordDataHelper, getNextRefPageHelper, getAddressDetails
} from '../helper';

export const dimensionChanged = (isPortrait, width, height) => ({
  type: DIMENSION_CHANGED,
  payload: { isPortrait, width, height }
});

export const loginUser = (email, password, url, navigation, loginInstance) => (dispatch) => {
  if (validData(email, password, url)) {
    loginInstance.setState({ loading: true });
    getInstancesList(email, password, url, navigation, loginInstance, dispatch);
  }
};

export const tabletSearchBackPress = () => ({
  type: SHOW_HOME,
  payload: HOME_MAIN
});

export const drawerButtonPress = (buttonType, moduleLable, moduleId) => (dispatch) => {
  dispatch({ type: DRAWER_BUTTON_SELECTED, payload: { buttonType, moduleLable, moduleId } });
  dispatch({ type: UPDATE_MGR, payload: HOME_MAIN });
};

// export const openMenu = ()

const validData = (username, password, url) => {
  if (username.replace(/ /g, '') === '' ||
    password.replace(/ /g, '') === '') {
    Alert.alert('Empty fields', 'Please fill all the fields',
      [
        { text: 'Ok', onPress: () => { } },
      ],
      { cancelable: true }
    );
  } else {
    return true;
  }
};

export const getDrawerViews = (loginDetails, drawerInstance) => {
  drawerInstance.setState({ loading: true });
  renderDrawerView(loginDetails, drawerInstance);
};

export const fetchRecord = (recordListerInstance, moduleName) => (dispatch) => {
  fetchRecordHelper(recordListerInstance, dispatch, false, false, moduleName);
};

export const refreshRecord = (recordListerInstance, moduleName) => (dispatch) => {
  fetchRecordHelper(recordListerInstance, dispatch, true, false, moduleName);
};

export const getNextPageRecord = (recordListerInstance, moduleName) => (dispatch) => {
  fetchRecordHelper(recordListerInstance, dispatch, false, true, moduleName);
};

export const fetchRefRecord = (recordListerInstance) => (dispatch) => {
  fetchRefRecordHelper(recordListerInstance, dispatch);
};

export const refreshRefRecord = (recordListerInstance) => (dispatch) => {
  refreshRefRecordHelper(recordListerInstance, dispatch);
};

export const getNextRefPageRecord = (recordListerInstance) => (dispatch) => {
  getNextRefPageHelper(recordListerInstance, dispatch);
};

export const refreshRecordData = (recordViewerInstance) => (dispatch) => {
  refreshRecordDataHelper(recordViewerInstance, dispatch);
};

export const viewRecordAction = (recordId, listerInstance) => (dispatch) => {
  dispatch({ type: UPDATE_MGR, payload: RECORD_VIEWER });
  viewRecord(recordId, listerInstance, dispatch);
};

export const viewSearchAction = (moduleName) => ({
  type: SHOW_SEARCH,
  payload: moduleName
});

export const updateSearchModule = (moduleName) => ({
  type: UPDATE_SEARCH_MODULE,
  payload: moduleName
});

export const viewRecordRendererActions = (viewerInstance) => (dispatch) => {
  viewRecordRenderer(viewerInstance, dispatch);
};

export const deleteRecord = (listerInstance, recordId, index, callback) => (dispatch) => {
  deleteRecordHelper(listerInstance, recordId, index, callback, dispatch);
};

export const moduleSelected = (text) => ({
  type: MODULE_SELECT,
  payload: text
});

export const dashboardFetchRecord = (viewerInstance, moduleName) => (dispatch) => {
  fetchRecordHelper(viewerInstance, dispatch, false, false, moduleName, true);
};

export const dashboardRefreshRecord = (viewerInstance, moduleName) => (dispatch) => {
  fetchRecordHelper(viewerInstance, dispatch, true, false, moduleName, true);
};


export const markReferenceLabel = (recordId, label, uniqueId) => (dispatch) => {
  dispatch({ type: REFERENCE_LABEL, payload: { recordId, label, uniqueId } });
};

export const saveSuccess = (saved) => (dispatch) => {
  dispatch({ type: SAVE_SUCCESS, payload: saved });
};

// export const copyAddressAction = (referenceInstance) => (dispatch) => {
//   getAddressDetails(referenceInstance, dispatch);
// };

// export const copyContactAddress = (contactAddress) => (dispatch) => {

//   dispatch({ type: COPY_CONTACT_ADDRESS, payload: contactAddress });
// };

// export const copyOrganisationAddress = (organisationAddress) => (dispatch) => {
//   dispatch({ type: COPY_ORGANISATION_ADDRESS, payload: organisationAddress });
// };
