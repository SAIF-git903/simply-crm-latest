import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {CommonActions} from '@react-navigation/native';

// import { NavigationActions } from 'react-navigation';
import store from '../store';
import FormSection from '../components/common/FormSection';
import StringForm from '../components/addRecords/inputComponents/stringType';
import BooleanForm from '../components/addRecords/inputComponents/booleanType';
import PickerForm from '../components/addRecords/inputComponents/picklistType';
import NumericForm from '../components/addRecords/inputComponents/numericType';
import DateForm from '../components/addRecords/inputComponents/dateType';
import TimeForm from '../components/addRecords/inputComponents/timeType';
import MultiPickerForm from '../components/addRecords/inputComponents/multipicklistType';
import ReferenceForm from '../components/addRecords/inputComponents/referenceType';
import {isTimeSheetModal, saveSuccess} from '../actions';
import {API_structure, API_fetchRecord, API_saveRecord} from './api';
import {fontStyles, commonStyles} from '../styles/common';
import moment from 'moment';
import Signature from '../components/addRecords/inputComponents/SignatureType';
import RefType from '../components/addRecords/inputComponents/refType';
import OptionType from '../components/addRecords/inputComponents/OptionType';
import mutiTypeList from '../components/addRecords/inputComponents/mutiTypeList';

