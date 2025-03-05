import React from 'react';
import Toast from 'react-native-simple-toast';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store';
import {UPDATE_RECORD_VIEWER} from '../actions/types';
import {
  CAMPAIGNS,
  VENDORS,
  FAQ,
  QUOTES,
  PURCHASEORDER,
  SALESORDER,
  INVOICE,
  PRICEBOOKS,
  CALENDAR,
  LEADS,
  ACCOUNTS,
  CONTACTS,
  OPPORTUNITIES,
  PRODUCTS,
  DOCUMENTS,
  TICKETS,
  PBXMANAGER,
  SERVICECONTRACTS,
  SERVICES,
  ASSETS,
  SMS_NOTIFIER,
  PROJECT_MILESTONE,
  PROJECT_TASK,
  MODULE_PROJECT,
  COMMENTS,
  CURRENCY,
  DOCUMENTFOLDERS,
  USERS,
  PARTICIPATION,
  CANDIDATES,
} from '../variables/constants';
import {addDatabaseKey} from '.';
import {fontStyles} from '../styles/common';
import {
  API_deleteRecord,
  API_listModuleRecords,
  API_listModuleRecordsbyFilter,
  API_query,
} from './api';
import RecordItem from '../components/recordLister/recordItem';
import ReferenceRecordItem from '../components/addRecords/referenceRecordLister/referenceRecordItem';
import {filterField} from '../actions';

const moment = require('moment-timezone');

