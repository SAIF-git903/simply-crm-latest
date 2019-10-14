import React from 'react';
import { Alert, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import { NavigationActions } from 'react-navigation';
import store from '../store';
import StringForm from '../components/addRecords/inputComponents/stringType';
import BooleanForm from '../components/addRecords/inputComponents/booleanType';
import PickerForm from '../components/addRecords/inputComponents/picklistType';
import NumericForm from '../components/addRecords/inputComponents/numericType';
import DateForm from '../components/addRecords/inputComponents/dateType';
import TimeForm from '../components/addRecords/inputComponents/timeType';
import MultiPickerForm from '../components/addRecords/inputComponents/multipicklistType';
import ReferenceForm from '../components/addRecords/inputComponents/referenceType';
import { saveSuccess } from '../actions';

export const describeRecordHelper = async(addInstance) => {  
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    const param = new FormData();
    param.append('_session', loginDetails.session);
    param.append('_operation', 'describe');
    param.append('module', addInstance.props.moduleName);
    //console.log(param);

    // console.log('Login Details', loginDetails);
    
    try {    
        const response = await fetch((`${loginDetails.url}/modules/Mobile/api.php`), {
            method: 'POST',
            headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data; charset=utf-8',
            'cache-control': 'no-cache',
            },
            body: param
        });
        const responseJson = await response.json();
        
        console.log(responseJson);
        if (responseJson.success) {
            
            const fields = responseJson.result.describe.fields;
            const formArray = [];
            const formInstance = [];
            let i = 0;
            for (const fArr of fields) {
                i++;
                const fieldObj = { name: fArr.name,
                                    lable: fArr.label,
                                    mandatory: fArr.mandatory,
                                    type: fArr.type,
                                    nullable: fArr.nullable,
                                    editable: fArr.editable,
                                    default: fArr.default };
                if (fieldObj.editable) {
                    const type = fieldObj.type.name;
                    switch (type) {
                        case 'string':
                        case 'text' :
                        case 'url' :
                        case 'email':
                            formArray.push(
                                <View>
                                <StringForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => formInstance.push(ref)}
                                    
                                />
                                    <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            ); 
                            break;
                        case 'boolean':
                            formArray.push(
                                <View>
                                <BooleanForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => formInstance.push(ref)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            );
                            break;
                        case 'picklist':
                            formArray.push(
                                <View>
                                <PickerForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => formInstance.push(ref)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            );
                            break;
                        
                        case 'phone':
                        case 'currency':
                        case 'integer':
                        case 'double':
                            formArray.push(
                                <View>
                                <NumericForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => formInstance.push(ref)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            );
                            break;
                        case 'date':
                            formArray.push(
                                <View>
                                <DateForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => formInstance.push(ref)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            );
                            break;
                        case 'multipicklist':
                            formArray.push(
                                <View>
                                <MultiPickerForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => formInstance.push(ref)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            );
                            break;
                        case 'reference':
                        case 'owner':
                            formArray.push(
                                <View>
                                <ReferenceForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => { (ref !== null) ? formInstance.push(ref.getWrappedInstance()) : undefined; }}
                                    userId={loginDetails.userId}
                                    onCopyPriceDetails={addInstance.onCopyPriceDetails.bind(addInstance)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            );
                            break;
                        case 'time':
                            formArray.push(
                                <View>
                                <TimeForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => formInstance.push(ref)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            );
                            break;
                        default:
                            formArray.push(
                                <View>
                                <StringForm 
                                    obj={fieldObj}
                                    navigate={addInstance.props.navigation} 
                                    moduleName={addInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => formInstance.push(ref)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#d3d3d3' }} />
                                </View>
                            );
                            break;
                    }
                }                
            }
            addInstance.setState({ ...addInstance.state, inputForm: formArray, inputInstance: formInstance, loading: false });
        } else {
            //console.log('Failed');
            addInstance.setState({ loading: false });
            Alert.alert('Api error', 'Api response error.Vtiger is modified');
        } 
    } catch (error) {
        //console.log(error);
        addInstance.setState({ loading: false });
        Alert.alert('No network connection', 'Please check your internet connection and tryagin');
    }
};

export const saveRecordHelper = (addInstance, headerInstance, dispatch) => {
    const formInstance = addInstance.state.inputInstance;
    const jsonObj = {};
    const lineitemsObj = [];
    for (let i = 0; i < formInstance.length; i++) {
        const fieldName = formInstance[i].state.fieldName;
        const value = formInstance[i].state.saveValue;
        jsonObj[fieldName] = value;
        if (addInstance.props.moduleName === 'Invoice') {
            //do here
            // console.log(formInstance);
            if (fieldName === 'productid' || fieldName === 'quantity' || fieldName === 'listprice') {
                const productObj = {};
                productObj[fieldName] = value;
                lineitemsObj.push(productObj); 
            }
        }
    }
    if (addInstance.props.moduleName === 'Invoice') {
        jsonObj['LineItems'] = lineitemsObj;
    }
    // if (addInstance.props.moduleName === 'Invoice') {
    //     //do here
    //     console.log(formInstance);
    // }
    addRecordHelper(addInstance, headerInstance, jsonObj, dispatch);
};

