import React from 'react';
import { Alert, View } from 'react-native';
import Toast from 'react-native-simple-toast';
// import { NavigationActions } from 'react-navigation';
import moment from 'moment';
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

export const describeEditRecordHelper = async (editInstance) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    const param = new FormData();
    param.append('_session', loginDetails.session);
    param.append('_operation', 'structure');
    param.append('module', editInstance.props.moduleName);

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

        if (responseJson.success) {
            //console.log(responseJson);

            const structures = responseJson.result.structure;

            const formInstance = [];
            const content = [];

            for (const structure of structures) {
                const {
                    fields,
                    label,
                    visible,
                    sequence
                } = structure;
                const formArray = [];

                let i = 0;
                for (const fArr of fields) {
                    i++;

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
                                            }
                                            }
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

                content.push(<FormSection
                    sequence={parseInt(sequence)}
                    title={label}
                >
                    {formArray}
                </FormSection>)
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
        Alert.alert('No network connection', 'Please check your internet connection and tryagin');
    }
};

export const getDataHelper = async (editInstance) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    const param = new FormData();

    try {
        if (loginDetails.vtigerVersion < 7) {
            param.append('_session', loginDetails.session);
            param.append('_operation', 'fetchRecord');
            param.append('record', editInstance.props.recordId);
        } else {
            param.append('_session', loginDetails.session);
            param.append('_operation', 'fetchRecord');
            param.append('record', editInstance.props.recordId);
            // param.append('record', editInstance.props.recordId);
            param.append('module', editInstance.props.moduleName);
        }

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

        if (responseJson.success) {
            const record = responseJson.result.record;
            const formInstance = editInstance.state.inputInstance;
            const feilds = Object.keys(record);
            const formArray = [];
            const tmpArray = [];

            for (let i = 0; i < formInstance.length; i++) {
                formArray.push(formInstance[i].state.fieldName);
                // if (formInstance[i].state.reference) {
                //     //console.log('reference');
                // }
            }

            for (let i = 0; i < feilds.length; i++) {
                for (let j = 0; j < feilds.length; j++) {
                    if (feilds[i] === formArray[j]) {
                        tmpArray.push({ feild: formArray[j], feildValue: record[feilds[i]] });
                        break;
                    }
                }
            }

            if (loginDetails.vtigerVersion < 7) {
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
            // console.log(formInstance[0].state.saveValue);
        } else {
            Alert.alert('Api error', 'Api response error.Vtiger is modified');
        }
    } catch (error) {
        console.log(error);
        Alert.alert('No network connection', 'Please check your internet connection and tryagin');
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
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    const obj = JSON.stringify(jsonObj);
    // console.log(obj);
    const param = new FormData();
    param.append('_session', loginDetails.session);
    param.append('_operation', 'saveRecord');
    param.append('module', editInstance.props.moduleName);
    param.append('record', editInstance.props.recordId);
    param.append('values', obj);

    try {
        for (const field of editInstance.state.inputInstance) {
            if (field.state.error) {
                field.setState({ showError: true });
                throw Error(`${field.state.error} at ${field.props.obj.lable}`);
            }
        }

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

        if (responseJson.success) {
            //console.log(responseJson);
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
            // console.log(responseJson);
            //console.log('Failed');
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
