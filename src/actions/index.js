import {Alert} from 'react-native';
import {
  DIMENSION_CHANGED,
  UPDATE_MGR,
  SHOW_SEARCH,
  DRAWER_BUTTON_SELECTED,
  UPDATE_SEARCH_MODULE,
  MODULE_SELECT,
  SHOW_HOME,
  REFERENCE_LABEL,
  SAVE_SUCCESS,
} from './types';
import {HOME_MAIN, RECORD_VIEWER} from '../variables/constants';
import {
  getInstancesList,
  renderDrawerView,
  fetchRecordHelper,
  viewRecord,
  fetchRecordDataHelper,
  deleteRecordHelper,
  getAddressDetails,
} from '../helper';

export const dimensionChanged = (isPortrait, width, height) => ({
  type: DIMENSION_CHANGED,
  payload: {isPortrait, width, height},
});

export const loginUser =
  (email, password, url, navigation, loginInstance) => (dispatch) => {
    if (validData(email, password, url)) {
      loginInstance.setState({loading: true});
      getInstancesList(
        email,
        password,
        url,
        navigation,
        loginInstance,
        dispatch,
      );
    }
  };

export const tabletSearchBackPress = () => ({
  type: SHOW_HOME,
  payload: HOME_MAIN,
});

export const drawerButtonPress =
  (buttonType, moduleLable, moduleId) => (dispatch) => {
    dispatch({
      type: DRAWER_BUTTON_SELECTED,
      payload: {buttonType, moduleLable, moduleId},
    });
    dispatch({type: UPDATE_MGR, payload: HOME_MAIN});
  };

// export const openMenu = ()

const validData = (username, password, url) => {
  if (username.replace(/ /g, '') === '' || password.replace(/ /g, '') === '') {
    Alert.alert(
      'Empty fields',
      'Please fill all the fields',
      [{text: 'Ok', onPress: () => {}}],
      {cancelable: true},
    );
  } else {
    return true;
  }
};

export const getDrawerViews = (loginDetails, drawerInstance) => {
  drawerInstance.setState({loading: true});
  renderDrawerView(loginDetails, drawerInstance);
};

//RecordLister
export const fetchRecord = (recordListerInstance, moduleName) => (dispatch) => {
  fetchRecordHelper(recordListerInstance, dispatch, false, moduleName);
};
export const refreshRecord =
  (recordListerInstance, moduleName) => (dispatch) => {
    fetchRecordHelper(recordListerInstance, dispatch, false, moduleName);
  };
export const getNextPageRecord =
  (recordListerInstance, moduleName) => (dispatch) => {
    fetchRecordHelper(recordListerInstance, dispatch, true, moduleName);
  };

//RefRecordLister
export const fetchRefRecord =
  (recordListerInstance, moduleName) => (dispatch) => {
    fetchRecordHelper(recordListerInstance, dispatch, false, moduleName);
  };
export const refreshRefRecord =
  (recordListerInstance, moduleName) => (dispatch) => {
    fetchRecordHelper(recordListerInstance, dispatch, false, moduleName);
  };
export const getNextRefPageRecord =
  (recordListerInstance, moduleName) => (dispatch) => {
    fetchRecordHelper(recordListerInstance, dispatch, true, moduleName);
  };

//dashboardLister
export const dashboardFetchRecord =
  (viewerInstance, moduleName) => (dispatch) => {
    fetchRecordHelper(viewerInstance, dispatch, false, moduleName, true);
  };
export const dashboardRefreshRecord =
  (viewerInstance, moduleName) => (dispatch) => {
    fetchRecordHelper(viewerInstance, dispatch, false, moduleName, true);
  };

export const viewRecordAction =
  (recordId, selectedIndex, listerInstance) => (dispatch) => {
    dispatch({type: UPDATE_MGR, payload: RECORD_VIEWER});
    viewRecord(recordId, selectedIndex, listerInstance, dispatch);
  };

export const viewSearchAction = (moduleName) => ({
  type: SHOW_SEARCH,
  payload: moduleName,
});

export const updateSearchModule = (moduleName) => ({
  type: UPDATE_SEARCH_MODULE,
  payload: moduleName,
});

export const fetchRecordData = (viewerInstance) => (dispatch) => {
  fetchRecordDataHelper(viewerInstance, dispatch);
};

export const refreshRecordData = (recordViewerInstance) => (dispatch) => {
  fetchRecordDataHelper(recordViewerInstance, dispatch);
};

export const deleteRecord =
  (listerInstance, recordId, index, callback) => (dispatch) => {
    deleteRecordHelper(listerInstance, recordId, index, callback, dispatch);
  };

export const moduleSelected = (text) => ({
  type: MODULE_SELECT,
  payload: text,
});

export const markReferenceLabel = (recordId, label, uniqueId) => (dispatch) => {
  dispatch({type: REFERENCE_LABEL, payload: {recordId, label, uniqueId}});
};

export const saveSuccess = (saved, recordId) => (dispatch) => {
  dispatch({type: SAVE_SUCCESS, payload: {saved, recordId}});
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
export const passValue = (data) => (dispatch) => {
  dispatch({type: 'PASS_VALUE', payload: data});
};
