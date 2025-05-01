import store from '../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {LOGINDETAILSKEY} from '../../variables/strings';
import {addDatabaseKey, removeAllDatabase} from '../DatabaseKeyHelper';
import {LOGIN_USER_SUCCESS} from '../../actions/types';
import moment from 'moment';
import {defaultFilterId, isSession, passField, sortField} from '../../actions';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import {
  getCurrentRouteName,
  navigationRef,
  reset,
} from '../../NavigationService';
import {Alert} from 'react-native';
import axios from 'axios';

let alertShown = false;
let count = 0;
let maxtimeout = 14000;
let mintimeout = 7000;

async function makeCall(body, request_url, headers, method = 'POST') {
  const {
    auth: {loginDetails: loginDetails},
  } = store.getState();
  const {session, url} = loginDetails;

  if (request_url === undefined) {
    request_url = `${url}/modules/Mobile/api.php`;
  }
  if (headers === undefined) {
    headers = {
      'cache-control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  const body_data = {
    _session: body._session ? body._session : session,
    _operation: body._operation,
    username: body.username,
    password: body.password,
    module: body.module,
    relatedmodule: body.relatedModule,
    record: body.record,
    ids: JSON.stringify(body.ids),
    query: body.query,
    msgraph_access_token: body.msgraph_access_token,
    // values: body.values && JSON.parse(body.values),
    values: body.values,
    parentRecord: body.parentRecord,
    parentModule: body.parentModule,
    // parent_id: body.parent_id,
    files: body.files,
    page: body.page,
    specialFields:
      body.specialFields !== undefined && body.specialFields.length > 0
        ? JSON.stringify(body.specialFields)
        : undefined,
    limit: body.limit,
    searchText: body.searchText !== '' ? body.searchText : undefined,
    filterid: body.filterid !== '' ? body.filterid : undefined,
    orderBy: body.orderBy !== '' ? body.orderBy : undefined,
    sortOrder: body.sortOrder !== '' ? body.sortOrder : undefined,
    mode: body.mode,
    deviceid: body.deviceid,
    devicename: body.devicename,
    url: body.url,
    networktype: body.networktype,
  };
  console.log('body_data', body_data);
  //clear undefined
  for (const [key, value] of Object.entries(body_data)) {
    if (value === undefined) {
      delete body_data[key];
    }
  }

  let responseJson = await doFetch(request_url, method, headers, body_data);

  // console.log('responseJson.error.code');
  // console.log(responseJson?.error?.code);
  //TODO check me
  if (
    responseJson.error !== undefined &&
    responseJson.error.code !== undefined &&
    parseInt(responseJson.error.code, 10) === 1501
  ) {
    const newResponseJson = await API_loginAndFetchModules(
      loginDetails.url,
      loginDetails.username,
      loginDetails.password,
    );
    if (newResponseJson.success) {
      let vtiger_version =
        newResponseJson.result.login?.vtiger_version?.charAt(0);
      let simply_version =
        newResponseJson.result.login?.simply_version?.charAt(0);
      let new_version = null;
      if (
        (vtiger_version != null && vtiger_version !== undefined) ||
        (simply_version !== null && simply_version !== undefined)
      ) {
        if (vtiger_version) {
          new_version = vtiger_version;
        } else {
          new_version = simply_version;
        }
      }

      //TODO combine with LoginHelper.js ??
      const newLoginDetails = {
        username: loginDetails.username,
        password: loginDetails.password,
        url: loginDetails.url,
        session: newResponseJson.result.login.session,
        userTz: newResponseJson.result.login.user_tz,
        crmTz: newResponseJson.result.login.crm_tz,
        vtigerVersion: new_version,
        dateFormat: newResponseJson.result.login.date_format,
        modules: newResponseJson.result.modules,
        menu: newResponseJson.result.menu,
        userId: newResponseJson.result.login.userid,
        isAdmin: newResponseJson.result.login.isAdmin,
      };
      //TODO check me
      console.log('before update session');
      AsyncStorage.setItem(LOGINDETAILSKEY, JSON.stringify(newLoginDetails));
      await addDatabaseKey(LOGINDETAILSKEY);
      await store.dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: newLoginDetails,
      });
      console.log('after update session');

      body_data._session = newLoginDetails.session;
      responseJson = await doFetch(request_url, method, headers, body_data);
    } else {
      //TODO check me
      throw new Error('Cant get new session. Please re login');
    }
  }

  return responseJson;
}