export const getRecordStructureHelper = async (currentInstance) => {
  const calanderType = currentInstance.props.subModule;
console.log('calanderTypecalanderType',currentInstance.props)
  // const calanderType = currentInstance.props

  const {auth, colorRuducer, timeSheetModalReducer} = store.getState();

  const loginDetails = auth.loginDetails;
  const vtigerSeven = loginDetails.vtigerVersion > 6;

  // Ensure moduleName is defined
  // PRIORITY 1: If we have recordId, determine from recordId format FIRST (most reliable)
  let moduleName = null;
  if (currentInstance.state.recordId && currentInstance.state.recordId.includes('x')) {
    let ids = currentInstance.state.recordId.split('x');
    const moduleId = parseInt(ids[0], 10);
    switch (moduleId) {
      case 18:
        moduleName = 'Events';
        break;
      case 9:
        moduleName = 'Calendar';
        break;
      default:
        // Try to find module by ID in the modules list
        const {auth} = store.getState();
        const modules = auth?.loginDetails?.modules || [];
        const foundModule = modules.find((mod) => mod?.id === moduleId.toString());
        if (foundModule?.name) {
          moduleName = foundModule.name;
        }
        break;
    }
  }
  
  // PRIORITY 2: Check moduleFromCalender FIRST (before props.moduleName) - this is critical for Calendar screen edits
  // This should take precedence over props.moduleName to ensure correct module is used
  if (!moduleName && currentInstance.props?.moduleFromCalender) {
    moduleName = currentInstance.props.moduleFromCalender;
  }
  
  // PRIORITY 3: Use props.moduleName if not determined from recordId or moduleFromCalender, but ignore 'Home'
  // props.moduleName should already be set correctly by AddRecords component from route params
  if (!moduleName || moduleName === 'Home') {
    const propsModuleName = currentInstance.props.moduleName;
    if (propsModuleName && propsModuleName !== 'Home') {
      moduleName = propsModuleName;
    }
  }
  
  if (!moduleName) {
    console.error('getRecordStructureHelper: Unable to determine moduleName', {
      recordId: currentInstance.state.recordId,
      propsModuleName: currentInstance.props.moduleName,
    });
    currentInstance.setState({
      loading: false,
      statusText: 'Module name is missing. Please try again.',
      statusTextColor: 'red',
    });
    return;
  }

  try {
    console.log('getRecordStructureHelper: Starting fetch for module:', moduleName, 'recordId:', currentInstance.state.recordId);
    
    //get empty inputs
    const responseJson = await API_structure(
      calanderType === 'Events' ? 'Events' : moduleName,
    );
    
    console.log('getRecordStructureHelper: Structure API response:', {
      success: responseJson?.success,
      hasStructure: !!responseJson?.result?.structure,
      structureLength: responseJson?.result?.structure?.length,
    });
    
    let dataResponseJson;

    //edit record - request data for inputs
    if (currentInstance.state.recordId) {
      //get data for inputs
      const param = {
        record: currentInstance.state.recordId,
        module: vtigerSeven
          ? calanderType === 'Events'
            ? 'Events'
            : moduleName
          : undefined,
      };
      console.log('getRecordStructureHelper: Fetching record data with params:', param);
      dataResponseJson = await API_fetchRecord(param);
      console.log('getRecordStructureHelper: Record data response:', {
        success: dataResponseJson?.success,
        hasRecord: !!dataResponseJson?.result?.record,
      });
      
      if (!dataResponseJson || !dataResponseJson.success) {
        console.error('getRecordStructureHelper: Failed to fetch record data');
        throw new Error('Cant get data for record');
      }
    }

    if (responseJson.success) {
      const content = [];
      const structures = responseJson.result.structure;
      for (let k = 0; k < structures.length; k++) {
        const structure = structures[k];
        const {fields, label, visible, sequence} = structure;
    

        const formArray = [];

        for (let i = 0; i < fields.length; i++) {
          const fArr = fields[i];

          if (
            currentInstance.props.moduleName === 'Calendar' &&
            fArr.name === 'contact_id'
          ) {
            continue;
          }

          const hiddenFields = [
            'createdtime',
            'modifiedtime',
            'pricebook_no',
            'source',
            'starred',
            'tags',
            'modifiedby',
            calanderType === 'Tasks' && 'eventstatus',
            'duration_minutes',
          ];

          if (hiddenFields.includes(fArr?.name)) {
            continue;
          }

          if (
            timeSheetModalReducer?.is_TimeSheetModal &&
            // currentInstance.props.moduleName === 'Timesheets' &&
            fArr?.quickcreate !== '0' &&
            fArr?.quickcreate !== '2'
          ) {
            continue;
          }

          const fieldObj = {
            name: fArr.name,
            lable: fArr.label,
            mandatory: fArr.mandatory,
            type: fArr.type,
            nullable: fArr.nullable,
            editable: fArr.masseditable,
            default: fArr.default,
            sequence: fArr.sequence,
          };

          // console.log('fieldObj', fieldObj);

          const dataField = dataResponseJson?.result?.record[fArr.name];

          console.log('----line----');
          console.log('fArr.name');
          console.log(fArr.name);
          console.log('dataField');
          console.log(dataField);
          if (dataField !== undefined) {
            // console.log('fArr.type.name');
            // console.log(fArr.type.name);
            if (['owner', 'reference'].includes(fArr.type.name)) {
              // console.log('dataField.label');
              // console.log(dataField.label);
              // console.log('dataField.value');
              // console.log(dataField.value);
              fieldObj.currentReferenceValue = dataField.label;
              fieldObj.currentValue = dataField.value;
            } else {
              fieldObj.currentValue = dataField;
            }
          }
          // if (fieldObj.name.includes('currency') && fieldObj.name.match(/\d+$/) && currentInstance.props.moduleName === 'Products') {
          //     currencyArr.push({ label: fieldObj.lable, value: fieldObj.lable });
          // }

          let type = fieldObj.type.name;

          // if (fieldObj.editable) {
          if (
            fieldObj.editable &&
            !(fieldObj.name.includes('currency') && type === 'double')
          ) {
            let ComponentName;

            // if (type === 'currency' && fieldObj.name === 'unit_price' && currentInstance.props.moduleName === 'Products') {
            //     type = 'picklist';
            //     fieldObj.type.picklistValues = currencyArr;
            // }

            switch (type) {
              case 'boolean':
                ComponentName = BooleanForm;
                break;
              case 'signature':
                ComponentName = Signature;
                break;
              case 'picklist':
                // ComponentName = PickerForm;
                ComponentName = OptionType;
                // if (timeSheetModalReducer?.is_TimeSheetModal) {
                //   ComponentName = OptionType;
                // } else {
                //   ComponentName = PickerForm;
                // }
                break;
              case 'phone':
              case 'currency':
              case 'integer':
              case 'double':
                //TODO 'if' is necessary ??
                if (fieldObj.name !== 'shipping_&_handling_') {
                  ComponentName = NumericForm;
                }
                break;
              case 'date':
                ComponentName = DateForm;
                break;
              case 'datetime':
                ComponentName = DateForm;
                break;
              case 'multipicklist':
                // ComponentName = MultiPickerForm;
                ComponentName = mutiTypeList;
                break;
              case 'reference':
              case 'owner':
                if (fieldObj.name === 'currency_id') {
                  fieldObj.defaultValue =
                    store.getState().UserReducer.userData.currency_id;
                }
                if (timeSheetModalReducer?.is_TimeSheetModal) {
                  ComponentName = RefType;
                } else {
                  ComponentName = ReferenceForm;
                }
                break;
              case 'time':
                ComponentName = TimeForm;
                // ComponentName =
                //   currentInstance?.props?.moduleName === 'Timesheets'
                //     ? TimeForm
                //     : DateForm;
                break;
              case 'string':
              case 'text':
              case 'url':
              case 'email':
              default:
                ComponentName = StringForm;
                break;
            }
            const randomId = Math.random().toString(36).substr(2, 9);

            const amp = '&amp;';
            const validLabel =
              fieldObj.lable.indexOf(amp) !== -1
                ? fieldObj.lable.replace(amp, '&')
                : fieldObj.lable;

            for (
              let index = 0;
              index < colorRuducer?.passedValue?.length;
              index++
            ) {
              const element = colorRuducer?.passedValue[index];

              if (element?.name === fieldObj.name) {
                formArray.push(
                  <View sequence={fieldObj.sequence} key={fieldObj.name}>
                    <ComponentName
                      obj={fieldObj}
                      validLabel={validLabel}
                      fieldLabelView={getFieldLabelView(
                        fieldObj.mandatory,
                        validLabel,
                      )}
                      recordName={currentInstance?.props?.recordName}
                      currentId={currentInstance?.props?.currentId}
                      navigation={currentInstance.props.navigation}
                      moduleName={currentInstance.props.moduleName}
                      submodule={currentInstance.props.subModule}
                      formId={randomId}
                      key={i}
                      ref={(ref) => {
                        if (ref !== null) {
                          let arr = currentInstance.state.inputInstance;
                          arr.push(ref);
                          currentInstance.setState({inputInstance: arr});
                        }
                      }}
                      userId={loginDetails.userId}
                      onCopyPriceDetails={currentInstance.onCopyPriceDetails.bind(
                        currentInstance,
                      )}
                      colorsType={element?.type?.picklistColors}
                    />
                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: '#f2f3f8',
                      }}
                    />
                  </View>,
                );
              }
            }

            formArray.push(
              <View sequence={fieldObj.sequence} key={fieldObj.name}>
                <ComponentName
                  obj={fieldObj}
                  validLabel={validLabel}
                  fieldLabelView={getFieldLabelView(
                    fieldObj.mandatory,
                    validLabel,
                  )}
                  recordName={currentInstance?.props?.recordName}
                  currentId={currentInstance?.props?.currentId}
                  navigation={currentInstance.props.navigation}
                  moduleName={currentInstance.props.moduleName}
                  submodule={currentInstance.props.subModule}
                  formId={randomId}
                  key={i}
                  ref={(ref) => {
                    if (ref !== null) {
                      let arr = currentInstance.state.inputInstance;
                      arr.push(ref);
                      currentInstance.setState({inputInstance: arr});
                    }
                  }}
                  userId={loginDetails.userId}
                  onCopyPriceDetails={currentInstance.onCopyPriceDetails.bind(
                    currentInstance,
                  )}
                />
                <View
                  style={{width: '100%', height: 1, backgroundColor: '#f2f3f8'}}
                />
              </View>,
            );
          }
        }

        if (formArray.length === 0) {
          continue;
        }

        // Sort fields
        formArray.sort((a, b) => a.props.sequence - b.props.sequence);

        // Use a Set to keep track of unique keys
        const uniqueKeys = new Set();

        // Use Array.reduce to filter out duplicates
        const deduplicatedArray = formArray.reduce((result, currentObject) => {
          // Check if the key is not in the set
          if (!uniqueKeys.has(currentObject.key)) {
            // Add the key to the set
            uniqueKeys.add(currentObject.key);
            // Push the current object to the result array
            result.push(currentObject);
          }
          return result;
        }, []);

        content.push(
          <FormSection key={k} sequence={parseInt(sequence, 10)} title={label}>
            {deduplicatedArray}
          </FormSection>,
        );
      }
console.log('contentcontentcontentcontent',content)
      // Sort sections
      content.sort((a, b) => a.props.sequence - b.props.sequence);

      console.log('getRecordStructureHelper: Setting form with', content.length, 'sections');
      currentInstance.setState({
        inputForm: content,
        loading: false,
      });
    } else {
      console.log('Failed');
      currentInstance.setState({loading: false});
      Alert.alert('Api error', 'Api response error. Vtiger is modified');
    }
  } catch (error) {
    console.log('getRecordStructureHelper error:', error);
    currentInstance.setState({loading: false});
    
    // Check if it's a module name issue
    if (!moduleName) {
      Alert.alert(
        'Error',
        'Unable to determine module. Please try again.',
      );
    } else {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again',
      );
    }
  }
};

