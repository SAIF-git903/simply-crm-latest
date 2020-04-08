import React from 'react';
import Toast from 'react-native-simple-toast';
import { AsyncStorage, FlatList } from 'react-native';
import { getDatafromNet } from './networkHelper';
import store from '../store';
import CampaignsRecord from '../components/recordLister/recordItems/campaignsRecord';
import ContactsRecord from '../components/recordLister/recordItems/contactsRecord';
import VendorRecord from '../components/recordLister/recordItems/vendorRecord';
import FaqRecord from '../components/recordLister/recordItems/faqRecord';
import QuotesRecord from '../components/recordLister/recordItems/quotesRecord';
import PurchaseOrderRecord from '../components/recordLister/recordItems/purchaseOrderRecord';
import SalesOrderRecord from '../components/recordLister/recordItems/salesOrderRecord';
import InvoiceRecord from '../components/recordLister/recordItems/invoiceRecord';
import PriceBooksRecord from '../components/recordLister/recordItems/priceBooksRecord';
import CalendarRecord from '../components/recordLister/recordItems/calendarRecord';
import AccountsRecord from '../components/recordLister/recordItems/accountsRecord';
import OpportunitiesRecord from '../components/recordLister/recordItems/opportunitiesRecord';
import ProductsRecord from '../components/recordLister/recordItems/productsRecord';
import DocumentsRecord from '../components/recordLister/recordItems/documentsRecord';
import TicketsRecord from '../components/recordLister/recordItems/ticketsRecord';
import PbxRecord from '../components/recordLister/recordItems/pbxRecord';
import ServiceContractRecord from '../components/recordLister/recordItems/serviceContractsRecord';
import ServiceRecord from '../components/recordLister/recordItems/serviceRecord';
import AssetRecord from '../components/recordLister/recordItems/assetRecord';
import SMSnotifierRecord from '../components/recordLister/recordItems/smsnotifierRecord';
import ProjectMilestoneRecord from '../components/recordLister/recordItems/projectMilestoneRecord';
import ProjectTaskRecord from '../components/recordLister/recordItems/projectTaskRecord';
import ModuleProjectRecord from '../components/recordLister/recordItems/moduleProjectRecord';
import CommentsRecord from '../components/recordLister/recordItems/commentRecord';
import CustomRecord from '../components/recordLister/recordItems/customRecord';
import CurrencyRecord from '../components/recordLister/recordItems/currencyRecord';

import { UPDATE_RECORD_VIEWER } from '../actions/types';
import {
    CAMPAIGNS, VENDORS, FAQ, QUOTES, PURCHASEORDER, SALESORDER,
    INVOICE, PRICEBOOKS, CALENDAR, LEADS, ACCOUNTS, CONTACTS, OPPORTUNITIES,
    PRODUCTS, DOCUMENTS, TICKETS, PBXMANAGER, SERVICECONTRACTS, SERVICES,
    ASSETS, SMS_NOTIFIER, PROJECT_MILESTONE, PROJECT_TASK, MODULE_PROJECT,
    COMMENTS, CURRENCY
} from '../variables/constants';
import { addDatabaseKey } from '.';

const moment = require('moment-timezone');

