import React from 'react';
import Toast from 'react-native-simple-toast';
import { AsyncStorage, FlatList, View, Text } from 'react-native';
import { getDatafromNet } from './networkHelper';
import store from '../store';
import CampaignsRecord from
    '../components/addRecords/referenceRecordLister/recordItems/campaignsRecord';
import ContactsRecord from
    '../components/addRecords/referenceRecordLister/recordItems/contactsRecord';
import VendorRecord from
    '../components/addRecords/referenceRecordLister/recordItems/vendorRecord';
import FaqRecord from
    '../components/addRecords/referenceRecordLister/recordItems/faqRecord';
import QuotesRecord from
    '../components/addRecords/referenceRecordLister/recordItems/quotesRecord';
import PurchaseOrderRecord from
    '../components/addRecords/referenceRecordLister/recordItems/purchaseOrderRecord';
import SalesOrderRecord from
    '../components/addRecords/referenceRecordLister/recordItems/salesOrderRecord';
import InvoiceRecord from
    '../components/addRecords/referenceRecordLister/recordItems/invoiceRecord';
import PriceBooksRecord from
    '../components/addRecords/referenceRecordLister/recordItems/priceBooksRecord';
import CalendarRecord from
    '../components/addRecords/referenceRecordLister/recordItems/calendarRecord';
import AccountsRecord from
    '../components/addRecords/referenceRecordLister/recordItems/accountsRecord';
import OpportunitiesRecord from
    '../components/addRecords/referenceRecordLister/recordItems/opportunitiesRecord';
import ProductsRecord from
    '../components/addRecords/referenceRecordLister/recordItems/productsRecord';
import DocumentsRecord from
    '../components/addRecords/referenceRecordLister/recordItems/documentsRecord';
import TicketsRecord from
    '../components/addRecords/referenceRecordLister/recordItems/ticketsRecord';
import PbxRecord from
    '../components/addRecords/referenceRecordLister/recordItems/pbxRecord';
import ServiceContractRecord from
    '../components/addRecords/referenceRecordLister/recordItems/serviceContractsRecord';
import ServiceRecord from
    '../components/addRecords/referenceRecordLister/recordItems/serviceRecord';
import AssetRecord from
    '../components/addRecords/referenceRecordLister/recordItems/assetRecord';
import SMSnotifierRecord from
    '../components/addRecords/referenceRecordLister/recordItems/smsnotifierRecord';
import ProjectMilestoneRecord from
    '../components/recordLister/recordItems/projectMilestoneRecord';
import ProjectTaskRecord from
    '../components/addRecords/referenceRecordLister/recordItems/projectTaskRecord';
import ModuleProjectRecord from
    '../components/addRecords/referenceRecordLister/recordItems/moduleProjectRecord';
import CommentsRecord from
    '../components/addRecords/referenceRecordLister/recordItems/commentRecord';
import CustomRecord from '../components/addRecords/referenceRecordLister/recordItems/customRecord';
import CurrencyRecord from
    '../components/addRecords/referenceRecordLister/recordItems/currencyRecord';
import DocumentFoldersRecord from
    '../components/addRecords/referenceRecordLister/recordItems/documentFoldersRecord';

import { UPDATE_RECORD_VIEWER, COPY_CONTACT_ADDRESS, COPY_ORGANISATION_ADDRESS } from '../actions/types';
import {
    CAMPAIGNS, VENDORS, FAQ, QUOTES, PURCHASEORDER, SALESORDER,
    INVOICE, PRICEBOOKS, CALENDAR, LEADS, ACCOUNTS, CONTACTS, OPPORTUNITIES,
    PRODUCTS, DOCUMENTS, TICKETS, PBXMANAGER, SERVICECONTRACTS, SERVICES,
    ASSETS, SMS_NOTIFIER, PROJECT_MILESTONE, PROJECT_TASK, MODULE_PROJECT,
    COMMENTS, CURRENCY, DOCUMENTFOLDERS
} from '../variables/constants';
import { addDatabaseKey } from '.';