const getFieldLabelView = (mandatory, validLabel) => {
  let view = null;
  if (mandatory) {
    view = (
      <Text style={[fontStyles.fieldLabel, {color: 'red', fontSize: 16}]}>
        *
      </Text>
    );
  }
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {/* <View style={{flex: 0.5, justifyContent: 'flex-start'}}> */}
      <View style={[commonStyles.mandatory]}>{view}</View>
      <Text style={[commonStyles.label, fontStyles.fieldLabel]}>
        {validLabel}
      </Text>
    </View>
  );
};

export const saveRecordHelper = async (
  currentInstance,
  headerInstance,
  dispatch,
  listerInstance,
  parentRecord,
  parentModule,
  parentId,
) => {
  const formInstance = currentInstance.state.inputInstance;
  const jsonObj = {};
  const lineItemsObj = [];
  let productObj = null;

  for (let i = 0; i < formInstance.length; i++) {
    const fieldName = formInstance[i].state.fieldName;
    const value = formInstance[i].state.saveValue;
    // console.log('fieldName value');
    // console.log(fieldName);
    // console.log(value);
    //TODO check me
    jsonObj[fieldName] = value;
    if (
      currentInstance.props.moduleName === 'Invoice' ||
      currentInstance.props.moduleName === 'Quotes'
    ) {
      if (fieldName !== 'quantity' || fieldName !== 'listprice') {
        jsonObj[fieldName] = value;
      }
      if (
        fieldName === 'productid' ||
        fieldName === 'quantity' ||
        fieldName === 'listprice'
      ) {
        if (!productObj) {
          productObj = {};
        }
        productObj[fieldName] = value;
      }
    } else {
      jsonObj[fieldName] = value;
    }
  }

  if (productObj) {
    lineItemsObj.push(productObj);
  }

  if (
    currentInstance.props.moduleName === 'Invoice' ||
    currentInstance.props.moduleName === 'Quotes'
  ) {
    jsonObj['LineItems'] = lineItemsObj;
  }

  await doSaveRecord(
    currentInstance,
    headerInstance,
    jsonObj,
    dispatch,
    listerInstance,
    parentRecord,
    parentModule,
    parentId,
  );
};