export const fetchRecordHelper = async (listerInstance, dispatch) => {
    //First checking if any data in offline.
    try {
        const offlineData = JSON.parse(await AsyncStorage.getItem(listerInstance.props.moduleName));
        if (offlineData !== null) {
            //Offline data is avialable
            const offlineFinishedTime = JSON.parse(offlineData.finishedTime);
            const currentTime = moment();
            const duration = moment.duration(currentTime.diff(offlineFinishedTime));
            const durationMinutes = parseInt(duration.asMinutes(), 10);
            if (durationMinutes < 5) {
                //Show this is data itself
                listerInstance.setState({
                    loading: false,
                    statusText: 'Loading complete - Recently updated Pull to refresh',
                    statusTextColor: '#000000',
                    data: offlineData.records,
                    nextPage: offlineData.nextPage,
                    pageToTake: offlineData.pageToTake
                });
            } else {
                await getDataFromInternet(listerInstance, true, offlineData, dispatch);
            }
        } else {
            //Offline data is not available
            await getDataFromInternet(listerInstance, false, {}, dispatch);
        }
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
                await getAndSaveDataVtiger(responseJson, listerInstance, false, false, true);
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
            // console.log(responseJson);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, listerInstance, true, false, true);
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
        //console.log("Record viewer instance");
        //console.log(listerInstance.props.navigation);
        //console.log(listerInstance.props.moduleName);
        //console.log(listerInstance.props.moduleLable);
        //console.log(recordId);
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
        navigation.navigate('DetailsScreen');
    } else {
        if (width > 600) {
            //It is a tablet
            //console.log("Record viewer It is a tablet");
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
            navigation.navigate('DetailsScreen');
        }
    }
};

const getDataFromInternet = async (listerInstance, offlineAvailable, offlineData, dispatch) => {
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
                await getAndSaveDataVtiger(responseJson, listerInstance, false, false, false);
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
            console.log(responseJson);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, listerInstance, true, false, false);
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
        //console.log(error);
    }
};

