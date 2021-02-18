import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-simple-toast';
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
import ReferenceType from '../components/addRecords/inputComponents/referenceType';
import { saveSuccess } from '../actions';
import { API_structure, API_fetchRecord, API_saveRecord } from "./api";
import {fontStyles, commonStyles} from "../styles/common";

export const describeRecordHelper = async (currentInstance) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    try {
        const responseJson = await API_structure(currentInstance.props.moduleName);
        if (responseJson.success) {
            const formInstance = [];
            const content = [];
            const structures = responseJson.result.structure;
            for (let k = 1; k < structures.length; k++) {
                const structure = structures[k];
                const {
                    fields,
                    label,
                    visible,
                    sequence
                } = structure;
                const formArray = [];

                for (let i = 1; i < fields.length; i++) {
                    const fArr = fields[i];

                    if (currentInstance.props.moduleName === 'Calendar' && fArr.name === 'contact_id') {
                        continue;
                    }

                    const hiddenFields = [
                        'createdtime', 'modifiedtime', 'pricebook_no',
                        'source', 'starred', 'tags',
                        'modifiedby'
                    ];

                    if (hiddenFields.includes(fArr.name)) {
                        continue;
                    }

                    const fieldObj = {
                        name: fArr.name,
                        lable: fArr.label,
                        mandatory: fArr.mandatory,
                        type: fArr.type,
                        nullable: fArr.nullable,
                        editable: fArr.masseditable,
                        default: fArr.default
                    };
                    // if (fieldObj.name.includes('currency') && fieldObj.name.match(/\d+$/) && currentInstance.props.moduleName === 'Products') {
                    //     currencyArr.push({ label: fieldObj.lable, value: fieldObj.lable });
                    // }

                    // if (fieldObj.editable) {
                    if (
                        fieldObj.editable
                        && !(
                            fieldObj.name.includes('currency')
                            && fieldObj.type.name === 'double'
                        )
                    ) {
                        let type = fieldObj.type.name;
                        let defaultValue = null;
                        let ComponentName;

                        // if (type === 'currency' && fieldObj.name === 'unit_price' && currentInstance.props.moduleName === 'Products') {
                        //     type = 'picklist';
                        //     fieldObj.type.picklistValues = currencyArr;
                        // }

                        switch (type) {
                            case 'boolean':
                                ComponentName = BooleanForm;
                                break;
                            case 'picklist':
                                ComponentName = PickerForm;
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
                            case 'multipicklist':
                                ComponentName = MultiPickerForm;
                                break;
                            case 'reference':
                            case 'owner':
                                if (fieldObj.name === 'currency_id') {
                                    defaultValue = store.getState().UserReducer.userData.currency_id;
                                }
                                ComponentName = ReferenceType;
                                break;
                            case 'time':
                                ComponentName = TimeForm;
                                break;
                            case 'string':
                            case 'text':
                            case 'url':
                            case 'email':
                            default:
                                ComponentName = StringForm;
                                break;
                        }

                        const amp = '&amp;';
                        const validLable = (fieldObj.lable.indexOf(amp) !== -1) ? fieldObj.lable.replace(amp, '&') : fieldObj.lable;
                        formArray.push(
                            <View
                                sequence={fArr.sequence}
                                key={fieldObj.name}
                            >
                                <ComponentName
                                    obj={fieldObj}
                                    validLable={validLable}
                                    fieldLabelView={getFieldLabelView(fieldObj.mandatory, validLable)}
                                    navigate={currentInstance.props.navigation}
                                    moduleName={currentInstance.props.moduleName}
                                    formId={i}
                                    ref={(ref) => {
                                        return (ref !== null) ? formInstance.push(ref) : undefined;
                                    }}
                                    key={i}
                                    defaultValue={defaultValue}
                                    userId={loginDetails.userId}
                                    onCopyPriceDetails={currentInstance.onCopyPriceDetails.bind(currentInstance)}
                                />
                                <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                            </View>
                        );
                    }
                }

                if (formArray.length === 0) {
                    continue;
                }

                // Sort fields
                formArray.sort((a, b) => a.props.sequence - b.props.sequence);

                content.push(
                    <FormSection
                        key={k}
                        sequence={parseInt(sequence, 10)}
                        title={label}
                    >
                        {formArray}
                    </FormSection>
                );
            }

            // Sort sections
            content.sort((a, b) => a.props.sequence - b.props.sequence);

            currentInstance.setState({
                ...currentInstance.state,
                inputForm: content,
                inputInstance: formInstance,
                loading: false
            }, () => {
                if (currentInstance.state.recordId) {
                    getDataHelper(currentInstance);
                }
            });
        } else {
            console.log('Failed');
            currentInstance.setState({ loading: false });
            Alert.alert('Api error', 'Api response error. Vtiger is modified');
        }
    } catch (error) {
        console.log(error);
        currentInstance.setState({ loading: false });
        Alert.alert('No network connection', 'Please check your internet connection and try again');
    }
};