async function makeCallforFileUpload(
  body,
  request_url,
  headers,
  method = 'POST',
) {
  const {
    auth: {loginDetails: loginDetails},
  } = store.getState();
  const {session, url} = loginDetails;

  if (request_url === undefined) {
    request_url = `${url}/modules/Mobile/api.php`;
  }
  if (headers === undefined) {
    headers = {
      'cache-control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    };
  }

  const body_data = {
    _session: body._session ? body._session : session,
    _operation: body._operation,
    username: body.username,
    password: body.password,
    module: body.module,
    relatedmodule: body.relatedModule,
    record: body.record,
    ids: JSON.stringify(body.ids),
    query: body.query,
    values: JSON.stringify(body.values),
    parentRecord: body.parentRecord,
    parentModule: body.parentModule,
    files: body.files,
    page: body.page,
    specialFields:
      body.specialFields !== undefined && body.specialFields.length > 0
        ? JSON.stringify(body.specialFields)
        : undefined,
    limit: body.limit,
    searchText: body.searchText !== '' ? body.searchText : undefined,
    filterid: body.filterid !== '' ? body.filterid : undefined,
    orderBy: body.orderBy !== '' ? body.orderBy : undefined,
    sortOrder: body.sortOrder !== '' ? body.sortOrder : undefined,
  };

  //clear undefined
  for (const [key, value] of Object.entries(body_data)) {
    if (value === undefined) {
      delete body_data[key];
    }
  }

  const convertJsonToFormData = (json) => {
    const formData = new FormData();

    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        formData.append(key, json[key]);
      }
    }

    return formData;
  };

  const formData = convertJsonToFormData(body_data);

  let responseJson = await doFetchForFileUpload(
    request_url,
    method,
    headers,
    formData,
  );

  // console.log('responseJson.error.code');
  // console.log(responseJson?.error?.code);
  //TODO check me
  if (
    responseJson.error !== undefined &&
    responseJson.error.code !== undefined &&
    parseInt(responseJson.error.code, 10) === 1501
  ) {
    const newResponseJson = await API_loginAndFetchModules(
      loginDetails.url,
      loginDetails.username,
      loginDetails.password,
    );
    if (newResponseJson.success) {
      let vtiger_version =
        newResponseJson.result.login?.vtiger_version?.charAt(0);
      let simply_version =
        newResponseJson.result.login?.simply_version?.charAt(0);
      let new_version = null;
      if (
        (vtiger_version != null && vtiger_version !== undefined) ||
        (simply_version !== null && simply_version !== undefined)
      ) {
        if (vtiger_version) {
          new_version = vtiger_version;
        } else {
          new_version = simply_version;
        }
      }

      //TODO combine with LoginHelper.js ??
      const newLoginDetails = {
        username: loginDetails?.username,
        password: loginDetails?.password,
        url: loginDetails?.url,
        session: newResponseJson?.result?.login?.session,
        userTz: newResponseJson?.result?.login?.user_tz,
        crmTz: newResponseJson?.result?.login?.crm_tz,
        vtigerVersion: new_version,
        dateFormat: newResponseJson?.result?.login?.date_format,
        modules: newResponseJson?.result?.modules,
        menu: newResponseJson?.result?.menu,
        mobileapp_settings: newResponseJson?.result?.mobileapp_settings,
        userId: newResponseJson?.result?.login?.userid,
        isAdmin: newResponseJson?.result?.login?.isAdmin,
      };
      //TODO check me
      console.log('before update session');
      AsyncStorage.setItem(LOGINDETAILSKEY, JSON.stringify(newLoginDetails));
      await addDatabaseKey(LOGINDETAILSKEY);
      await store.dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: newLoginDetails,
      });
      console.log('after update session');

      body_data._session = newLoginDetails.session;
      responseJson = await doFetch(request_url, method, headers, body_data);
    } else {
      //TODO check me
      throw new Error('Cant get new session. Please re login');
    }
  }

  return responseJson;
}