const doSaveRecord = async (
  currentInstance,
  headerInstance,
  jsonObj,
  dispatch,
  listerInstance,
  parentRecord,
  parentModule,
  parentId,
) => {
  const calanderType = currentInstance.props.subModule;
  let newobj = jsonObj;

  if (
    calanderType === 'Events' ||
    currentInstance.props.moduleName === 'Calendar'
  ) {
    const roundTimeToNearestDuration = (currentTime) => {
      const date = new Date(currentTime);
      const minutes = date.getMinutes();

      let dynamicDuration;
      if (minutes == 0) {
        dynamicDuration = 60;
      } else if (minutes > 0 && minutes <= 5) {
        dynamicDuration = 5;
      } else if (minutes <= 15) {
        dynamicDuration = 15;
      } else if (minutes <= 30) {
        dynamicDuration = 30;
      } else if (minutes <= 45) {
        dynamicDuration = 45;
      } else {
        dynamicDuration = 60;
      }

      const endTime1 = addMinutesToDate(date, dynamicDuration);

      return {endTime1};
    };

    const addMinutesToDate = (date, minutes) => {
      return new Date(date.getTime() + minutes * 60000); // 1 minute = 60000 milliseconds
    };

    if (newobj?.time_start) {
      let new_endTime = roundTimeToNearestDuration(newobj.time_start);

      newobj.time_end = new_endTime.endTime1;
    }

    newobj.date_start = moment(newobj.date_start).format('YYYY-MM-DD');
    newobj.due_date = moment(newobj.due_date).format('YYYY-MM-DD');
    newobj.time_end = newobj?.time_end
      ? moment(newobj.time_end).format('HH:mm')
      : null;
    newobj.time_start = newobj?.time_end
      ? moment(newobj.time_start).format('HH:mm')
      : null;

    function calculateDuration(startDate, startTime, endDate, endTime) {
      const startDateTime = new Date(`${startDate} ${startTime}`);
      const endDateTime = new Date(`${endDate} ${endTime}`);

      // Calculate the time difference in milliseconds
      const timeDiff = endDateTime - startDateTime;

      // Convert the time difference to hours and minutes
      const hours = Math.floor(timeDiff / 3600000); // 1 hour = 3600000 milliseconds
      const minutes = Math.round((timeDiff % 3600000) / 60000); // 1 minute = 60000 milliseconds

      return {hours, minutes};
    }

    const duration = calculateDuration(
      newobj.date_start,
      newobj.time_start,
      newobj.due_date,
      newobj.time_end,
    );

    if (duration.hours >= 0 && duration.minutes >= 0) {
      newobj.duration_hours = duration.hours;
      newobj.duration_minutes = duration.minutes;
      headerInstance.setState({loading: false});
    }
    // else {

    // if (calanderType === 'Events') {
    //   Alert.alert(
    //     'Please ensure the End Date or End Time is later than the Start Date or Time Start.',
    //   );
    // } else {
    //   Alert.alert(
    //     'Please ensure the Due Date or End Time is later than the Start Date or Time Start.',
    //   );
    // }
    //   return;
    // }
  }
  if (parentId) {
    jsonObj.parent_id = parentId;
  }

  if (calanderType === 'Tasks') {
    jsonObj.activitytype = 'Task';
  }

  try {
    for (const field of currentInstance.state.inputInstance) {
      if (field.state.error) {
        field.setState({showError: true});
        throw Error(`${field.state.error} at ${field.props.obj.lable}`);
      }
    }
    //TODO checked edit and add new records for all modules:
    // checked only Contact, Account, Calendar, Invoices, SalesOrder, Opportunity, Product, Quote, Document modules
    // after new record save in Organization field Employee, Annual Revenue have value is "0undefined00"
    // cant change record image for Contact, Product. Hide it in mobileapp ??
    // cant check Invoice record edit - currency, add new Invoice - good
    // cant relink Product on edit SalesOrder record, add new SalesOrder - have error 'Mandatory Fields Missing..' from backend
    // eco_layout field empty for Invoice, SalesOrder and Quotes ??
    // cant edit Folder Name for Document record, add new Document - good
    // also
    // Event and Task records have trouble on saving 'Related To' block (in mobileapp it's string, but in mastercopy - Contact module records picklist)
    // this also affects to String field 'contact_id', which will be object '{"label": "", "value": ""}' in saveValue instead of string

    const responseJson = await API_saveRecord(
      calanderType === 'Events' ? 'Events' : currentInstance.props.moduleName,
      JSON.stringify(jsonObj),
      currentInstance.state.recordId,
      parentRecord,
      parentModule,
      // parentId,
    );
    if (responseJson.success) {
      headerInstance.setState({loading: false});
      let message;
      if (currentInstance.state.recordId) {
        message = 'Successfully edited';
      } else {
        message = 'Successfully added';
      }
      Toast.show(message);
      dispatch(saveSuccess('saved', currentInstance?.props?.recordId));

      // NavigationActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({routeName: 'HomeScreen'})],
      // });
      // Make sure to use the correct navigation reference

      if (listerInstance !== undefined) {
        currentInstance.props.navigation.pop();
        listerInstance.refreshData();
        // currentInstance.props.navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [
        //       {name: 'Drawer'}, // Navigate to the top-level navigator
        //     ],
        //   }),
        // );
      } else {
        dispatch(isTimeSheetModal(false));
      }
    } else {
      headerInstance.setState({loading: false});
      if (responseJson.error.message === '') {
        Alert.alert('Can not save record', 'Vtiger API error');
      } else {
        Alert.alert('Can not save record', responseJson.error.message);
      }
    }
  } catch (e) {
    console.log(e);
    headerInstance.setState({loading: false});
    Alert.alert('Can not save record', e.message);
  }
};