const getFieldLabelView = (mandatory, validLable) => {
    let view = null;
    if (mandatory) {
        view = (
            <Text style={[fontStyles.fieldLabel, { color: 'red', fontSize: 16 }]}>*</Text>
        );
    }
    return (
        <View style={{ flex: .5, justifyContent: 'flex-start' }}>
            <Text style={[commonStyles.label, fontStyles.fieldLabel]}>{validLable}</Text>
            <View style={commonStyles.mandatory}>
                {view}
            </View>
        </View>
    );
}

export const getDataHelper = async (currentInstance) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    const vtigerSeven = loginDetails.vtigerVersion > 6;

    try {
        const param = {
            record: currentInstance.state.recordId
        };
        if (vtigerSeven) {
            param.module = currentInstance.props.moduleName;
        }
        const responseJson = await API_fetchRecord(param);
        if (responseJson.success) {
            const record = responseJson.result.record;
            const formInstance = currentInstance.state.inputInstance;
            const fields = Object.keys(record);
            const formArray = [];
            const tmpArray = [];

            for (let i = 0; i < formInstance.length; i++) {
                formArray.push(formInstance[i].state.fieldName);
            }

            for (let i = 0; i < fields.length; i++) {
                for (let j = 0; j < fields.length; j++) {
                    if (fields[i] === formArray[j]) {
                        tmpArray.push({ feild: formArray[j], feildValue: record[fields[i]] });
                        break;
                    }
                }
            }

            if (!vtigerSeven) {
                for (let i = 0; i < formInstance.length; i++) {
                    for (let j = 0; j < tmpArray.length; j++) {
                        if (tmpArray[j].feild === formInstance[i].state.fieldName) {
                            if (formInstance[i].state.reference) {
                                formInstance[i].setState({ referenceValue: tmpArray[j].feildValue.label });
                                formInstance[i].setState({ saveValue: tmpArray[j].feildValue.value });
                            } else {
                                formInstance[i].setState({ saveValue: tmpArray[j].feildValue });
                            }
                            break;
                        }
                    }
                }
            } else {
                for (let i = 0; i < formInstance.length; i++) {
                    for (let j = 0; j < tmpArray.length; j++) {
                        if (tmpArray[j].feild === formInstance[i].state.fieldName) {
                            let formattedDate;
                            if (formInstance[i].state.reference) {
                                formInstance[i].setState({ referenceValue: tmpArray[j].feildValue.label });
                                formInstance[i].setState({ saveValue: tmpArray[j].feildValue.value });
                            } else {
                                formInstance[i].setState({ saveValue: formattedDate || tmpArray[j].feildValue });
                            }
                            break;
                        }
                    }
                }
            }
        } else {
            Alert.alert('Api error', 'Api response error. Vtiger is modified');
        }
    } catch (error) {
        console.log(error);
        Alert.alert('No network connection', 'Please check your internet connection and try again');
    }
};

