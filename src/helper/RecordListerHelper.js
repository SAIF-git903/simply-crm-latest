import React from 'react';
import Toast from 'react-native-simple-toast';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { getDatafromNet } from './networkHelper';
import store from '../store';
import RecordItem from '../components/recordLister/recordItem';

import { UPDATE_RECORD_VIEWER } from '../actions/types';
import {
    CAMPAIGNS, VENDORS, FAQ, QUOTES, PURCHASEORDER, SALESORDER,
    INVOICE, PRICEBOOKS, CALENDAR, LEADS, ACCOUNTS, CONTACTS, OPPORTUNITIES,
    PRODUCTS, DOCUMENTS, TICKETS, PBXMANAGER, SERVICECONTRACTS, SERVICES,
    ASSETS, SMS_NOTIFIER, PROJECT_MILESTONE, PROJECT_TASK, MODULE_PROJECT,
    COMMENTS, CURRENCY
} from '../variables/constants';
import { addDatabaseKey } from '.';

import { fontStyles } from '../styles/common';

const moment = require('moment-timezone');

const styles = StyleSheet.create({
    list: {
        margin: 10,
        marginTop: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        borderRadius: 3,
        overflow: 'visible'
    },
    listWrapper: {
        marginTop: 10
    },
    emptyList: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})

const renderEmpty = () => {
    return (
        <View
            style={styles.emptyList}
        >
            <Text style={fontStyles.fieldLabel}>No records found.</Text>
        </View>
    );
}

export const fetchRecordHelper = async (listerInstance, dispatch, refresh, addExisting, moduleName) => {
    //First checking if any data in offline.
    try {
        // const offlineData = JSON.parse(await AsyncStorage.getItem(listerInstance.props.moduleName));
        // if (offlineData !== null) {
        //     console.log('offline data available')
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
        await getDataFromInternet(listerInstance, false, {}, dispatch, refresh, addExisting, moduleName);
        // }
    } catch (error) {
        //Offline data is not available
        await getDataFromInternet(listerInstance, false, {}, dispatch, refresh, addExisting);
    }
};

export const viewRecord = async (recordId, listerInstance, dispatch) => {
    const { event } = store.getState();
    const width = event.width;
    const isPortrait = event.isPortrait;
    if (isPortrait) {
        listerInstance.setState({ selectedIndex: -1 });
        dispatch({
            type: UPDATE_RECORD_VIEWER,
            payload: {
                navigation: listerInstance.props.navigation,
                moduleName: listerInstance.props.moduleName,
                showBackButton: true,
                moduleLable: listerInstance.props.moduleLable,
                recordId
            }
        });
        const navigation = listerInstance.props.navigation;
        navigation.navigate('Record Details');
    } else {
        if (width > 600) {
            //It is a tablet
            if (isPortrait) {
                listerInstance.setState({ selectedIndex: -1 });
            }

            dispatch({
                type: UPDATE_RECORD_VIEWER,
                payload: {
                    navigation: listerInstance.props.navigation,
                    moduleName: listerInstance.props.moduleName,
                    showBackButton: true,
                    moduleLable: listerInstance.props.moduleLable,
                    recordId
                }
            });
        } else {
            //It is a phone open
            //console.log("Record viewer It is a phone");

            listerInstance.setState({ selectedIndex: -1 });
            dispatch({
                type: UPDATE_RECORD_VIEWER,
                payload: {
                    navigation: listerInstance.props.navigation,
                    moduleName: listerInstance.props.moduleName,
                    showBackButton: true,
                    moduleLable: listerInstance.props.moduleLable,
                    recordId
                }
            });
            const navigation = listerInstance.props.navigation;
            navigation.navigate('Record Details');
        }
    }
};