const styles = StyleSheet.create({
  list: {
    margin: 5,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderRadius: 3,
    overflow: 'visible',
  },
  listWrapper: {
    marginTop: 10,
  },
  emptyList: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

const renderEmpty = () => {
  return (
    <View style={styles.emptyList}>
      <Text style={fontStyles.fieldLabel}>No records found.</Text>
    </View>
  );
};

export const fetchRecordHelper = async (
  listerInstance,
  dispatch,
  addExisting,
  moduleName,
  isDashboard = false,
) => {
  //First checking if any data in offline.
  try {
    // const offlineData = JSON.parse(await AsyncStorage.getItem(listerInstance.props.moduleName));
    // if (offlineData !== null) {
    //     console.log('offline data available');
    //     console.log(offlineData);
    //     //Offline data is avialable
    //     const offlineFinishedTime = JSON.parse(offlineData.finishedTime);
    //     const currentTime = moment();
    //     const duration = moment.duration(currentTime.diff(offlineFinishedTime));
    //     const durationMinutes = parseInt(duration.asMinutes(), 10);
    //     if (durationMinutes < 5) {
    //         //Show this is data itself
    //         listerInstance.setState({
    //             loading: false,
    //             statusText: 'Loading complete - Recently updated Pull to refresh',
    //             statusTextColor: '#000000',
    //             data: offlineData.records,
    //             nextPage: offlineData.nextPage,
    //             pageToTake: offlineData.pageToTake
    //         });
    //     } else {
    //         await getDataFromInternet(listerInstance, true, offlineData, dispatch);
    //     }
    // } else {
    //Offline data is not available
    await getDataFromInternet(
      listerInstance,
      false,
      {},
      dispatch,
      addExisting,
      isDashboard,
      moduleName,
    );
    // }
  } catch (error) {
    //Offline data is not available
    await getDataFromInternet(
      listerInstance,
      false,
      {},
      dispatch,
      addExisting,
      isDashboard,
    );
  }
};

export const viewRecord = async (
  recordId,
  selectedIndex,
  listerInstance,
  dispatch,
) => {
  const {event} = store.getState();
  const width = event.width;
  const isPortrait = event.isPortrait;
  if (isPortrait) {
    listerInstance.setState({selectedIndex: -1});
    dispatch({
      type: UPDATE_RECORD_VIEWER,
      payload: {
        navigation: listerInstance.props.navigation,
        moduleName: listerInstance.props.moduleName,
        showBackButton: true,
        moduleLable: listerInstance.props.moduleLable,
        recordId,
      },
    });
    listerInstance.props.navigation.navigate('Record Details', {
      listerInstance: listerInstance,
      index: selectedIndex,
      recordId: recordId,
    });
  } else {
    if (width > 600) {
      //It is a tablet
      if (isPortrait) {
        listerInstance.setState({selectedIndex: -1});
      }

      dispatch({
        type: UPDATE_RECORD_VIEWER,
        payload: {
          navigation: listerInstance.props.navigation,
          moduleName: listerInstance.props.moduleName,
          showBackButton: true,
          moduleLable: listerInstance.props.moduleLable,
          recordId,
        },
      });
    } else {
      //It is a phone open
      //console.log("Record viewer It is a phone");

      listerInstance.setState({selectedIndex: -1});
      dispatch({
        type: UPDATE_RECORD_VIEWER,
        payload: {
          navigation: listerInstance.props.navigation,
          moduleName: listerInstance.props.moduleName,
          showBackButton: true,
          moduleLable: listerInstance.props.moduleLable,
          recordId,
        },
      });
      listerInstance.props.navigation.navigate('Record Details');
    }
  }
};

const getDataFromInternet = async (
  listerInstance,
  offlineAvailable,
  offlineData,
  dispatch,
  addExisting,
  isDashboard,
  moduleName,
) => {
  //Getting data from internet
  try {
    const {auth} = store.getState();
    const loginDetails = auth.loginDetails;
    const vtigerSeven = loginDetails.vtigerVersion > 6;

    let modules = getAllowedModules();
    let [fields, specialFields] = getFieldsForModule(
      listerInstance.props.moduleName,
    );
    let specialFields_values = Object.values(specialFields);
    let searchText = listerInstance.state.searchText;
    let filterid = listerInstance.state.selectedFilter;
    let orderBy = listerInstance.state.orderBy;
    let sortOrder = listerInstance.state.sortOrder;
    let limit = isDashboard ? 5 : 25;

    let responseJson;
    if (!vtigerSeven) {
      let joinedFields = '*';
      if (modules.includes(listerInstance.props.moduleName)) {
        fields = Object.assign(fields, specialFields);
        joinedFields = 'id';
        if (Object.values(fields).length > 0) {
          joinedFields += ',' + Object.values(fields).join(',');
        }
      }

      let offset = (listerInstance.state.pageToTake - 1) * limit;
      responseJson = await API_query(
        `SELECT ${joinedFields} FROM ${listerInstance.props.moduleName} ORDER BY modifiedtime DESC LIMIT ${offset},${limit}`,
        searchText,
      );
      //TODO search will not work for vt6
    } else {
      //TODO 'listModuleRecords' have 500 http error code on getting Currency list (for Invoice and SalesOrder)
      if (listerInstance?.props?.moduleName) {
        responseJson = await API_listModuleRecords(
          listerInstance.props.moduleName,
          listerInstance.state.pageToTake,
          specialFields_values,
          limit,
          searchText,
          filterid,
          orderBy,
          sortOrder,
        );
      }
    }

    if (responseJson?.success) {
      await getAndSaveDataVtiger(
        responseJson,
        listerInstance,
        vtigerSeven,
        addExisting,
        moduleName,
      );
    } else {
      console.log('getDataFromInternet unsuccess response');
      console.log(responseJson);
      processError(listerInstance, offlineData, offlineAvailable, addExisting);
    }
  } catch (error) {
    console.log('getDataFromInternet error');
    console.log(error);
    processError(listerInstance, offlineData, offlineAvailable, addExisting);
  }
};

const processError = (
  listerInstance,
  offlineData,
  offlineAvailable,
  addExisting,
) => {
  let updState = {
    loading: false,
    isFlatListRefreshing: false,
    searching: false,
  };
  let searchText = listerInstance.state.searchText;
  if (searchText !== '') {
    updState.searchLabel = `An error occurred while searching "${searchText}"`;
  }
  if (addExisting) {
    let ptt = listerInstance.state.pageToTake - 1;
    updState.nextPage = true;
    updState.pageToTake = ptt > 0 ? ptt : 1;
  }
  if (!offlineAvailable) {
    //Show error to user that something went wrong.
    updState.statusText = 'Looks like no network connection';
    updState.statusTextColor = 'red';
  } else {
    //Show offline data and notify user
    updState.statusText = 'Showing Offline data - No internet Pull to refresh';
    updState.statusTextColor = '#000000';
    updState.data = offlineData.records;
    updState.nextPage = offlineData.nextPage;
    updState.pageToTake = offlineData.pageToTake;
  }
  listerInstance.setState(updState);
};

const getAndSaveDataVtiger = async (
  responseJson,
  listerInstance,
  vtigerSeven,
  addExisting,
  moduleName,
) => {
  let data;
  if (addExisting) {
    data = listerInstance.state.data;
  } else {
    data = [];
  }

  let records = responseJson.result.records;
  if (records === null) {
    records = [];
  }
  for (const record of records) {
    data.push(
      getListerModifiedRecord(
        listerInstance,
        vtigerSeven,
        responseJson,
        record,
      ),
    );
  }

  await saveDataToState(
    data,
    vtigerSeven,
    responseJson,
    addExisting,
    listerInstance.state.data.length,
    listerInstance,
    moduleName,
  );
};

function getListerModifiedRecord(
  listerInstance,
  vtigerSeven,
  responseJson,
  record,
) {
  let modifiedRecord = {};
  let modules = getAllowedModules();
  if (modules.includes(listerInstance.props.moduleName)) {
    let [fields, specialFields] = getFieldsForModule(
      listerInstance.props.moduleName,
    );
    fields = Object.assign(fields, specialFields);
    //at first - copy all get CRM values to object with needed keys
    for (const [fieldKey, fieldValue] of Object.entries(fields)) {
      modifiedRecord[fieldKey] = record[fieldValue];
    }

    //then specially change some fields for some modules
    switch (listerInstance.props.moduleName) {
      case INVOICE:
        modifiedRecord.invoiceAmount = Number(
          modifiedRecord.invoiceAmount,
        ).toFixed(2);
        break;
      case LEADS:
      // case CONTACTS:
      case CONTACTS:
        modifiedRecord.firstname = modifiedRecord.firstname;
        modifiedRecord.lastname = modifiedRecord.lastname;
        break;
      case USERS:
        modifiedRecord.label = modifiedRecord.firstname
          ? `${modifiedRecord.firstname} ${modifiedRecord.lastname}`
          : modifiedRecord.lastname;
        delete modifiedRecord.firstname;
        delete modifiedRecord.lastname;
        break;
      case OPPORTUNITIES:
        modifiedRecord.amount = Number(modifiedRecord.amount).toFixed(2);
        break;
      case PRODUCTS:
        modifiedRecord.qtyinstock = Number(modifiedRecord.qtyinstock).toFixed(
          2,
        );
        break;
      default:
        //if no change is required
        break;
    }
    if ([CALENDAR].includes(listerInstance.props.moduleName)) {
      //this case is not used because Calendar has its own component
      let ids = record.id.split('x');
      modifiedRecord.id = `${record.type === 'Task' ? '9' : '18'}x${ids[1]}`;
    } else {
      modifiedRecord.id = record.id;
    }
  } else {
    modifiedRecord = {
      lable: vtigerSeven
        ? record[responseJson.result.headers[0].name]
        : record.label,
      id: record.id,
    };
  }
  return modifiedRecord;
}

const saveDataToState = async (
  data,
  vtigerSeven,
  responseJson,
  addExisting,
  previousDataLength,
  listerInstance,
  moduleName,
) => {
  try {
    let offlineData;
    let statusText;

    if (data.length > 0) {
      // the array is defined and has at least one element
      statusText = 'Loading complete - Recently updated Pull to refresh';
      offlineData = {
        searchText: listerInstance.state.searchText,
        records: data,
        nextPage: vtigerSeven
          ? responseJson.result.moreRecords
          : responseJson.result.nextPage > 0,
        finishedTime: JSON.stringify(moment()),
        pageToTake: vtigerSeven
          ? parseInt(responseJson.result.page, 10)
          : responseJson.result.nextPage,
      };

      if (addExisting) {
        if (!previousDataLength > 300) {
          await AsyncStorage.setItem(
            listerInstance.props.moduleName,
            JSON.stringify(offlineData),
          );
          await addDatabaseKey(listerInstance.props.moduleName);

          statusText = 'Loading complete - Recently updated Pull to refresh';
        }
      } else {
        await AsyncStorage.setItem(
          listerInstance.props.moduleName,
          JSON.stringify(offlineData),
        );
        await addDatabaseKey(listerInstance.props.moduleName);
        statusText = 'Loading complete - Recently updated Pull to refresh';
      }
    } else {
      offlineData = {
        records: data,
        nextPage: false,
        finishedTime: JSON.stringify(moment()),
        pageToTake: 1,
      };
      statusText = 'Loading complete - Module is Empty';
    }
    let updState = {
      searching: false,
      isFlatListRefreshing: false,
      loading: false,
      statusText,
      statusTextColor: '#000000',
      data: offlineData.records,
      nextPage: offlineData.nextPage,
      pageToTake: offlineData.pageToTake,
    };
    //TODO state and props can be different at this moment, think about it
    let searchText = listerInstance.state.searchText;
    if (searchText !== '') {
      let searchLabel = `No results found for "${searchText}"`;
      let data_length = offlineData.records.length;
      if (data_length > 0) {
        searchLabel = `Displaying ${data_length} result(s) for "${searchText}"`;
      }
      updState.searchLabel = searchLabel;
    }

    if (moduleName !== listerInstance.props.moduleName) {
      //do not update the list of records because the user has gone to another module record list page
      console.log('Module name was: ' + moduleName);
      console.log('but correct is: ' + listerInstance.props.moduleName);
      return;
    }

    listerInstance.setState(updState);
  } catch (error) {
    console.log(error);
  }
};

const getFieldsForModule = (moduleName) => {
  let fields = {};
  let specialFields = {};

  const {sortOrderReducer} = store.getState();

  const sortfields = sortOrderReducer?.fields;
  fields = sortfields?.reduce((result, val) => {
    result[val?.name?.replace(/\s/g, '')] = val?.name;
    return result;
  }, {});

  //fields = { key: value }
  //key - field name for mobileapp
  //value - CRM database field name
  // switch (moduleName) {
  //   case CAMPAIGNS: {
  //     fields = {
  //       lable: 'campaignname',
  //     };
  //     break;
  //   }
  //   case VENDORS: {
  //     fields = {
  //       vendorName: 'vendorname',
  //       vendorEmail: 'email',
  //       vendorPhone: 'phone',
  //       vendorWebsite: 'website',
  //     };
  //     break;
  //   }
  //   case FAQ: {
  //     fields = {
  //       question: 'question',
  //     };
  //     break;
  //   }
  //   case QUOTES: {
  //     fields = {
  //       quoteLable: 'subject',
  //       total: 'hdnGrandTotal',
  //       quoteStage: 'quotestage',
  //     };
  //     break;
  //   }
  //   case PURCHASEORDER: {
  //     fields = {
  //       poLable: 'subject',
  //       status: 'postatus',
  //     };
  //     break;
  //   }
  //   case SALESORDER: {
  //     fields = {
  //       soLable: 'subject',
  //       status: 'sostatus',
  //       contact_id: 'contact_id',
  //       account_id: 'account_id',
  //       assigned_user_id: 'assigned_user_id',
  //     };
  //     break;
  //   }
  //   case INVOICE: {
  //     fields = {
  //       invoiceLable: 'subject',
  //       invoiceStatus: 'invoicestatus',
  //       invoiceAccountId: 'account_id',
  //       invoiceItemName: 'assigned_user_id',
  //     };
  //     specialFields = {
  //       invoiceAmount: 'hdnGrandTotal',
  //       invoiceNo: 'invoice_no',
  //     };
  //     break;
  //   }
  //   case PRICEBOOKS: {
  //     fields = {
  //       bookLable: 'bookname',
  //     };
  //     break;
  //   }
  //   case CALENDAR: {
  //     fields = {
  //       eventLable: 'subject',
  //     };
  //     break;
  //   }
  //   case LEADS: {
  //     fields = {
  //       firstname: 'firstname',
  //       lastname: 'lastname',
  //       phone: 'phone',
  //       email: 'email',
  //     };
  //     break;
  //   }
  //   case ACCOUNTS: {
  //     fields = {
  //       accountsLable: 'accountname',
  //       website: 'website',
  //       phone: 'phone',
  //       email: 'email1',
  //     };
  //     break;
  //   }
  //   case CONTACTS: {
  //     fields = {
  //       firstname: 'firstname',
  //       lastname: 'lastname',
  //       phone: 'phone',
  //       email: 'email',
  //       mailingcity: 'mailingcity',
  //       leadsource: 'leadsource',
  //     };
  //     break;
  //   }
  //   case OPPORTUNITIES: {
  //     fields = {
  //       potentialLable: 'potentialname',
  //       amount: 'amount',
  //       stage: 'sales_stage',
  //       related_to: 'related_to',
  //     };
  //     break;
  //   }
  //   case PRODUCTS: {
  //     fields = {
  //       productLable: 'productname',
  //       no: 'product_no',
  //       discontinued: 'discontinued',
  //       productcategory: 'productcategory',
  //       qtyinstock: 'qtyinstock',
  //     };
  //     break;
  //   }
  //   case DOCUMENTS: {
  //     fields = {
  //       documentLable: 'notes_title',
  //     };
  //     break;
  //   }
  //   case TICKETS: {
  //     fields = {
  //       ticketLable: 'ticket_title',
  //       priority: 'ticketpriorities',
  //     };
  //     break;
  //   }
  //   case PBXMANAGER: {
  //     fields = {
  //       number: 'customernumber',
  //     };
  //     break;
  //   }
  //   case SERVICECONTRACTS: {
  //     fields = {
  //       scLable: 'subject',
  //     };
  //     break;
  //   }
  //   case SERVICES: {
  //     fields = {
  //       serviceLable: 'servicename',
  //     };
  //     break;
  //   }
  //   case ASSETS: {
  //     fields = {
  //       assetLable: 'assetname',
  //     };
  //     break;
  //   }
  //   case SMS_NOTIFIER: {
  //     fields = {
  //       message: 'message',
  //     };
  //     break;
  //   }
  //   case PROJECT_MILESTONE: {
  //     fields = {
  //       pmLable: 'projectmilestonename',
  //     };
  //     break;
  //   }
  //   case PROJECT_TASK: {
  //     fields = {
  //       ptLable: 'projecttaskname',
  //     };
  //     break;
  //   }
  //   case MODULE_PROJECT: {
  //     fields = {
  //       projectLable: 'projectname',
  //       linktoaccountscontactslbl: 'linktoaccountscontacts',
  //     };
  //     break;
  //   }
  //   case COMMENTS: {
  //     fields = {
  //       comment: 'commentcontent',
  //     };
  //     break;
  //   }
  //   case CURRENCY: {
  //     fields = {
  //       currency_name: 'currency_name',
  //     };
  //     break;
  //   }
  //   case DOCUMENTFOLDERS: {
  //     fields = {
  //       foldername: 'foldername',
  //     };
  //     break;
  //   }
  //   case USERS: {
  //     fields = {
  //       firstname: 'first_name',
  //       lastname: 'last_name',
  //     };
  //     specialFields = {
  //       user_name: 'user_name',
  //     };
  //     break;
  //   }
  //   default: {
  //     break;
  //   }
  // }

  return [fields, specialFields];
};

const getAllowedModules = () => {
  return [
    CAMPAIGNS,
    VENDORS,
    FAQ,
    QUOTES,
    PURCHASEORDER,
    SALESORDER,
    INVOICE,
    PRICEBOOKS,
    CALENDAR,
    LEADS,
    ACCOUNTS,
    CONTACTS,
    OPPORTUNITIES,
    PRODUCTS,
    DOCUMENTS,
    TICKETS,
    PBXMANAGER,
    SERVICECONTRACTS,
    SERVICES,
    ASSETS,
    SMS_NOTIFIER,
    PROJECT_MILESTONE,
    PROJECT_TASK,
    MODULE_PROJECT,
    COMMENTS,
    CURRENCY,
    DOCUMENTFOLDERS,
    PARTICIPATION,
    CANDIDATES,
    USERS,
  ];
};

export const deleteRecordHelper = async (
  listerInstance,
  recordId,
  index,
  callback,
  dispatch,
) => {
  const {auth} = store.getState();
  const loginDetails = auth.loginDetails;

  try {
    if (loginDetails.vtigerVersion > 6) {
      recordId = recordId.toString().replace(/.*(?=x)+x/, '');
    }
    const responseJson = await API_deleteRecord(
      listerInstance.props.moduleName,
      recordId,
    );
    if (responseJson.success) {
      const obj = responseJson.result.deleted;
      const result = obj[Object.keys(obj)[0]];
      if (result) {
        //Successfully deleted.
        await removeThisIndex(listerInstance, index);
        if (callback && typeof callback === 'function') {
          callback();
        }
        Toast.show('Successfully Deleted.');
      } else {
        callback?.callback();
        Toast.show('Delete Failed.');
      }
    } else {
      callback?.callback();
      Toast.show('Delete Failed.');
    }
  } catch (error) {
    console.log(error);
    Toast.show('Delete Failed.');
  }
};

const removeThisIndex = async (listerInstance, index) => {
  const offlineData = JSON.parse(
    await AsyncStorage.getItem(listerInstance.props.moduleName),
  );
  if (offlineData !== null) {
    if (index > -1) {
      if (index >= offlineData.records.length) {
        //Remove local data
        listerInstance.state.data.splice(index, 1);
        const newArr = listerInstance.state.data.slice();
        listerInstance.setState({
          data: newArr,
        });
      } else {
        offlineData.records.splice(index, 1);
        await AsyncStorage.setItem(
          listerInstance.props.moduleName,
          JSON.stringify(offlineData),
        );
        await addDatabaseKey(listerInstance.props.moduleName);
        listerInstance.setState({
          data: offlineData.records,
        });
      }
    }
  }
};

export const recordListRendererHelper = (
  listerInstance,
  isDashboard = false,
  isRefRecord = false,
) => {
  return (
    <FlatList
      ListEmptyComponent={renderEmpty()}
      style={styles.listWrapper}
      contentContainerStyle={styles.list}
      onRefresh={listerInstance.refreshData.bind(listerInstance)}
      data={listerInstance.state.data}
      refreshing={listerInstance.state.isFlatListRefreshing}
      ListFooterComponent={
        listerInstance.state.nextPage
          ? listerInstance.renderFooter.bind(listerInstance)
          : null
      }
      onEndReachedThreshold={0.1}
      onEndReached={listerInstance.onEndReached.bind(listerInstance)}
      onMomentumScrollBegin={() => {
        listerInstance.onEndReachedCalledDuringMomentum = false;
      }}
      renderItem={({item, index}) =>
        getItem(listerInstance, item, index, isDashboard, isRefRecord)
      }
    />
  );
};

const getItem = (listerInstance, item, index, isDashboard, isRefRecord) => {
  let recordName;
  let ComponentName;
  let labels = [];

  const {fieldReducer, filterReducer} = store.getState();

  const fields = fieldReducer?.fields;
  let result = {};
  let remainingLabels = [];

  fields.forEach((fieldName) => {
    if (item.hasOwnProperty(fieldName)) {
      result[fieldName] = item[fieldName];
    }
  });

  let count = 0;
  let loopCount = filterReducer?.filter_id !== null ? 4 : 1;
  // Iterate over the properties of the item object
  for (const key in item) {
    // Check if the property is not in the fields array
    if (!fields.includes(key) && count < loopCount) {
      // Push the label into the remainingLabels array
      remainingLabels.push(
        typeof item[key] === 'object' ? item[key].label : item[key],
      );
      count++;
    }
  }
  // // Iterate over the properties of the item object
  // for (const key in item) {
  //   // Check if the property is not in the fields array
  //   if (!fields.includes(key)) {
  //     // Push the label into the remainingLabels array
  //     remainingLabels.push(
  //       typeof item[key] === 'object' ? item[key].label : item[key],
  //     );
  //   }
  // }
  for (const key in item) {
    // Check if the property is not in the fields array
    if (!fields.includes(key) && count < loopCount) {
      // Push the label into the remainingLabels array
      remainingLabels.push(
        typeof item[key] === 'object' ? item[key].label : item[key],
      );
      count++;
    }
  }

  // recordName = Object.values(result);
  // labels = remainingLabels;
  // console.log('labels', labels);
  // console.log('result', result);
  switch (listerInstance.props.moduleName) {
    case 'Timesheets':
      recordName = Object.values(result);
      // labels = remainingLabels;
      labels = remainingLabels?.map((item) =>
        item?.startsWith('47x') ? '--' : item,
      );
      break;
    case 'Contacts':
      // recordName = `${result.firstname} ${result.lastname}`;
      recordName = Object.values(result).join(' ');
      labels = remainingLabels;
      break;
    default:
      recordName = Object.values(result);
      labels = remainingLabels;
      break;
  }

  // switch (listerInstance.props.moduleName) {
  //   //TODO add keys for label, for 'Amount: 130' instead of '130' in recordItem
  //   case CAMPAIGNS: {
  //     recordName = item.lable;
  //     break;
  //   }
  //   case CONTACTS: {
  //     recordName = item.label;
  //     // recordName = [item.firstname, ' ', item.lastname];
  //     labels = [
  //       item.phone,
  //       item.email,
  //       item.mailingcity,
  //       filterReducer?.filter_id
  //         ? {value: item.leadsource, color: item.leadsource_color}
  //         : '',
  //     ];
  //     break;
  //   }
  //   case VENDORS: {
  //     recordName = item.vendorName;
  //     labels = [item.vendorEmail, item.vendorPhone, item.vendorWebsite];
  //     break;
  //   }
  //   case FAQ: {
  //     recordName = item.question;
  //     break;
  //   }
  //   case QUOTES: {
  //     recordName = item.quoteLable;
  //     labels = [item.total, item.quoteStage];
  //     break;
  //   }
  //   case PURCHASEORDER: {
  //     recordName = item.poLable;
  //     labels = [item.status];
  //     break;
  //   }
  //   case SALESORDER: {
  //     recordName = item.soLable;
  //     labels = [
  //       item.contact_id.label,
  //       item.status,
  //       item.account_id.label,
  //       item.assigned_user_id.label,
  //     ];
  //     break;
  //   }
  //   case INVOICE: {
  //     recordName = item.invoiceLable;
  //     labels = [
  //       item.invoiceNo,
  //       item.invoiceStatus,
  //       item.invoiceAmount,
  //       item.invoiceAccountId.label,
  //       item.invoiceItemName.label,
  //     ];
  //     break;
  //   }
  //   case PRICEBOOKS: {
  //     recordName = item.bookLable;
  //     break;
  //   }
  //   case CALENDAR: {
  //     recordName = item.eventLable;
  //     break;
  //   }
  //   case LEADS: {
  //     recordName = item.label;
  //     labels = [item.phone, item.email];
  //     break;
  //   }
  //   case ACCOUNTS: {
  //     recordName = item.accountsLable;
  //     labels = [item.website, item.phone, item.email];
  //     break;
  //   }
  //   case OPPORTUNITIES: {
  //     recordName = item.potentialLable;
  //     labels = [item.related_to.label, item.amount, item.stage];
  //     break;
  //   }
  //   case PRODUCTS: {
  //     recordName = item.productLable;
  //     labels = [item.no, item.productcategory, item.qtyinstock];
  //     break;
  //   }
  //   case DOCUMENTS: {
  //     recordName = item.documentLable;
  //     break;
  //   }
  //   case TICKETS: {
  //     recordName = item.ticketLable;
  //     labels = [item.priority];
  //     break;
  //   }
  //   case PBXMANAGER: {
  //     recordName = item.number;
  //     break;
  //   }
  //   case SERVICECONTRACTS: {
  //     recordName = item.scLable;
  //     break;
  //   }
  //   case SERVICES: {
  //     recordName = item.serviceLable;
  //     break;
  //   }
  //   case ASSETS: {
  //     recordName = item.assetLable;
  //     break;
  //   }
  //   case SMS_NOTIFIER: {
  //     recordName = item.message;
  //     break;
  //   }
  //   case PROJECT_MILESTONE: {
  //     recordName = item.pmLable;
  //     break;
  //   }
  //   case PROJECT_TASK: {
  //     recordName = item.ptLable;
  //     break;
  //   }
  //   case MODULE_PROJECT: {
  //     recordName = item.projectLable;
  //     labels = [item.linktoaccountscontactslbl.label];

  //     break;
  //   }
  //   case COMMENTS: {
  //     recordName = item.comment;
  //     break;
  //   }
  //   case CURRENCY: {
  //     recordName = item.currency_name;
  //     break;
  //   }
  //   case DOCUMENTFOLDERS: {
  //     recordName = item.foldername;
  //     break;
  //   }
  //   case USERS: {
  //     recordName = item.label;
  //     labels = [item.user_name];
  //     break;
  //   }
  //   default: {
  //     recordName = item.lable;
  //     break;
  //   }
  // }

  if (isRefRecord) {
    ComponentName = ReferenceRecordItem;
  } else {
    ComponentName = RecordItem;
  }

  return (
    <ComponentName
      index={index}
      selectedIndex={listerInstance.state.selectedIndex}
      listerInstance={listerInstance}
      id={item.id}
      recordName={recordName}
      labels={labels}
      isDashboard={isDashboard}
      onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
      navigation={listerInstance.props.navigation}
    />
  );
};