export const saveRecordHelper = (currentInstance, headerInstance, dispatch, listerInstance) => {
    const formInstance = currentInstance.state.inputInstance;
    const jsonObj = {};
    const lineitemsObj = [];
    let productObj = null;

    for (let i = 0; i < formInstance.length; i++) {
        const fieldName = formInstance[i].state.fieldName;
        const value = formInstance[i].state.saveValue;

        jsonObj[fieldName] = value;
        if (currentInstance.props.moduleName === 'Invoice' || currentInstance.props.moduleName === 'Quotes') {
            if (fieldName !== 'quantity' || fieldName !== 'listprice') {
                jsonObj[fieldName] = value;
            }
            if (fieldName === 'productid' || fieldName === 'quantity' || fieldName === 'listprice') {
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
        lineitemsObj.push(productObj);
    }

    if (currentInstance.props.moduleName === 'Invoice' || currentInstance.props.moduleName === 'Quotes') {
        jsonObj['LineItems'] = lineitemsObj;
    }

    doSaveRecord(currentInstance, headerInstance, jsonObj, dispatch, listerInstance);
};

const doSaveRecord = async (currentInstance, headerInstance, jsonObj, dispatch, listerInstance) => {
    try {
        for (const field of currentInstance.state.inputInstance) {
            if (field.state.error) {
                field.setState({ showError: true });
                throw Error(`${field.state.error} at ${field.props.obj.lable}`);
            }
        }
        //TODO check with recordId = ''
        const responseJson = await API_saveRecord(currentInstance.props.moduleName, JSON.stringify(jsonObj), currentInstance.state.recordId);
        if (responseJson.success) {
            headerInstance.setState({ loading: false });
            let message;
            if (this.state.recordId) {
                message = 'Successfully edited';
            } else {
                message = 'Successfully added';
            }
            Toast.show(message);
            dispatch(saveSuccess('saved'));
            // const resetAction = NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({ routeName: 'HomeScreen' })
            //     ]
            // });

            currentInstance.props.navigation.pop();
            listerInstance.refreshData();
            //currentInstance.props.navigation.goBack(null);
        } else {
            headerInstance.setState({ loading: false });
            if (responseJson.error.message === '') {
                Alert.alert('Can not save record', 'Vtiger API error');
            } else {
                Alert.alert('Can not save record', responseJson.error.message);
            }
        }
    } catch (e) {
        console.log(e);
        headerInstance.setState({ loading: false });
        Alert.alert('Can not save record', e.message);
    }
};

export const copyAddress = (currentInstance, headerInstance) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;
        const vtigerSeven = loginDetails.vtigerVersion > 6;

        const formInstance = currentInstance.state.inputInstance;
        let emptyFlag = true;
        for (let i = 0; i < formInstance.length; i++) {
            const { recordViewer } = store.getState();
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
                    break;
            }

            if (targetAddress !== undefined) {
                if (checkValue !== '' && targetAddress.length > 0) {
                    targetAddress = targetAddress.filter((item) => item.name === checkValue).map(({ value }) => ({ value }));
                    if (targetAddress.length > 0) {
                        formInstance[i].setState({ saveValue: (vtigerSeven) ? targetAddress[0].value : targetAddress[0].value.value });
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
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;
        const vtigerSeven = loginDetails.vtigerVersion > 6;
        const formInstance = currentInstance.state.inputInstance;
        let pfields = priceFields;
        let sfields = stockFields;

        for (let i = 0; i < formInstance.length; i++) {
            if (formInstance[i].state.fieldName === 'listprice') {
                pfields = pfields.filter((item) => item.name === 'unit_price').map(({ value }) => ({ value }));
                let val;
                if (vtigerSeven) {
                    val = Number(pfields[0].value).toFixed(2);
                } else {
                    val = Number(pfields[0].value.value).toFixed(2);
                }
                formInstance[i].setState({ saveValue: val });
                // formInstance[i].setState({ saveValue: pfields[0].value });
            }
            if (formInstance[i].state.fieldName === 'quantity') {
                sfields = sfields.filter((item) => item.name === 'qty_per_unit').map(({ value }) => ({ value }));
                const qunatity = (vtigerSeven) ? sfields[0].value : sfields[0].value.value;
                // const qunatity = (vtigerSeven) ? sfields : sfields[0].value.value;
                // const qunatity = sfields[0].value;
                formInstance[i].setState({ saveValue: (qunatity === '0.00') ? '1' : qunatity });
            }
        }
    } catch (error) {
        console.log(error);
    }
};