const addRecordHelper = async(addInstance, headerInstance, jsonObj, dispatch) => {  

    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    const obj = JSON.stringify(jsonObj);
    console.log(obj);
    const param = new FormData();
    param.append('_session', loginDetails.session);
    param.append('_operation', 'saveRecord');
    param.append('module', addInstance.props.moduleName);
    param.append('values', obj);
    
    try {    
        const response = await fetch((`${loginDetails.url}/modules/Mobile/api.php`), {
            method: 'POST',
            headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data; charset=utf-8',
            'cache-control': 'no-cache',
            },
            body: param
        });
        
        console.log(param);
        const responseJson = await response.json();
        console.log(response);
        if (responseJson.success) {
            console.log(responseJson);
            headerInstance.setState({ loading: false });
            Toast.show('Successfully Added');
            dispatch(saveSuccess('saved'));
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'HomeScreen' })
                ]
              });
            addInstance.props.navigation.dispatch(resetAction);
            //addInstance.props.navigation.goBack(null);
        } else {
            // console.log(responseJson);
            //console.log('Failed');
            headerInstance.setState({ loading: false });
            if (responseJson.error.message === '') {
                Alert.alert('','Vtiger API error');
            } else {
                Alert.alert('', responseJson.error.message);
            }
            Toast.show('Added Failed');
        } 
    } catch (Error) {
        console.log(Error);
        headerInstance.setState({ loading: false });
        Alert.alert('', 'Api response error');
    }
};

export const copyAddress = (addInstance, headerInstance) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;
    
        const formInstance = addInstance.state.inputInstance;
        for (let i = 0; i < formInstance.length; i++) { 
            const { recordViewer } = store.getState();
            const contactAddress = recordViewer.contactAddress;
            const organisationAddress = recordViewer.organisationAddress;
            let targetAddress = contactAddress;
            let checkValue; 

            // console.log(contactAddress);
            if (headerInstance.state.copyFrom === 'Organisation') {
                targetAddress = organisationAddress;
            } 


            // console.log(formInstance[i].state.fieldName);
            switch (formInstance[i].state.fieldName) {
                case 'bill_street':
                case 'ship_street':
                    checkValue = (headerInstance.state.copyFrom === 'Contacts') ? 'mailingstreet' : formInstance[i].state.fieldName;                   
                break;
                case 'bill_city':
                case 'ship_city':
                    checkValue = (headerInstance.state.copyFrom === 'Contacts') ? 'mailingcity' : formInstance[i].state.fieldName;
                break;
                case 'bill_state':
                case 'ship_state':
                    checkValue = (headerInstance.state.copyFrom === 'Contacts') ? 'mailingstate' : formInstance[i].state.fieldName;
                break;
                case 'bill_code':
                case 'ship_code':
                    checkValue = (headerInstance.state.copyFrom === 'Contacts') ? 'mailingzip' : formInstance[i].state.fieldName;
                break;
                case 'bill_country':
                case 'ship_country':
                    checkValue = (headerInstance.state.copyFrom === 'Contacts') ? 'mailingcountry' : formInstance[i].state.fieldName;
                break;
                case 'bill_pobox':
                case 'ship_pobox':
                    checkValue = (headerInstance.state.copyFrom === 'Contacts') ? 'mailingpobox' : formInstance[i].state.fieldName;
                break;

                default:
                
            }
           
            // console.log(checkValue);
            if (targetAddress !== undefined) {
                if (checkValue !== '' && targetAddress.length > 0) {
                    // console.log('checkvalue', checkValue);
                    targetAddress = targetAddress.filter((item) => item.name === checkValue).map(({ value }) => ({ value }));                    
                    // console.log('result',targetAddress);
                    if (targetAddress.length > 0) {
                        formInstance[i].setState({ saveValue: (loginDetails.vtigerVersion === 7) ? targetAddress[0].value : targetAddress[0].value.value });               
                        // formInstance[i].setState({ saveValue: targetAddress[0].value });               
                    }     
                } else {    
                    Toast.show('No values to copy');
                } 
            } 
        }         
    } catch (error) {
        // console.log(error);
    }
};

export const copyPriceDetails = (addInstance, priceFields, stockFields) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        const formInstance = addInstance.state.inputInstance;
        let pfields = priceFields;
        let sfields = stockFields;

        for (let i = 0; i < formInstance.length; i++) { 
            if (formInstance[i].state.fieldName === 'listprice') {
                pfields = pfields.filter((item) => item.name === 'unit_price').map(({ value }) => ({ value }));    
                formInstance[i].setState({ saveValue: (loginDetails.vtigerVersion === 7) ? pfields[0].value : pfields[0].value.value });               
                // formInstance[i].setState({ saveValue: pfields[0].value });               
            }
            if (formInstance[i].state.fieldName === 'quantity') {
                sfields = sfields.filter((item) => item.name === 'qty_per_unit').map(({ value }) => ({ value }));
                const qunatity = (loginDetails.vtigerVersion === 7) ? sfields[0].value : sfields[0].value.value;   
                // const qunatity = (loginDetails.vtigerVersion === 7) ? sfields : sfields[0].value.value;  
                // const qunatity = sfields[0].value;  
                formInstance[i].setState({ saveValue: (qunatity === '0.00') ? '1' : qunatity });               
                
            } 
        }         
    } catch (error) {
        // console.log(error);
    }
};