export const copyAddress = (currentInstance, headerInstance) => {
  try {
    const {auth} = store.getState();
    const loginDetails = auth.loginDetails;
    const vtigerSeven = loginDetails.vtigerVersion > 6;

    const formInstance = currentInstance.state.inputInstance;
    let emptyFlag = true;
    for (let i = 0; i < formInstance.length; i++) {
      const {recordViewer} = store.getState();
      const contactAddress = recordViewer.contactAddress;
      const organisationAddress = recordViewer.organisationAddress;
      let targetAddress = contactAddress;
      let checkValue;

      if (headerInstance.state.copyFrom === 'Organisation') {
        targetAddress = organisationAddress;
      }

      switch (formInstance[i].state.fieldName) {
        case 'bill_street':
        case 'ship_street':
          checkValue =
            headerInstance.state.copyFrom === 'Contacts'
              ? 'mailingstreet'
              : formInstance[i].state.fieldName;
          break;
        case 'bill_city':
        case 'ship_city':
          checkValue =
            headerInstance.state.copyFrom === 'Contacts'
              ? 'mailingcity'
              : formInstance[i].state.fieldName;
          break;
        case 'bill_state':
        case 'ship_state':
          checkValue =
            headerInstance.state.copyFrom === 'Contacts'
              ? 'mailingstate'
              : formInstance[i].state.fieldName;
          break;
        case 'bill_code':
        case 'ship_code':
          checkValue =
            headerInstance.state.copyFrom === 'Contacts'
              ? 'mailingzip'
              : formInstance[i].state.fieldName;
          break;
        case 'bill_country':
        case 'ship_country':
          checkValue =
            headerInstance.state.copyFrom === 'Contacts'
              ? 'mailingcountry'
              : formInstance[i].state.fieldName;
          break;
        case 'bill_pobox':
        case 'ship_pobox':
          checkValue =
            headerInstance.state.copyFrom === 'Contacts'
              ? 'mailingpobox'
              : formInstance[i].state.fieldName;
          break;
        default:
          break;
      }

      if (targetAddress !== undefined) {
        if (checkValue !== '' && targetAddress.length > 0) {
          targetAddress = targetAddress
            .filter((item) => item.name === checkValue)
            .map(({value}) => ({value}));
          if (targetAddress.length > 0) {
            formInstance[i].setState({
              saveValue: vtigerSeven
                ? targetAddress[0].value
                : targetAddress[0].value.value,
            });
            // formInstance[i].setState({ saveValue: targetAddress[0].value });
            if (targetAddress[0].value !== '') {
              emptyFlag = false;
            }
          }
        } else {
          Toast.show('No values to copy');
        }
      }
    }
    if (emptyFlag) {
      Toast.show('Values are empty');
    } else {
      Toast.show('Values are copied');
    }
  } catch (error) {
    console.log(error);
  }
};

