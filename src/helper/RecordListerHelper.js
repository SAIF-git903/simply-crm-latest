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
    return <View
        style={styles.emptyList}
    >
        <Text style={fontStyles.fieldLabel}>No records found.</Text>
    </View>
}

export const fetchRecordHelper = async (listerInstance, dispatch, moduleName) => {
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
        await getDataFromInternet(listerInstance, false, {}, dispatch, moduleName);
        // }
    } catch (error) {
        //Offline data is not available
        await getDataFromInternet(listerInstance, false, {}, dispatch);
    }
};

export const refreshRecordHelper = async (listerInstance, dispatch) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        if (loginDetails.vtigerVersion < 7) {
            let param = new FormData();
            appendParamFor(listerInstance.props.moduleName, param);
            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, listerInstance, false, true, false);
            } else {
                //Show error to user that something went wrong.
                listerInstance.setState({
                    isFlatListRefreshing: false,
                    statusText: 'Something went wrong',
                    statusTextColor: 'red'
                });
            }
        } else {
            let param = new FormData();
            param.append('_operation', 'listModuleRecords');
            param.append('module', listerInstance.props.moduleName);
            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, listerInstance, true, true, false);
            } else {
                //Show error to user that something went wrong.
                listerInstance.setState({
                    isFlatListRefreshing: false,
                    statusText: 'Something went wrong',
                    statusTextColor: 'red'
                });
            }
        }
    } catch (error) {
        //Show error to user that something went wrong.
        listerInstance.setState({
            isFlatListRefreshing: false,
            statusText: 'Looks like no network connection',
            statusTextColor: 'red'
        });
    }
};

export const getNextPageHelper = async (listerInstance, dispatch) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        if (loginDetails.vtigerVersion < 7) {
            let param = new FormData();
            appendParamFor(listerInstance.props.moduleName, param);
            param.append('page', listerInstance.state.pageToTake);
            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, listerInstance, false, false, true, listerInstance.props.moduleName);
            } else {
                //Show error to user that something went wrong.
                listerInstance.setState({
                    isFlatListRefreshing: false,
                    statusText: 'Something went wrong',
                    statusTextColor: 'red'
                });
            }
        } else {
            let param = new FormData();
            // appendParamFor(listerInstance.props.moduleName, param);
            param.append('_operation', 'listModuleRecords');
            param.append('module', listerInstance.props.moduleName);
            param.append('page', listerInstance.state.pageToTake);
            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, listerInstance, true, false, true, listerInstance.props.moduleName);
            } else {
                //Show error to user that something went wrong.
                listerInstance.setState({
                    isFlatListRefreshing: false,
                    statusText: 'Something went wrong',
                    statusTextColor: 'red'
                });
            }
        }
    } catch (error) {
        //Show error to user that something went wrong.
        listerInstance.setState({
            isFlatListRefreshing: false,
            statusText: 'Looks like no network connection',
            statusTextColor: 'red'
        });
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

const getDataFromInternet = async (listerInstance, offlineAvailable, offlineData, dispatch, moduleName) => {
    //Getting data from internet
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        if (loginDetails.vtigerVersion < 7) {
            let param = new FormData();
            appendParamFor(listerInstance.props.moduleName, param);
            //console.log(listerInstance.state.pageToTake);
            param.append('page', listerInstance.state.pageToTake);
            const responseJson = await getDatafromNet(param, dispatch);
            // console.log(responseJson);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, listerInstance, false, false, false, moduleName);
            } else {
                if (!offlineAvailable) {
                    //Show error to user that something went wrong.
                    listerInstance.setState({
                        loading: false,
                        statusText: 'Something went wrong',
                        statusTextColor: 'red'
                    });
                } else {
                    //Show offline data and notify user
                    listerInstance.setState({
                        loading: false,
                        statusText: 'Showing Offline data - No internet Pull to refresh',
                        statusTextColor: '#000000',
                        data: offlineData.records,
                        nextPage: offlineData.nextPage,
                        pageToTake: offlineData.pageToTake
                    });
                }
            }
        } else {
            let param = new FormData();
            // if (listerInstance.props.moduleName === 'Invoice') {
            //     appendParamFor(listerInstance.props.moduleName, param);
            // } else {
            param.append('_operation', 'listModuleRecords');
            param.append('module', listerInstance.props.moduleName);
            // }

            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, listerInstance, true, false, false, moduleName);
            } else {
                if (!offlineAvailable) {
                    //Show error to user that something went wrong.
                    listerInstance.setState({
                        loading: false,
                        statusText: 'Something went wrong',
                        statusTextColor: 'red'
                    });
                } else {
                    //Show offline data and notify user
                    listerInstance.setState({
                        loading: false,
                        statusText: 'Showing Offline data - No internet Pull to refresh',
                        statusTextColor: '#000000',
                        data: offlineData.records,
                        nextPage: offlineData.nextPage,
                        pageToTake: offlineData.pageToTake
                    });
                }
            }
        }
    } catch (error) {
        if (!offlineAvailable) {
            //Show error to user that something went wrong.
            listerInstance.setState({
                loading: false,
                statusText: 'Looks like no network connection',
                statusTextColor: 'red'
            });
        } else {
            //Show offline data and notify user
            listerInstance.setState({
                loading: false,
                statusText: 'Showing Offline data - No internet Pull to refresh',
                statusTextColor: '#000000',
                data: offlineData.records,
                nextPage: offlineData.nextPage,
                pageToTake: offlineData.pageToTake
            });
        }
    }
};