async function doFetchForFileUpload(request_url, method, headers, body_data) {
  console.log(`### ${method} API CALL ###: ${request_url}`);
  console.log('-->', body_data);
  const response = await fetch(request_url, {
    method: method,
    headers: headers,
    body: method === 'POST' ? body_data : null,
  });
  //if fetch() will rejected, then error will thrown
  //if fetch() will resolved, then 'response' will be filled with response data
  let responseJson = await response.json().catch(function (error) {
    console.log('JSON parse failed on:');
    console.log('response', response);
    throw error;
  });
  console.log('responseJson-->', responseJson);

  if (responseJson?.result?.headers) {
    try {
      const jsonValue = JSON.stringify(responseJson?.result?.headers);
      await AsyncStorage.setItem('fields', jsonValue);
    } catch (error) {
      console.log('err', error);
    }
  }

  if (responseJson?.result?.nameFields?.length > 0) {
    store.dispatch(passField(responseJson?.result?.nameFields));
  }

  return responseJson;
}

// async function doFetch(request_url, method, headers, body_data) {
//   console.log(`### ${method} API CALL ###: ${request_url}`);
//   console.log(body_data);
//   const response = await fetch(request_url, {
//     method: method,
//     headers: headers,
//     body: method === 'POST' ? JSON.stringify(body_data) : null,
//   });

//   //if fetch() will rejected, then error will thrown
//   //if fetch() will resolved, then 'response' will be filled with response data
//   let responseJson = await response.json().catch(function (error) {
//     console.log('JSON parse failed on:');
//     console.log('response', response);
//     throw error;
//   });
//   console.log('responseJson---->', responseJson);

//   if (responseJson?.result?.describe?.defaultFilterId) {
//     store.dispatch(
//       defaultFilterId(responseJson?.result?.describe?.defaultFilterId),
//     );
//   }

//   if (responseJson?.result?.headers) {
//     store.dispatch(sortField(responseJson?.result?.headers));
//     try {
//       const jsonValue = JSON.stringify(responseJson?.result?.headers);
//       await AsyncStorage.setItem('fields', jsonValue);
//     } catch (error) {
//       console.log('err', error);
//     }
//   }

//   if (responseJson?.result?.nameFields?.length > 0) {
//     store.dispatch(passField(responseJson?.result?.nameFields));
//   }

//   return responseJson;
// }

async function doFetch(request_url, method, headers, body_data) {
  console.log(`### ${method} API CALL ###: ${request_url}`);
  console.log(body_data);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), maxtimeout); // 7-second timeout

  try {
    const timeoutValue = moment();
    const response = await Promise.race([
      fetch(request_url, {
        method: method,
        headers: headers,
        body: method === 'POST' ? JSON.stringify(body_data) : null,
        signal: controller.signal,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), maxtimeout),
      ),
    ]);

    clearTimeout(timeoutId);

    // console.log("header", response.headers.get('date'))
    // const timeoutValue = response.headers.get('date');

    const targetDate = moment(timeoutValue);
    const currentDate = moment();
    const timeout = currentDate.diff(targetDate, 'milliseconds');

    if (timeout >= mintimeout && timeout < maxtimeout) {
      Toast.show('This is taking a little longer than usual, retrying');
    }
    // **Persist API logs across requests**

    let responseJson = await response.json().catch((error) => {
      console.log('JSON parse failed on:', response);
      throw error;
    });

    let requestLog = JSON.parse(await AsyncStorage.getItem('requestLog')) || [];

    // Ensure we don't exceed 25 records
    if (requestLog.length >= 25) {
      requestLog.shift(); // Remove the oldest record (first element)
    }

    // Parse response JSON safely
    // let parsedResponse =
    //   typeof responseJson === 'string'
    //     ? JSON.parse(responseJson)
    //     : responseJson;

    // Mask sensitive fields if they exist
    // if (parsedResponse?.result?.record) {
    //   if ('user_password' in parsedResponse.result.record) {
    //     parsedResponse.result.record.user_password = '*****';
    //   }
    //   if ('confirm_password' in parsedResponse.result.record) {
    //     parsedResponse.result.record.confirm_password = '*****';
    //   }
    // }

    requestLog.push({
      operation: body_data?._operation,
      bodyData: JSON.stringify(body_data),
      requesturl: request_url,
      method: method,
      status: response?.status,
      time: new Date().toISOString(),
      responseJson: JSON.stringify(responseJson),
    });
    await AsyncStorage.setItem('requestLog', JSON.stringify(requestLog));

    console.log('responseJson---->', responseJson);

    if (responseJson?.result?.describe?.defaultFilterId) {
      store.dispatch(
        defaultFilterId(responseJson?.result?.describe?.defaultFilterId),
      );
    }

    if (responseJson?.result?.headers) {
      store.dispatch(sortField(responseJson?.result?.headers));
      try {
        const jsonValue = JSON.stringify(responseJson?.result?.headers);
        await AsyncStorage.setItem('fields', jsonValue);
      } catch (error) {
        console.log('err', error);
      }
    }

    if (responseJson?.result?.nameFields?.length > 0) {
      store.dispatch(passField(responseJson?.result?.nameFields));
    }
    return responseJson;
  } catch (error) {
    console.log('Fetch error:', error?.message);

    if (error?.message === 'Request timed out') {
      if (!alertShown) {
        alertShown = true;
        Alert.alert('Session Expired', 'Try again.', [
          {
            text: 'Retry',
            onPress: () => {
              alertShown = false;
              store.dispatch(isSession(true));
              API_DebugApp();
              // reset([{name: 'Login'}]);
            },
          },
        ]);
      }
      // await AsyncStorage.removeItem('fields');
      // await AsyncStorage.removeItem('UID');
      // removeAllDatabase();
    }
  }
  throw error;
  // }
}