export const copyPriceDetails = (currentInstance, priceFields, stockFields) => {
  try {
    const {auth} = store.getState();
    const loginDetails = auth.loginDetails;
    const vtigerSeven = loginDetails.vtigerVersion > 6;
    const formInstance = currentInstance.state.inputInstance;
    let pfields = priceFields;
    let sfields = stockFields;

    for (let i = 0; i < formInstance.length; i++) {
      if (formInstance[i].state.fieldName === 'listprice') {
        pfields = pfields
          .filter((item) => item.name === 'unit_price')
          .map(({value}) => ({value}));
        let val;
        if (vtigerSeven) {
          val = Number(pfields[0].value).toFixed(2);
        } else {
          val = Number(pfields[0].value.value).toFixed(2);
        }
        formInstance[i].setState({saveValue: val});
        // formInstance[i].setState({ saveValue: pfields[0].value });
      }
      if (formInstance[i].state.fieldName === 'quantity') {
        sfields = sfields
          .filter((item) => item.name === 'qty_per_unit')
          .map(({value}) => ({value}));
        const qunatity = vtigerSeven
          ? sfields[0].value
          : sfields[0].value.value;
        // const qunatity = (vtigerSeven) ? sfields : sfields[0].value.value;
        // const qunatity = sfields[0].value;
        formInstance[i].setState({
          saveValue: qunatity === '0.00' ? '1' : qunatity,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
