import React from 'react';
import { Alert, View } from 'react-native';
import Toast from 'react-native-simple-toast';
// import { NavigationActions } from 'react-navigation';
import store from '../store';
import FormSection from '../components/common/FormSection';
import StringForm from '../components/editRecords/inputComponents/stringType';
import BooleanForm from '../components/editRecords/inputComponents/booleanType';
import PickerForm from '../components/editRecords/inputComponents/picklistType';
import NumericForm from '../components/editRecords/inputComponents/numericType';
import DateForm from '../components/editRecords/inputComponents/dateType';
import TimeForm from '../components/editRecords/inputComponents/timeType';
import MultiPickerForm from '../components/editRecords/inputComponents/multipicklistType';
import ReferenceForm from '../components/editRecords/inputComponents/referenceType';
import { saveSuccess } from '../actions';
import { structure, fetchRecord, saveRecord } from "./api";

export const describeEditRecordHelper = async (editInstance) => {
    try {
        const responseJson = await structure(editInstance.props.moduleName);
        if (responseJson.success) {
            const structures = responseJson.result.structure;

            const formInstance = [];
            const content = [];

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

                    const hiddenFields = [
                        'createdtime',
                        'modifiedtime',
                        'pricebook_no',
                        'source',
                        'starred',
                        'tags',
                        'modifiedby'
                    ];

                    if (hiddenFields.includes(fArr.name)) continue;

                    if (editInstance.props.moduleName === 'Calendar' && fArr.name === 'contact_id') {
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
                    if (fieldObj.editable) {
                        const type = fieldObj.type.name;
                        switch (type) {
                            case 'string':
                            case 'text':
                            case 'url':
                            case 'email':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <StringForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;
                            case 'boolean':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <BooleanForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;
                            case 'picklist':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <PickerForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;

                            case 'phone':
                            case 'currency':
                            case 'integer':
                            case 'double':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <NumericForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;
                            case 'date':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <DateForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;
                            case 'multipicklist':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <MultiPickerForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;
                            case 'reference':
                            case 'owner':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <ReferenceForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => {
                                                return (ref !== null) ? formInstance.push(ref) : undefined;
                                            }}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;
                            case 'time':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <TimeForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;
                            default:
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <StringForm
                                            obj={fieldObj}
                                            navigate={editInstance.props.navigation}
                                            moduleName={editInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;
                        }

                    }
                }

                if (formArray.length === 0) continue;

                // Sort fields
                formArray.sort((a, b) => a.props.sequence - b.props.sequence);

                content.push(
                    <FormSection
                        key={k}
                        sequence={parseInt(sequence)}
                        title={label}
                    >
                        {formArray}
                    </FormSection>
                );
            }

            // Sort sections
            content.sort((a, b) => a.props.sequence - b.props.sequence);

            editInstance.setState(
                { inputForm: content, inputInstance: formInstance, loading: false },
                () => { getDataHelper(editInstance); }
            );
        } else {
            //console.log('Failed');
            editInstance.setState({ loading: false });
            Alert.alert('Api error', 'Api response error.Vtiger is modified');
        }
    } catch (error) {
        //console.log(error);
        editInstance.setState({ loading: false });
        Alert.alert('No network connection', 'Please check your internet connection and try again');
    }
};

export const getDataHelper = async (editInstance) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    const vtigerSeven = loginDetails.vtigerVersion > 6;

    try {
        const param = {
            record: editInstance.props.recordId
        };
        if (vtigerSeven) {
            param.module = editInstance.props.moduleName;
        }
        const responseJson = await fetchRecord(param);
        if (responseJson.success) {
            const record = responseJson.result.record;
            const formInstance = editInstance.state.inputInstance;
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
            Alert.alert('Api error', 'Api response error.Vtiger is modified');
        }
    } catch (error) {
        console.log(error);
        Alert.alert('No network connection', 'Please check your internet connection and try again');
    }
};

export const saveEditRecordHelper = (editInstance, headerInstance, dispatch, listerInstance) => {
    const formInstance = editInstance.state.inputInstance;
    const jsonObj = {};
    const lineitemsObj = [];
    let productObj = null;

    for (let i = 0; i < formInstance.length; i++) {
        const fieldName = formInstance[i].state.fieldName;
        const value = formInstance[i].state.saveValue;

        if (editInstance.props.moduleName === 'Invoice' || editInstance.props.moduleName === 'Quotes') {
            if (fieldName !== 'quantity' || fieldName !== 'listprice') {
                jsonObj[fieldName] = value;
            }

            if (fieldName === 'productid' || fieldName === 'quantity' || fieldName === 'listprice') {
                if (!productObj) productObj = {};
                productObj[fieldName] = value;
            }
        } else {
            jsonObj[fieldName] = value;
        }
    }

    if (productObj) lineitemsObj.push(productObj);

    if (editInstance.props.moduleName === 'Invoice' || editInstance.props.moduleName === 'Quotes') {
        jsonObj['LineItems'] = lineitemsObj;
    }
    editRecordHelper(editInstance, headerInstance, jsonObj, dispatch, listerInstance);
};

const editRecordHelper = async (editInstance, headerInstance, jsonObj, dispatch, listerInstance) => {
    try {
        for (const field of editInstance.state.inputInstance) {
            if (field.state.error) {
                field.setState({ showError: true });
                throw Error(`${field.state.error} at ${field.props.obj.lable}`);
            }
        }

        const responseJson = await saveRecord(editInstance.props.moduleName, JSON.stringify(jsonObj), editInstance.props.recordId);
        if (responseJson.success) {
            Toast.show('Successfully Edited');
            dispatch(saveSuccess('saved'));
            headerInstance.setState({ loading: false });
            // const resetAction = NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({ routeName: 'HomeScreen' })
            //     ]
            // });
            editInstance.props.navigation.pop();
            listerInstance.refreshData();
            //editInstance.props.navigation.goBack(null);
        } else {
            console.log(responseJson);
            headerInstance.setState({ loading: false });
            if (responseJson.error.message === '') {
                Alert.alert('', 'Vtiger API error');
            } else {
                Alert.alert('', responseJson.error.message);
            }
            Toast.show('Edited Failed');
        }
    } catch (e) {
        console.log(e);
        headerInstance.setState({ loading: false });
        Alert.alert('', e.message);
    }
};