const getAndSaveDataVtiger = async (responseJson, listerInstance,
    vtigerSeven, refresh, addExisting) => {
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
                    id: record.id
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
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case FAQ: {
            for (const record of records) {
                const modifiedRecord = {
                    question: record.question,
                    id: record.id
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
                    id: record.id
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
                    id: record.id
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
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case INVOICE: {
            saveInvoiceDetails(records, data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh);
            break;
        }
        case PRICEBOOKS: {
            for (const record of records) {
                const modifiedRecord = {
                    bookLable: record.bookname,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case CALENDAR: {
            for (const record of records) {
                const modifiedRecord = {
                    eventLable: record.subject,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case LEADS: {
            for (const record of records) {
                const modifiedRecord = {
                    leadsLable: `${record.firstname} ${record.lastname}`,
                    phone: record.phone,
                    email: record.email,
                    id: record.id
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
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case CONTACTS: {
            for (const record of records) {
                const modifiedRecord = {
                    contactsLable: `${record.firstname} ${record.lastname}`,
                    phone: record.phone,
                    email: record.email,
                    id: record.id
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
                    id: record.id
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
                    id: `14x${record.id}`
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case DOCUMENTS: {
            for (const record of records) {
                const modifiedRecord = {
                    documentLable: record.notes_title,
                    id: record.id
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
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case PBXMANAGER: {
            for (const record of records) {
                const modifiedRecord = {
                    number: record.customernumber,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case SERVICECONTRACTS: {
            for (const record of records) {
                const modifiedRecord = {
                    scLable: record.subject,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case SERVICES: {
            for (const record of records) {
                const modifiedRecord = {
                    serviceLable: record.servicename,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case ASSETS: {
            for (const record of records) {
                const modifiedRecord = {
                    assetLable: record.assetname,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case SMS_NOTIFIER: {
            for (const record of records) {
                const modifiedRecord = {
                    message: record.message,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case PROJECT_MILESTONE: {
            for (const record of records) {
                const modifiedRecord = {
                    pmLable: record.projectmilestonename,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case PROJECT_TASK: {
            for (const record of records) {
                const modifiedRecord = {
                    ptLable: record.projecttaskname,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case MODULE_PROJECT: {
            for (const record of records) {
                const modifiedRecord = {
                    projectLable: record.projectname,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case COMMENTS: {
            for (const record of records) {
                const modifiedRecord = {
                    comment: record.commentcontent,
                    id: record.id
                };
                data.push(modifiedRecord);
            }
            break;
        }
        case CURRENCY: {
            for (const record of records) {
                const modifiedRecord = {
                    currency_name: record.currency_name,
                    id: record.id
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
                    id: record.id
                };
                data.push(modifiedRecord);
            }
        }
    }
    if (listerInstance.props.moduleName !== 'Invoice') {
        saveData(data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh);
    }
};

const saveInvoiceDetails = async (records, data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh) => {
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
            console.log(detailResponseJson);

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
                id: record.id
            };
            data.push(modifiedRecord);
        }
        saveData(data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh);
    } catch (error) {
        console.log(error);
    }
};

const saveData = async (data, vtigerSeven, responseJson, addExisting, previousDataLength, listerInstance, refresh) => {
    try {
        // console.log(responseJson)
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
    index, recordInstance, dispatch) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    try {
        let param = new FormData();
        param.append('_operation', 'deleteRecords');
        if (loginDetails.vtigerVersion < 7) {
            param.append('record', recordId);
        } else {
            param.append('module', listerInstance.props.moduleName);
            param.append('record', recordId);
        }
        const responseJson = await getDatafromNet(param, dispatch);
        if (responseJson.success) {
            const obj = responseJson.result.deleted;
            const result = obj[Object.keys(obj)[0]];
            //console.log(responseJson);
            if (result) {
                //Successfully deleted.
                await removeThisIndex(listerInstance, index);
                recordInstance.setState({
                    loading: false
                });
                Toast.show('Successfully Deleted.');
            } else {
                recordInstance.setState({
                    loading: false
                });
                Toast.show('Delete Failed.');
            }
        } else {
            recordInstance.setState({
                loading: false
            });
            Toast.show('Delete Failed.');
        }
    } catch (error) {
        //console.log(error);
        recordInstance.setState({
            loading: false
        });
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
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <CampaignsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            id={item.id}
                            lable={item.lable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case CONTACTS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <ContactsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case VENDORS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <VendorRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case FAQ: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <FaqRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case QUOTES: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <QuotesRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PURCHASEORDER: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <PurchaseOrderRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case SALESORDER: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <SalesOrderRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case INVOICE: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <InvoiceRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PRICEBOOKS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <PriceBooksRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case CALENDAR: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <CalendarRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case LEADS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <ContactsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case ACCOUNTS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <AccountsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case OPPORTUNITIES: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <OpportunitiesRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PRODUCTS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <ProductsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case DOCUMENTS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <DocumentsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case TICKETS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <TicketsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
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
                        <PbxRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case SERVICECONTRACTS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <ServiceContractRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case SERVICES: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <ServiceRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case ASSETS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <AssetRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
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
                        <SMSnotifierRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PROJECT_MILESTONE: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <ProjectMilestoneRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PROJECT_TASK: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <ProjectTaskRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case MODULE_PROJECT: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <ModuleProjectRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
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
                        <CommentsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
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
                        <CurrencyRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        default:
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <CustomRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
    }
};

export const searchRecordListRendererHelper = (listerInstance) => {
    switch (listerInstance.props.moduleName) {
        case CAMPAIGNS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <CampaignsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            id={item.id}
                            lable={item.lable}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case CONTACTS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <ContactsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case VENDORS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <VendorRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case FAQ: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <FaqRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case QUOTES: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <QuotesRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PURCHASEORDER: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <PurchaseOrderRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case SALESORDER: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <SalesOrderRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case INVOICE: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <InvoiceRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PRICEBOOKS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <PriceBooksRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case CALENDAR: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <CalendarRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case LEADS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <ContactsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case ACCOUNTS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <AccountsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case OPPORTUNITIES: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <OpportunitiesRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PRODUCTS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <ProductsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case DOCUMENTS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <DocumentsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case TICKETS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <TicketsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PBXMANAGER: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <PbxRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case SERVICECONTRACTS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <ServiceContractRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case SERVICES: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <ServiceRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case ASSETS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <AssetRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case SMS_NOTIFIER: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <SMSnotifierRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PROJECT_MILESTONE: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <ProjectMilestoneRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case PROJECT_TASK: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <ProjectTaskRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case MODULE_PROJECT: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <ModuleProjectRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        case COMMENTS: {
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <CommentsRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
        }
        default:
            return (
                <FlatList
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <CustomRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                            navigation={listerInstance.state.navigation}
                        />}
                />
            );
    }
};