const getDataFromInternet = async (listerInstance, offlineAvailable, offlineData, dispatch, refresh, addExisting, moduleName) => {
    //Getting data from internet
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        const vtigerSeven = loginDetails.vtigerVersion > 6;
        let param = new FormData();
        if (!vtigerSeven) {
            appendParamFor(listerInstance.props.moduleName, param);
        } else {
            param.append('_operation', 'listModuleRecords');
            param.append('module', listerInstance.props.moduleName);
        }
        param.append('page', listerInstance.state.pageToTake);
        param.append('limit', 25);
        const responseJson = await getDatafromNet(param, dispatch);
        if (responseJson.success) {
            await getAndSaveDataVtiger(responseJson, listerInstance, vtigerSeven, refresh, addExisting, moduleName, dispatch);
        } else {
            processError(listerInstance, offlineData, offlineAvailable, addExisting);
        }
    } catch (error) {
        processError(listerInstance, offlineData, offlineAvailable, addExisting);
    }
};

const processError = (listerInstance, offlineData, offlineAvailable, addExisting) => {
    let updState;
    if (!addExisting) {
        updState = {
            loading: false,
            isFlatListRefreshing: false,
        };
    } else {
        updState = {
            isFlatListRefreshing: false,
            nextPage: true,
            pageToTake: listerInstance.state.pageToTake - 1,
        };
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
}

const getAndSaveDataVtiger = async (responseJson, listerInstance, vtigerSeven, refresh, addExisting, moduleName, dispatch) => {
    let data;
    const previousDataLength = listerInstance.state.data.length;
    if (addExisting) {
        data = listerInstance.state.data;
    } else {
        data = [];
    }

    let records = responseJson.result.records;
    if (records === null) {
        records = [];
    }

    if (listerInstance.props.moduleName === INVOICE) {
        await saveInvoiceDetails(records, data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName, dispatch);
    } else {
        for (const record of records) {
            data.push(getListerModifiedRecord(listerInstance, vtigerSeven, responseJson, record));
        }
        await saveData(data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName);
    }
};

function getListerModifiedRecord(listerInstance, vtigerSeven, responseJson, record) {
    let modifiedRecord = {};
    let modules = getAllowedModules();
    if (modules.includes(listerInstance.props.moduleName)) {
        let fields = getFieldsForModule(listerInstance.props.moduleName);
        //at first - copy all get CRM values to object with needed keys
        for (const [fieldKey, fieldValue] of Object.entries(fields)) {
            modifiedRecord[fieldKey] = record[fieldValue];
        }
        //then specially change some fields for some modules
        switch (listerInstance.props.moduleName) {
            case LEADS:
            case CONTACTS:
                modifiedRecord.contactsLable = (modifiedRecord.firstname)
                    ? `${modifiedRecord.firstname} ${modifiedRecord.lastname}`
                    : modifiedRecord.lastname;
                delete modifiedRecord.firstname;
                delete modifiedRecord.lastname;
                break;
            case OPPORTUNITIES:
                modifiedRecord.amount = Number(modifiedRecord.amount).toFixed(2);
                break;
            case PRODUCTS:
                modifiedRecord.quantity = Number(modifiedRecord.qtyinstock).toFixed(2);
                break;
            default:
                //if no change is required
                break;
        }
        if ([CALENDAR].includes(listerInstance.props.moduleName)) {
            modifiedRecord.id = `${(record.type === 'Task') ? '9' : '18'}x${record.id}`;
        } else {
            modifiedRecord.id = `${listerInstance.props.moduleId}x${record.id}`;
        }
    } else {
        modifiedRecord = {
            lable: (vtigerSeven)
                ? record[responseJson.result.headers[0].name]
                : record.label,
            id: `${listerInstance.props.moduleId}x${record.id}`,
        };
    }
    return modifiedRecord;
}

const saveInvoiceDetails = async (records, data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName, dispatch) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        const moduleId = loginDetails.modules.filter((item) => item.name === 'Invoice').map(({ id }) => (id));

        //TODO think about improve speed = do process like others ?
        for (const record of records) {
            const param = new FormData();

            param.append('_operation', 'fetchRecordWithGrouping');
            param.append('module', 'Invoice');
            param.append('record', `${moduleId}x${record.id}`);
            param.append('_session', loginDetails.session);

            const responseJson = await getDatafromNet(param, dispatch);
            const blocks = responseJson.result.record.blocks;
            const detailsFeilds = blocks.filter((item) => item.label === 'Invoice Details').map(({ fields }) => (fields));
            // const itemdetailsFeilds = blocks.filter((item) => item.label === 'Item Details').map(({ fields }) => (fields));

            const accountObj = detailsFeilds[0].filter((item) => item.name === 'account_id').map(({ value }) => (value));
            const amountObj = detailsFeilds[0].filter((item) => item.name === 'hdnGrandTotal').map(({ value }) => (value));
            const itemObj = detailsFeilds[0].filter((item) => item.name === 'assigned_user_id').map(({ value }) => (value));
            const invoiceNoObj = detailsFeilds[0].filter((item) => item.name === 'invoice_no').map(({ value }) => (value));


            // const invoiceDateObj = detailsFeilds[0].filter((item) => item.name === 'invoicedate').map(({ value }) => (value));
            // const dueDateObj = detailsFeilds[0].filter((item) => item.name === 'duedate').map(({ value }) => (value));

            const modifiedRecord = {
                invoiceLable: record.subject,
                invoiceStatus: record.invoicestatus,
                invoiceAmount: Number(amountObj[0]).toFixed(2),
                invoiceAccountId: accountObj[0].label,
                invoiceItemName: itemObj[0].label,
                invoiceNo: invoiceNoObj[0],
                // invoiceDate: invoiceDateObj[0],
                // dueDate: dueDateObj[0],
                id: `${moduleId}x${record.id}`
            };
            data.push(modifiedRecord);
        }
        await saveData(data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName);
    } catch (error) {
        console.log(error);
    }
};