const getAndSaveDataVtiger = async (responseJson, listerInstance, vtigerSeven, refresh, addExisting, moduleName) => {
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

    switch (listerInstance.props.moduleName) {
        case CAMPAIGNS: {
            for (const record of records) {
                const modifiedRecord = {
                    lable: record.campaignname,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case VENDORS: {
            for (const record of records) {
                const modifiedRecord = {
                    vendorName: record.vendorname,
                    vendorEmail: record.email,
                    vendorPhone: record.phone,
                    vendorWebsite: record.website,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case FAQ: {
            for (const record of records) {
                const modifiedRecord = {
                    question: record.question,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case QUOTES: {
            for (const record of records) {
                const modifiedRecord = {
                    quoteLable: record.subject,
                    total: record.hdnGrandTotal,
                    quoteStage: record.quotestage,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case PURCHASEORDER: {
            for (const record of records) {
                const modifiedRecord = {
                    poLable: record.subject,
                    status: record.postatus,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case SALESORDER: {
            for (const record of records) {
                const modifiedRecord = {
                    soLable: record.subject,
                    status: record.sostatus,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case INVOICE: {
            saveInvoiceDetails(records, data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName);
            break;
        }
        case PRICEBOOKS: {
            for (const record of records) {
                const modifiedRecord = {
                    bookLable: record.bookname,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case CALENDAR: {
            for (const record of records) {
                const modifiedRecord = {
                    eventLable: record.subject,
                    id: `${record.type === 'Task' ? '9' : '18'}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case LEADS: {
            for (const record of records) {
                const modifiedRecord = {
                    contactsLable: record.firstname ? `${record.firstname} ${record.lastname}` : record.lastname,
                    phone: record.phone,
                    email: record.email,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case ACCOUNTS: {
            for (const record of records) {
                const modifiedRecord = {
                    accountsLable: record.accountname,
                    website: record.website,
                    phone: record.phone,
                    email: record.email1,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case CONTACTS: {
            for (const record of records) {
                const modifiedRecord = {
                    contactsLable: record.firstname ? `${record.firstname} ${record.lastname}` : record.lastname,
                    phone: record.phone,
                    email: record.email,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case OPPORTUNITIES: {
            for (const record of records) {
                const modifiedRecord = {
                    potentialLable: record.potentialname,
                    amount: Number(record.amount).toFixed(2),
                    stage: record.sales_stage,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case PRODUCTS: {
            for (const record of records) {
                const modifiedRecord = {
                    productLable: record.productname,
                    no: record.product_no,
                    productcategory: record.productcategory,
                    quantity: Number(record.qtyinstock).toFixed(2),
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case DOCUMENTS: {
            for (const record of records) {
                const modifiedRecord = {
                    documentLable: record.notes_title,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case TICKETS: {
            for (const record of records) {
                const modifiedRecord = {
                    ticketLable: record.ticket_title,
                    priority: record.ticketpriorities,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case PBXMANAGER: {
            for (const record of records) {
                const modifiedRecord = {
                    number: record.customernumber,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case SERVICECONTRACTS: {
            for (const record of records) {
                const modifiedRecord = {
                    scLable: record.subject,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case SERVICES: {
            for (const record of records) {
                const modifiedRecord = {
                    serviceLable: record.servicename,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case ASSETS: {
            for (const record of records) {
                const modifiedRecord = {
                    assetLable: record.assetname,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case SMS_NOTIFIER: {
            for (const record of records) {
                const modifiedRecord = {
                    message: record.message,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case PROJECT_MILESTONE: {
            for (const record of records) {
                const modifiedRecord = {
                    pmLable: record.projectmilestonename,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case PROJECT_TASK: {
            for (const record of records) {
                const modifiedRecord = {
                    ptLable: record.projecttaskname,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case MODULE_PROJECT: {
            for (const record of records) {
                const modifiedRecord = {
                    projectLable: record.projectname,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case COMMENTS: {
            for (const record of records) {
                const modifiedRecord = {
                    comment: record.commentcontent,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case CURRENCY: {
            for (const record of records) {
                const modifiedRecord = {
                    currency_name: record.currency_name,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        default: {
            for (const record of records) {
                const modifiedRecord = {
                    lable: (vtigerSeven) ?
                        record[responseJson.result.headers[0].name] : record.label,
                    id: `${listerInstance.props.moduleId}x${record.id}`
                };
                data.push(modifiedRecord);
            }
        }
    }
    if (listerInstance.props.moduleName !== 'Invoice') {
        saveData(data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName);
    }
};

const saveInvoiceDetails = async (records, data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        const moduleId = loginDetails.modules.filter((item) => item.name === 'Invoice').map(({ id }) => (id));

        for (const record of records) {
            const param = new FormData();

            param.append('_operation', 'fetchRecordWithGrouping');
            param.append('module', 'Invoice');
            param.append('record', `${moduleId}x${record.id}`);
            param.append('_session', loginDetails.session);

            const response = await fetch((`${loginDetails.url}/modules/Mobile/api.php`), {
                method: 'POST',
                headers: {
                    // 'Accept': 'application/json',
                    // 'Content-Type': 'multipart/form-data; charset=utf-8',
                    'cache-control': 'no-cache',
                },
                body: param
            });
            const detailResponseJson = await response.json();

            const blocks = detailResponseJson.result.record.blocks;
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
        saveData(data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName);
    } catch (error) {
        console.log(error);
    }
};

const saveData = async (data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh, moduleName) => {
    try {
        let offlineData = {};

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

export const appendParamFor = (moduleName, param) => {
    console.log(`Appending module name: ${moduleName}`)
    switch (moduleName) {
        case CAMPAIGNS:
            param.append('_operation', 'query');
            param.append('query', 'select campaignname,id from Campaigns ORDER BY modifiedtime DESC');
            break;
        case VENDORS:
            param.append('_operation', 'query');
            param.append('query', 'select email,website,phone,vendorname, id from Vendors ORDER BY modifiedtime DESC');
            break;
        case FAQ:
            param.append('_operation', 'query');
            param.append('query', 'select question,id from Faq ORDER BY modifiedtime DESC');
            break;
        case QUOTES:
            param.append('_operation', 'query');
            param.append('query', 'select hdnGrandTotal,quotestage,subject, id from Quotes ORDER BY modifiedtime DESC');
            break;
        case PURCHASEORDER:
            param.append('_operation', 'query');
            param.append('query', 'select postatus,subject,id from PurchaseOrder ORDER BY modifiedtime DESC');
            break;
        case SALESORDER:
            param.append('_operation', 'query');
            param.append('query', 'select sostatus,subject,id from SalesOrder ORDER BY modifiedtime DESC');
            break;
        case INVOICE:
            param.append('_operation', 'query');
            param.append('query', 'select * from Invoice ORDER BY modifiedtime DESC');
            break;
        case PRICEBOOKS:
            param.append('_operation', 'query');
            param.append('query', 'select bookname,id from PriceBooks ORDER BY modifiedtime DESC');
            break;
        case CALENDAR:
            param.append('_operation', 'query');
            param.append('query', 'select subject,id from Calendar ORDER BY modifiedtime DESC');
            break;
        case LEADS:
            param.append('_operation', 'query');
            param.append('query', 'select firstnamse,lastname,phone,email,id from Leads ORDER BY modifiedtime DESC');
            break;
        case ACCOUNTS:
            param.append('_operation', 'query');
            param.append('query', 'select accountname,website,phone,email1,id from Accounts ORDER BY modifiedtime DESC');
            break;
        case CONTACTS:
            param.append('_operation', 'query');
            param.append('query', 'select firstname,lastname,phone,email,id from Contacts ORDER BY modifiedtime DESC');
            break;
        case OPPORTUNITIES:
            param.append('_operation', 'query');
            param.append('query', 'select potentialname,amount,sales_stage,id from Potentials ORDER BY modifiedtime DESC');
            break;
        case PRODUCTS:
            param.append('_operation', 'query');
            param.append('query', 'select productname,product_no,discontinued,productcategory,qtyinstock,id from Products ORDER BY modifiedtime DESC');
            break;
        case DOCUMENTS:
            param.append('_operation', 'query');
            param.append('query', 'select notes_title,id from Documents ORDER BY modifiedtime DESC');
            break;
        case TICKETS:
            param.append('_operation', 'query');
            param.append('query', 'select ticket_title,ticketpriorities,id from HelpDesk ORDER BY modifiedtime DESC');
            break;
        case PBXMANAGER:
            param.append('_operation', 'query');
            param.append('query', 'select customernumber,id from PBXManager ORDER BY modifiedtime DESC');
            break;
        case SERVICECONTRACTS:
            param.append('_operation', 'query');
            param.append('query', 'select subject,id from ServiceContracts ORDER BY modifiedtime DESC');
            break;
        case SERVICES:
            param.append('_operation', 'query');
            param.append('query', 'select servicename,id from Services ORDER BY modifiedtime DESC');
            break;
        case ASSETS:
            param.append('_operation', 'query');
            param.append('query', 'select assetname,id from Assets ORDER BY modifiedtime DESC');
            break;
        case SMS_NOTIFIER:
            param.append('_operation', 'query');
            param.append('query', 'select message,id from SMSNotifier ORDER BY modifiedtime DESC');
            break;
        case PROJECT_MILESTONE:
            param.append('_operation', 'query');
            param.append('query', 'select projectmilestonename,id from ProjectMilestone ORDER BY modifiedtime DESC');
            break;
        case PROJECT_TASK:
            param.append('_operation', 'query');
            param.append('query', 'select projecttaskname,id from ProjectTask ORDER BY modifiedtime DESC');
            break;
        case MODULE_PROJECT:
            param.append('_operation', 'query');
            param.append('query', 'select projectname,id from Project ORDER BY modifiedtime DESC');
            break;
        case COMMENTS:
            param.append('_operation', 'query');
            param.append('query', 'select commentcontent,id from ModComments ORDER BY modifiedtime DESC');
            break;
        case CURRENCY:
            param.append('_operation', 'query');
            param.append('query', 'select currency_name,id from Currency');
            break;
        default:
            param.append('_operation', 'listModuleRecords');
            param.append('module', moduleName);
            break;
    }
};

export const deleteRecordHelper = async (listerInstance, recordId,
    index, callback, dispatch) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    const recordIdClean = recordId.toString().replace(/.*(?=x)+x/, '');

    try {
        let param = new FormData();
        param.append('_operation', 'deleteRecords');
        if (loginDetails.vtigerVersion < 7) {
            param.append('record', recordId);
        } else {
            param.append('module', listerInstance.props.moduleName);
            param.append('record', recordIdClean);
        }
        const responseJson = await getDatafromNet(param, dispatch);
        if (responseJson.success) {
            const obj = responseJson.result.deleted;
            const result = obj[Object.keys(obj)[0]];
            //console.log(responseJson);
            if (result) {
                //Successfully deleted.
                await removeThisIndex(listerInstance, index);
                if (callback && typeof (callback) === 'function') callback();
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
    switch (listerInstance.props.moduleName) {
        case CAMPAIGNS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.lable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case CONTACTS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.contactsLable}
                            labels={[
                                item.email
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />
                    }
                />
            );
        }
        case VENDORS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.vendorName}
                            labels={[
                                item.vendorEmail,
                                item.vendorPhone,
                                item.vendorWebsite
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case FAQ: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.question}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case QUOTES: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.quoteLable}
                            labels={[
                                item.total,
                                item.quoteStage
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case PURCHASEORDER: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.polable}
                            labels={[
                                item.status
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case SALESORDER: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.soLable}
                            labels={[
                                item.status
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case INVOICE: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}

                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.invoiceLable}
                            labels={[
                                item.invoiceNo,
                                item.invoiceStatus,
                                item.invoiceAmount,
                                item.invoiceAccountId,
                                item.invoiceItemName,
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case PRICEBOOKS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.bookLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case CALENDAR: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}

                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.eventLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />
                    }
                />
            );
        }
        case LEADS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}

                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.contactsLable}
                            labels={[
                                item.email
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case ACCOUNTS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.accountsLable}
                            labels={[
                                item.website,
                                item.phone,
                                item.email,
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case OPPORTUNITIES: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}

                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.potentialLable}
                            labels={[
                                item.amount,
                                item.stage
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case PRODUCTS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}

                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.productLable}
                            labels={[
                                item.no,
                                item.productcategory,
                                item.quantity
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case DOCUMENTS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.documentLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case TICKETS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.ticketLable}
                            labels={[
                                item.priority
                            ]}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case PBXMANAGER: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.number}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case SERVICECONTRACTS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.scLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case SERVICES: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.serviceLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case ASSETS: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.assetLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case SMS_NOTIFIER: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.message}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case PROJECT_MILESTONE: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.pmLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case PROJECT_TASK: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.ptLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case MODULE_PROJECT: {
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.projectLable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case COMMENTS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.comment}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        case CURRENCY: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.currency_name}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
        }
        default:
            return (
                <FlatList
                    ListEmptyComponent={renderEmpty()}
                    style={styles.listWrapper}
                    contentContainerStyle={styles.list}
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <RecordItem
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            recordName={item.lable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
    }
};