const moment = require('moment-timezone');

export const fetchRefRecordHelper = async (listerInstance, dispatch) => {
    //First checking if any data in offline.
    try {
        const offlineData = JSON.parse(await AsyncStorage.getItem(listerInstance.props.moduleName));

        console.log('Stored data available')
        console.log(offlineData)

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

export const refreshRefRecordHelper = async (listerInstance, dispatch) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        if (loginDetails.vtigerVersion < 7) {
            let param = new FormData();
            appendParamForRef(listerInstance.props.moduleName, param);
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

export const getNextRefPageHelper = async (listerInstance, dispatch) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        if (loginDetails.vtigerVersion < 7) {
            let param = new FormData();
            appendParamForRef(listerInstance.props.moduleName, param);
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
            param.append('_operation', 'listModuleRecords');
            param.append('module', listerInstance.props.moduleName);
            param.append('page', listerInstance.state.pageToTake);
            const responseJson = await getDatafromNet(param, dispatch);
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

export const viewRefRecord = async (recordId, listerInstance, dispatch) => {
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
        //console.log(listerInstance);
        //console.log(navigation);
        navigation.navigate('DetailsScreen');
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
        console.log('Getting data from internet')
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        if (loginDetails.vtigerVersion < 7) {
            let param = new FormData();
            appendParamForRef(listerInstance.props.moduleName, param);
            //console.log(listerInstance.state.pageToTake);
            param.append('page', listerInstance.state.pageToTake);
            const responseJson = await getDatafromNet(param, dispatch);
            console.log(responseJson);
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
            appendParamForRef(listerInstance.props.moduleName, param);
            // param.append('_operation', 'listModuleRecords');
            // param.append('module', listerInstance.props.moduleName);
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
        // console.log(error);
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
    console.log('getAndSaveDataVtiger called')

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
            // console.log('Invoice records', records);
            for (const record of records) {
                const modifiedRecord = {
                    invoiceLable: record.subject,
                    invoiceStatus: record.invoicestatus,
                    invoiceAmount: Number(record.purchase_cost).toFixed(2),
                    id: record.id
                };
                data.push(modifiedRecord);
            }
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
                    id: record.id
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
        case DOCUMENTFOLDERS: {
            for (const record of records) {
                const modifiedRecord = {
                    foldername: record.foldername,
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

    let offlineData = {};

    let statusText;
    if (data.length > 0) {
        // the array is defined and has at least one element
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

export const appendParamForRef = (moduleName, param) => {
    // conssole.log('Reference module', moduleName);
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
            param.append('query', 'select invoicestatus,subject,id from Invoice ORDER BY modifiedtime DESC');
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
            param.append('query', 'select firstname,lastname,phone,email,id from Leads ORDER BY modifiedtime DESC');
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
        case DOCUMENTFOLDERS:
            param.append('_operation', 'query');
            param.append('query', 'select * from DocumentFolders');
            break;

        default:
            param.append('_operation', 'listModuleRecords');
            param.append('module', moduleName);
            break;
    }
};

export const deleteRefRecordHelper = async (listerInstance, recordId,
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

export const recordRefListRendererHelper = (listerInstance) => {
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
                        />
                    }
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
        case DOCUMENTFOLDERS: {
            return (
                <FlatList
                    onRefresh={listerInstance.refreshData.bind(listerInstance)}
                    data={listerInstance.state.data}
                    refreshing={listerInstance.state.isFlatListRefreshing}
                    ListFooterComponent={(listerInstance.state.nextPage) ? listerInstance.renderFooter.bind(listerInstance) : undefined}
                    onEndReached={listerInstance.onEndReached.bind(listerInstance)}
                    onMomentumScrollBegin={() => { listerInstance.onEndReachedCalledDuringMomentum = false; }}
                    renderItem={({ item, index }) =>
                        <DocumentFoldersRecord
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
                        />}
                />
            );
    }
};

export const searchRefRecordListRendererHelper = (listerInstance) => {
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
                    data={listerInstance.state.data}
                    renderItem={({ item, index }) =>
                        <CustomRecord
                            index={index}
                            selectedIndex={listerInstance.state.selectedIndex}
                            listerInstance={listerInstance}
                            item={item}
                            onRecordSelect={listerInstance.onRecordSelect.bind(listerInstance)}
                        />}
                />
            );
    }
};

export const getUserName = async (referenceInstance) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        const param = new FormData();

        param.append('_operation', 'listModuleRecords');
        param.append('module', 'Users');
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
        const responseJson = await response.json();


        if (responseJson.success) {

            const records = responseJson.result.records;
            for (const record of records) {

                if (record.id === loginDetails.userId) {
                    const userName = `${record.first_name} ${record.last_name}`;
                    referenceInstance.setState({ saveValue: loginDetails.userId, referenceValue: userName });

                    break;
                }
            }

        }
    } catch (error) {
        // console.log(error);
    }
};

export const getAddressDetails = async (referenceInstance, dispatch) => {

    //Get record details
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        const modules = loginDetails.modules;

        const contactModuleId = modules.filter((item) => item.name === 'Contacts').map(({ id }) => (id));
        const accountModuleId = modules.filter((item) => item.name === 'Accounts').map(({ id }) => (id));

        const moduleId = (referenceInstance.state.selectedRefModule === 'Contacts') ? contactModuleId[0] : accountModuleId[0];


        const param = new FormData();

        param.append('_operation', 'fetchRecordWithGrouping');
        param.append('module', referenceInstance.state.selectedRefModule);
        // param.append('record', `${moduleId}x${referenceInstance.state.saveValue}`);
        param.append('record', referenceInstance.state.saveValue);
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
        const responseJson = await response.json();

        // console.log(responseJson);
        if (responseJson.success) {
            const blocks = responseJson.result.record.blocks;
            for (const block of blocks) {
                if (block.label === 'Address Details') {
                    if (referenceInstance.state.selectedRefModule === 'Contacts') {
                        dispatch({
                            type: COPY_CONTACT_ADDRESS,
                            payload: {
                                contactAddress: block.fields
                            }
                        });
                    }
                    if (referenceInstance.state.selectedRefModule === 'Accounts') {
                        dispatch({
                            type: COPY_ORGANISATION_ADDRESS,
                            payload: {
                                organisationAddress: block.fields
                            }
                        });
                    }
                }
            }
        }
    } catch (error) {
        // console.log('Error occured', error);
    }
};

export const getPriceDetails = async (referenceInstance) => {
    //Get record details
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        const modules = loginDetails.modules;

        const productModuleId = modules.filter((item) => item.name === 'Products').map(({ id }) => (id));

        const param = new FormData();

        param.append('_operation', 'fetchRecordWithGrouping');
        param.append('module', referenceInstance.state.selectedRefModule);
        // param.append('record', `${productModuleId[0]}x${referenceInstance.state.saveValue}`);
        param.append('record', referenceInstance.state.saveValue);
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
        const responseJson = await response.json();

        if (responseJson.success) {
            console.log(responseJson);
            const blocks = responseJson.result.record.blocks;
            let priceFields;
            let stockFields;

            const label = (referenceInstance.state.selectedRefModule === 'Products') ? 'Stock Information' : 'Service Details';
            for (const block of blocks) {
                if (block.label === 'Pricing Information') {
                    priceFields = block.fields;
                }

                if (block.label === label) {
                    stockFields = block.fields;
                }
            }
            referenceInstance.props.onCopyPriceDetails(priceFields, stockFields);
        }
    } catch (error) {
        // console.log('Error occured', error);
    }
};