const saveData = async (data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName) => {
    try {
        let offlineData;
        let statusText;

        if (data.length > 0) {
            // the array is defined and has at least one element
            statusText = 'Loading complete - Recently updated Pull to refresh';
            offlineData = {
                records: data,
                nextPage: (vtigerSeven) ? (responseJson.result.moreRecords) : (responseJson.result.nextPage > 0),
                finishedTime: JSON.stringify(moment()),
                pageToTake: (vtigerSeven) ? parseInt(responseJson.result.page, 10) : responseJson.result.nextPage
            };

            if (addExisting) {
                if (!previousDataLength > 300) {
                    await AsyncStorage.setItem(listerInstance.props.moduleName, JSON.stringify(offlineData));
                    await addDatabaseKey(listerInstance.props.moduleName);

                    statusText = 'Loading complete - Recently updated Pull to refresh';
                }
            } else {
                await AsyncStorage.setItem(listerInstance.props.moduleName, JSON.stringify(offlineData));
                await addDatabaseKey(listerInstance.props.moduleName);
                statusText = 'Loading complete - Recently updated Pull to refresh';
            }
        } else {
            offlineData = {
                records: data,
                nextPage: false,
                finishedTime: JSON.stringify(moment()),
                pageToTake: 0
            };
            statusText = 'Loading complete - Module is Empty';
        }
        if (refresh) {
            listerInstance.setState({
                isFlatListRefreshing: false,
                statusText,
                statusTextColor: '#000000',
                data: offlineData.records,
                nextPage: offlineData.nextPage,
                pageToTake: offlineData.pageToTake
            });
        } else {
            if (moduleName !== listerInstance.props.moduleName) {
                console.log('Module name was: ' + moduleName)
                console.log('but correct is: ' + listerInstance.props.moduleName)
                return;
            }

            listerInstance.setState({
                loading: false,
                statusText,
                statusTextColor: '#000000',
                data: offlineData.records,
                nextPage: offlineData.nextPage,
                pageToTake: offlineData.pageToTake
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// const getAndSaveDataVtigerSeven = (responseJson, listerInstance) => {
//     const data = [];
//     switch (listerInstance.props.moduleName) {
//         case CAMPAIGNS: {
//             const records = responseJson.result.records;
//             for (const record of records) {
//                 const modifiedRecord = { lable: record.campaignname,
//                                             id: record.id };
//                 data.push(modifiedRecord);
//             }
//             break;
//         }
//         default : {
//             const records = responseJson.result.records;
//             for (const record of records) {
//                 const modifiedRecord = { lable: record[responseJson.result.headers[0].name],
//                     id: record.id };
//                 data.push(modifiedRecord);
//             }
//         }
//     }
//     const offlineData = { records: data,
//         nextPage: responseJson.result.moreRecords,
//         finishedTime: JSON.stringify(moment()), 
//         pageToTake: responseJson.result.page + 1 };
//     AsyncStorage.setItem(listerInstance.props.moduleName, JSON.stringify(offlineData));
//     listerInstance.setState({
//         loading: false,
//         statusText: 'Loading complete - Recently updated Pull to refresh',
//         statusTextColor: '#000000',
//         data: offlineData.records,
//         nextPage: offlineData.nextPage,
//         pageToTake: offlineData.pageToTake
//    });
// };

const getFieldsForModule = (moduleName) => {
    let fields = {};
    //fields = { key: value }
    //key - field name for mobileapp
    //value - CRM database field name
    switch (moduleName) {
        case CAMPAIGNS: {
            fields = {
                lable: 'campaignname',
            };
            break;
        }
        case VENDORS: {
            fields = {
                vendorName: 'vendorname',
                vendorEmail: 'email',
                vendorPhone: 'phone',
                vendorWebsite: 'website',
            };
            break;
        }
        case FAQ: {
            fields = {
                question: 'question',
            };
            break;
        }
        case QUOTES: {
            fields = {
                quoteLable: 'subject',
                total: 'hdnGrandTotal',
                quoteStage: 'quotestage',
            };
            break;
        }
        case PURCHASEORDER: {
            fields = {
                poLable: 'subject',
                status: 'postatus',
            };
            break;
        }
        case SALESORDER: {
            fields = {
                soLable: 'subject',
                status: 'sostatus',
            };
            break;
        }
        // case INVOICE: {
        //     //invoice process in special function
        //     break;
        // }
        case PRICEBOOKS: {
            fields = {
                bookLable: 'bookname',
            };
            break;
        }
        case CALENDAR: {
            fields = {
                eventLable: 'subject',
            };
            break;
        }
        case LEADS: {
            fields = {
                firstname: 'firstname',
                lastname: 'lastname',
                phone: 'phone',
                email: 'email',
            };
            break;
        }
        case ACCOUNTS: {
            fields = {
                accountsLable: 'accountname',
                website: 'website',
                phone: 'phone',
                email: 'email1',
            };
            break;
        }
        case CONTACTS: {
            fields = {
                firstname: 'firstname',
                lastname: 'lastname',
                phone: 'phone',
                email: 'email',
            };
            break;
        }
        case OPPORTUNITIES: {
            fields = {
                potentialLable: 'potentialname',
                amount: 'amount',
                stage: 'sales_stage',
            };
            break;
        }
        case PRODUCTS: {
            fields = {
                productLable: 'productname',
                no: 'product_no',
                discontinued: 'discontinued',
                productcategory: 'productcategory',
                qtyinstock: 'qtyinstock',
            };
            break;
        }
        case DOCUMENTS: {
            fields = {
                documentLable: 'notes_title',
            };
            break;
        }
        case TICKETS: {
            fields = {
                ticketLable: 'ticket_title',
                priority: 'ticketpriorities',
            };
            break;
        }
        case PBXMANAGER: {
            fields = {
                number: 'customernumber',
            };
            break;
        }
        case SERVICECONTRACTS: {
            fields = {
                scLable: 'subject',
            };
            break;
        }
        case SERVICES: {
            fields = {
                serviceLable: 'servicename',
            };
            break;
        }
        case ASSETS: {
            fields = {
                assetLable: 'assetname',
            };
            break;
        }
        case SMS_NOTIFIER: {
            fields = {
                message: 'message',
            };
            break;
        }
        case PROJECT_MILESTONE: {
            fields = {
                pmLable: 'projectmilestonename',
            };
            break;
        }
        case PROJECT_TASK: {
            fields = {
                ptLable: 'projecttaskname',
            };
            break;
        }
        case MODULE_PROJECT: {
            fields = {
                projectLable: 'projectname',
            };
            break;
        }
        case COMMENTS: {
            fields = {
                comment: 'commentcontent',
            };
            break;
        }
        case CURRENCY: {
            fields = {
                currency_name: 'currency_name',
            };
            break;
        }
        default: {
            break;
        }
    }
    return fields;
}

const getAllowedModules = () => {
    return [
        CAMPAIGNS,          VENDORS,        FAQ,
        QUOTES,             PURCHASEORDER,  SALESORDER,
        INVOICE,            PRICEBOOKS,     CALENDAR,
        LEADS,              ACCOUNTS,       CONTACTS,
        OPPORTUNITIES,      PRODUCTS,       DOCUMENTS,
        TICKETS,            PBXMANAGER,     SERVICECONTRACTS,
        SERVICES,           ASSETS,         SMS_NOTIFIER,
        PROJECT_MILESTONE,  PROJECT_TASK,   MODULE_PROJECT,
        COMMENTS,           CURRENCY,
    ];
}

export const appendParamFor = (moduleName, param) => {
    console.log(`Appending module name: ${moduleName}`);
    let modules = getAllowedModules();
    if (modules.includes(moduleName)) {
        let joinedFields;
        if (moduleName === INVOICE) {
            joinedFields = '*';
        } else {
            let fields = getFieldsForModule(moduleName);
            joinedFields = 'id';
            if (Object.keys(fields).length > 0) {
                joinedFields += ',' + Object.keys(fields).join(',');
            }
        }
        param.append('_operation', 'query');
        param.append('query', `select ${joinedFields} from ${moduleName} ORDER BY modifiedtime DESC`);
    } else {
        param.append('_operation', 'listModuleRecords');
        param.append('module', moduleName);
    }
};

export const deleteRecordHelper = async (listerInstance, recordId, index, callback, dispatch) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    const recordIdClean = recordId.toString().replace(/.*(?=x)+x/, '');

    try {
        const vtigerSeven = loginDetails.vtigerVersion > 6;
        let param = new FormData();
        param.append('_operation', 'deleteRecords');
        if (!vtigerSeven) {
            param.append('record', recordId);
        } else {
            param.append('module', listerInstance.props.moduleName);
            param.append('record', recordIdClean);
        }
        const responseJson = await getDatafromNet(param, dispatch);
        if (responseJson.success) {
            const obj = responseJson.result.deleted;
            const result = obj[Object.keys(obj)[0]];
            if (result) {
                //Successfully deleted.
                await removeThisIndex(listerInstance, index);
                if (callback && typeof (callback) === 'function') {
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
    const offlineData = JSON.parse(await AsyncStorage.getItem(listerInstance.props.moduleName));
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
                await AsyncStorage.setItem(listerInstance.props.moduleName, JSON.stringify(offlineData));
                await addDatabaseKey(listerInstance.props.moduleName);
                listerInstance.setState({
                    data: offlineData.records,
                });
            }
        }
    }
};

export const recordListRendererHelper = (listerInstance) => {
    return (
        <FlatList
            ListEmptyComponent={renderEmpty()}
            style={styles.listWrapper}
            contentContainerStyle={styles.list}
            onRefresh={listerInstance.refreshData.bind(listerInstance)}
            data={listerInstance.state.data}
            refreshing={listerInstance.state.isFlatListRefreshing}
            ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : null}
            onEndReachedThreshold={0.1}
            onEndReached={listerInstance.onEndReached.bind(listerInstance)}
            onMomentumScrollBegin={() => {
                listerInstance.onEndReachedCalledDuringMomentum = false;
            }}
            renderItem={({ item, index }) =>
                getItem(listerInstance, item, index)
            }
        />
    );
};

const getItem = (listerInstance, item, index) => {
    let recordName;
    let label = [];

    switch (listerInstance.props.moduleName) {
        case CAMPAIGNS: {
            recordName = item.lable;
            break;
        }
        case CONTACTS: {
            recordName = item.contactsLable;
            label = [
                item.email
            ];
            break;
        }
        case VENDORS: {
            recordName = item.vendorName;
            label = [
                item.vendorEmail,
                item.vendorPhone,
                item.vendorWebsite
            ];
            break;
        }
        case FAQ: {
            recordName = item.question;
            break;
        }
        case QUOTES: {
            recordName = item.quoteLable;
            label = [
                item.total,
                item.quoteStage
            ];
            break;
        }
        case PURCHASEORDER: {
            recordName = item.polable;
            label = [
                item.status
            ];
            break;
        }
        case SALESORDER: {
            recordName = item.soLable;
            label = [
                item.status
            ];
            break;
        }
        case INVOICE: {
            recordName = item.invoiceLable;
            label = [
                item.invoiceNo,
                item.invoiceStatus,
                item.invoiceAmount,
                item.invoiceAccountId,
                item.invoiceItemName,
            ];
            break;
        }
        case PRICEBOOKS: {
            recordName = item.bookLable;
            break;
        }
        case CALENDAR: {
            recordName = item.eventLable;
            break;
        }
        case LEADS: {
            recordName = item.contactsLable;
            label = [
                item.email
            ];
            break;
        }
        case ACCOUNTS: {
            recordName = item.accountsLable;
            label = [
                item.website,
                item.phone,
                item.email,
            ];
            break;
        }
        case OPPORTUNITIES: {
            recordName = item.potentialLable;
            label = [
                item.amount,
                item.stage
            ];
            break;
        }
        case PRODUCTS: {
            recordName = item.productLable;
            label = [
                item.no,
                item.productcategory,
                item.quantity
            ];
            break;
        }
        case DOCUMENTS: {
            recordName = item.documentLable;
            break;
        }
        case TICKETS: {
            recordName = item.ticketLable;
            label = [
                item.priority
            ];
            break;
        }
        case PBXMANAGER: {
            recordName = item.number;
            break;
        }
        case SERVICECONTRACTS: {
            recordName = item.scLable;
            break;
        }
        case SERVICES: {
            recordName = item.serviceLable;
            break;
        }
        case ASSETS: {
            recordName = item.assetLable;
            break;
        }
        case SMS_NOTIFIER: {
            recordName = item.message;
            break;
        }
        case PROJECT_MILESTONE: {
            recordName = item.pmLable;
            break;
        }
        case PROJECT_TASK: {
            recordName = item.ptLable;
            break;
        }
        case MODULE_PROJECT: {
            recordName = item.projectLable;
            break;
        }
        case COMMENTS: {
            recordName = item.comment;
            break;
        }
        case CURRENCY: {
            recordName = item.currency_name;
            break;
        }
        default: {
            recordName = item.lable;
            break;
        }
    }

    return (
        <RecordItem
            index={index}
            selectedIndex={listerInstance.state.selectedIndex}
            listerInstance={listerInstance}
            item={item}
            recordName={recordName}
            labels={label}
            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
        />
    );
}