export function API_locateInstance(email, password) {
  const en_email = encodeURIComponent(email);
  const en_password = encodeURIComponent(password);
  return makeCall(
    {},
    `https://sai.simplyhq.com/index.php?action=LocateInstance&email=${en_email}&password=${en_password}&api_key=jNuaPq7MRfLDvnLs5gZ9XgU1H7n3URma`,
    {
      'cache-control': 'no-cache',
    },
    'GET',
  );
}
export function API_locateInstanceformslogin(email, token) {
  const en_email = encodeURIComponent(email);
  const en_password = 'xxxx';
  return makeCall(
    {},
    `https://sai.simplyhq.com/outlookplugin.php?action=LocateInstance&email=${en_email}&password=${en_password}&api_key=GFaAX9WDxqHfqVmkrsq3QvpsDmMu4KZd&msgraph_access_token=${token}`,
    {
      'cache-control': 'no-cache',
    },
    'GET',
  );
}

export function API_loginAndFetchModules(trimmedUrl, username, password) {
  return makeCall(
    {
      _operation: 'loginAndFetchModules',
      username,
      password,
    },
    `${trimmedUrl}/modules/Mobile/api.php`,
  );
}
export function API_loginAndFetchModulesforMSlogin(
  trimmedUrl,
  username,
  msgraph_access_token,
) {
  return makeCall(
    {
      _operation: 'loginAndFetchModules',
      username,
      msgraph_access_token,
    },
    `${trimmedUrl}/modules/Mobile/api.php`,
  );
}

export function API_forgotPassword(email) {
  return makeCall(
    {},
    `https://sai.simplyhq.com/index.php?action=AppForgotPassword&email=${email}&api_key=jNuaPq7MRfLDvnLs5gZ9XgU1H7n3URma`,
    {
      'cache-control': 'no-cache',
    },
    'GET',
  );
}

export function API_listModuleRecords(
  module,
  page,
  specialFields,
  limit,
  searchText,
  filterid,
  orderBy,
  sortOrder,
) {
  if (module === 'Users') {
    return makeCall({
      _operation: 'listModuleRecords',
      module,
      // page: page ? page : 1,
      // limit: limit ? limit : 25,
      specialFields,
      // searchText,
      // filterid,
      orderBy,
      sortOrder,
    });
  } else {
    return makeCall({
      _operation: 'listModuleRecords',
      module,
      page: page ? page : 1,
      limit: limit ? limit : 25,
      specialFields,
      searchText,
      filterid,
      orderBy,
      sortOrder,
    });
  }
}

export function API_describe(module) {
  return makeCall({
    _operation: 'describe',
    module,
  });
}

