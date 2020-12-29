import React from 'react';
import { Alert, View } from 'react-native';
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
import ReferenceForm from '../components/addRecords/inputComponents/referenceType';
import { saveSuccess } from '../actions';

export const describeRecordHelper = async (addInstance) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    const param = new FormData();
    param.append('_session', loginDetails.session);
    param.append('_operation', 'structure');
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

                    if (addInstance.props.moduleName === 'Calendar' && fArr.name === 'contact_id') {
                        continue;
                    }

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

                    const fieldObj = {
                        name: fArr.name,
                        lable: fArr.label,
                        mandatory: fArr.mandatory,
                        type: fArr.type,
                        nullable: fArr.nullable,
                        editable: fArr.masseditable,
                        default: fArr.default
                    };
                    // if (fieldObj.name.includes('currency') && fieldObj.name.match(/\d+$/) && addInstance.props.moduleName === 'Products') {
                    //     currencyArr.push({ label: fieldObj.lable, value: fieldObj.lable });
                    // }
                    if (fieldObj.editable && !(fieldObj.name.includes('currency') && fieldObj.type.name === 'double')) {
                        let type = fieldObj.type.name;

                        // if (type === 'currency' && fieldObj.name === 'unit_price' && addInstance.props.moduleName === 'Products') {
                        //     type = 'picklist';
                        //     fieldObj.type.picklistValues = currencyArr;
                        // }

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
                                            navigate={addInstance.props.navigation}
                                            moduleName={addInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                            key={i}

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
                                            navigate={addInstance.props.navigation}
                                            moduleName={addInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                            key={i}
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
                                            navigate={addInstance.props.navigation}
                                            moduleName={addInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                            key={i}
                                        />
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                    </View>
                                );
                                break;

                            case 'phone':
                            case 'currency':
                            case 'integer':
                            case 'double':
                                if (fieldObj.name !== 'shipping_&_handling_') {
                                    formArray.push(
                                        <View
                                            sequence={fArr.sequence}
                                        >
                                            <NumericForm
                                                obj={fieldObj}
                                                navigate={addInstance.props.navigation}
                                                moduleName={addInstance.props.moduleName}
                                                formId={i}
                                                ref={(ref) => formInstance.push(ref)}
                                                key={i}
                                            />
                                            <View style={{ width: '100%', height: 1, backgroundColor: '#f2f3f8' }} />
                                        </View>
                                    );
                                }
                                break;
                            case 'date':
                                formArray.push(
                                    <View
                                        sequence={fArr.sequence}
                                        key={fieldObj.name}
                                    >
                                        <DateForm
                                            obj={fieldObj}
                                            navigate={addInstance.props.navigation}
                                            moduleName={addInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                            key={i}
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
                                            navigate={addInstance.props.navigation}
                                            moduleName={addInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                            key={i}
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
                                            defaultValue={
                                                fieldObj.name === 'currency_id'
                                                    ? store.getState().UserReducer.userData.currency_id
                                                    : null
                                            }
                                            obj={fieldObj}
                                            navigate={addInstance.props.navigation}
                                            moduleName={addInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => { (ref !== null) ? formInstance.push(ref) : undefined; }}
                                            userId={loginDetails.userId}
                                            onCopyPriceDetails={addInstance.onCopyPriceDetails.bind(addInstance)}
                                            key={i}
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
                                            navigate={addInstance.props.navigation}
                                            moduleName={addInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                            key={i}
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
                                            navigate={addInstance.props.navigation}
                                            moduleName={addInstance.props.moduleName}
                                            formId={i}
                                            ref={(ref) => formInstance.push(ref)}
                                            key={i}
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
                )
            }

            // Sort sections
            content.sort((a, b) => a.props.sequence - b.props.sequence);

            addInstance.setState({ ...addInstance.state, inputForm: content, inputInstance: formInstance, loading: false });

        } else {
            //console.log('Failed');
            addInstance.setState({ loading: false });
            Alert.alert('Api error', 'Api response error.Vtiger is modified');
        }
    } catch (error) {
        console.log(error);
        addInstance.setState({ loading: false });
        Alert.alert('No network connection', 'Please check your internet connection and tryagin');
    }
};

export const saveRecordHelper = (addInstance, headerInstance, dispatch, listerInstance) => {
    const formInstance = addInstance.state.inputInstance;
    const jsonObj = {};
    const lineitemsObj = [];
    let productObj = null;

    for (let i = 0; i < formInstance.length; i++) {
        const fieldName = formInstance[i].state.fieldName;
        const value = formInstance[i].state.saveValue;

        jsonObj[fieldName] = value;
        if (addInstance.props.moduleName === 'Invoice' || addInstance.props.moduleName === 'Quotes') {
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

    if (addInstance.props.moduleName === 'Invoice' || addInstance.props.moduleName === 'Quotes') {
        jsonObj['LineItems'] = lineitemsObj;
    }

    addRecordHelper(addInstance, headerInstance, jsonObj, dispatch, listerInstance);
};

const addRecordHelper = async (addInstance, headerInstance, jsonObj, dispatch, listerInstance) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    const obj = JSON.stringify(jsonObj);

    const param = new FormData();
    param.append('_session', loginDetails.session);
    param.append('_operation', 'saveRecord');
    param.append('module', addInstance.props.moduleName);
    param.append('values', obj);

    try {
        for (const field of addInstance.state.inputInstance) {
            if (field.state.error) {
                field.setState({ showError: true })
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
            console.log(responseJson);
            headerInstance.setState({ loading: false });
            Toast.show('Successfully Added');
            dispatch(saveSuccess('saved'));
            // const resetAction = NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({ routeName: 'HomeScreen' })
            //     ]
            // });

            addInstance.props.navigation.pop();
            listerInstance.refreshData();
            //addInstance.props.navigation.goBack(null);
        } else {
            headerInstance.setState({ loading: false });
            if (responseJson.error.message === '') {
                Alert.alert('', 'Vtiger API error');
            } else {
                Alert.alert('', responseJson.error.message);
            }
        }
    } catch (e) {
        console.log(e);
        headerInstance.setState({ loading: false });
        Alert.alert('', e.message);
    }
};

export const copyAddress = (addInstance, headerInstance) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        const formInstance = addInstance.state.inputInstance;
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

            }

            if (targetAddress !== undefined) {
                if (checkValue !== '' && targetAddress.length > 0) {

                    targetAddress = targetAddress.filter((item) => item.name === checkValue).map(({ value }) => ({ value }));

                    if (targetAddress.length > 0) {
                        formInstance[i].setState({ saveValue: (loginDetails.vtigerVersion === 7) ? targetAddress[0].value : targetAddress[0].value.value });
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
            // Toast.show('Values are copied');
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
                formInstance[i].setState({ saveValue: (loginDetails.vtigerVersion === 7) ? Number(pfields[0].value).toFixed(2) : Number(pfields[0].value.value).toFixed(2) });
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