export function API_structure(module) {
  return makeCall({
    _operation: 'structure',
    module,
  });
}

export function API_fetchRecord(body, request_url) {
  body._operation = 'fetchRecord';
  //TODO get only editable fields (displaytype = 2) for module on backend in fetchRecord function
  body.page = body.page ? body.page : 1;
  body.limit = body.limit ? body.limit : 25;
  body._session = body.session;
  return makeCall(body, request_url);
}

export function API_history(module, record) {
  let {auth} = store.getState();
  let isAdminMode = auth?.loginDetails?.isAdmin === true ? '' : '';
  return makeCall({
    _operation: 'history',
    module,
    record,
    mode: isAdminMode,
  });
}

export function API_fetchRecordWithGrouping(module, record) {
  return makeCall({
    _operation: 'fetchRecordWithGrouping',
    module,
    record,
  });
}

export function API_fetchRecordsWithGrouping(module, ids) {
  return makeCall({
    _operation: 'fetchRecordsWithGrouping',
    module,
    ids,
  });
}

export function API_deleteRecord(module, record) {
  return makeCall({
    _operation: 'deleteRecords',
    module,
    record,
  });
}

export function API_fetchComments(record) {
  return makeCall({
    _operation: 'relatedRecordsWithGrouping',
    record,
    relatedModule: 'ModComments',
  });
}

export function API_saveRecord(
  module,
  values,
  record,
  parentRecord,
  parentModule,
  // parentId,
) {
  // parentRecord: parentRecord
  // ? `{[record:${parentRecord}, relationLabel: ${parentModule}]}`
  // : parentRecord,
  return makeCall({
    _operation: 'saveRecord',
    module,
    values,
    record,
    parentRecord: parentRecord
      ? `[{record:${parentRecord}, relationLabel: ${parentModule}}]`
      : parentRecord,
    // parent_id: parentId ? parentId : '',
  });
}

export function API_query(query) {
  return makeCall({
    _operation: 'query',
    query,
  });
}

export async function API_trackCall(record) {
  try {
    const response = await makeCall({
      _operation: 'trackcall',
      record,
    });

    if (response) {
      console.log('Call tracked successfully.');
    } else {
      throw Error('Failed to track call.');
    }
  } catch (e) {
    console.log(e);
  }
}

export async function API_fetchFilters(trimmedUrl, module) {
  return makeCall(
    {
      _operation: 'fetchModuleFilters',
      module,
    },
    `${trimmedUrl}/modules/Mobile/api.php`,
  );
}

export async function API_fetchButtons(trimmedUrl, module) {
  return makeCall(
    {
      _operation: 'fetchButtons',
      module,
    },
    `${trimmedUrl}/modules/Mobile/api.php`,
  );
}
export async function API_saveFile(
  trimmedUrl,
  module,
  values,
  files,
  parentRecord,
  parentModule,
) {
  return makeCallforFileUpload(
    {
      _operation: 'saveFile',
      parentRecord,
      parentModule,
      module,
      values,
      files,
    },
    `${trimmedUrl}/modules/Mobile/api.php`,
  );
}
export function API_comman(record, module, relatedModule) {
  return makeCall({
    _operation: 'relatedRecordsWithGrouping',
    record,
    module,
    relatedModule,
  });
}
export function API_forfetchImageData(record) {
  return makeCall({
    record,
    module: 'Documents',
    _operation: 'downloadFile',
  });
}
export async function API_DebugApp() {
  const deviceId = DeviceInfo.getDeviceId();
  const deviceName = await DeviceInfo.getDeviceName();
  const {type} = await NetInfo.fetch();

  try {
    const {
      auth: {loginDetails},
    } = store.getState();
    const {url, password, username} = loginDetails;

    const request_url = `${url}/modules/Mobile/api.php`;
    console.log(`### API CALL ###: ${request_url}`);

    const headers = {
      'cache-control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const body = {
      _operation: 'debug',
      password: password || '',
      username: username || '',
      deviceid: deviceId,
      devicename: deviceName,
      networktype: type,
      message: 'the session was lost?',
    };

    const res = await axios.post(request_url, body, {headers});

    console.log('Debug API response:', res.data);
    return res.data;
  } catch (error) {
    console.log('Debug API Error:', error);
  }
}
