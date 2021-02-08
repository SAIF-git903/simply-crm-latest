import { appendParamFor } from './RecordListerHelper';
import { getDatafromNet } from './networkHelper';
import store from '../store';
import {
    CAMPAIGNS, VENDORS, FAQ, QUOTES, PURCHASEORDER, SALESORDER,
    INVOICE, PRICEBOOKS, CALENDAR, LEADS, ACCOUNTS, CONTACTS, OPPORTUNITIES,
    PRODUCTS, DOCUMENTS, TICKETS, PBXMANAGER, SERVICECONTRACTS, SERVICES,
    ASSETS, SMS_NOTIFIER, PROJECT_MILESTONE, PROJECT_TASK, MODULE_PROJECT,
    COMMENTS
} from '../variables/constants';

export const searchRecordHelper = async (searchInstance, dispatch) => {
    try {
        const data = [];
        let pageToTake = 1;
        const mySearchNo = searchInstance.state.searchNo;
        const result = await getDataFromInternet(searchInstance, pageToTake, data, mySearchNo, dispatch);

        searchInstance.setState({
            statusText: `Found: ${result.recordsAdded}`,
            statusTextColor: '#000000'
        });
    } catch (error) {
        //send error to smackcoders
        console.log(error);
    }
};

const getDataFromInternet = async (searchInstance, pageToTake, data, mySearchNo, dispatch) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    const param = new FormData();
    const vtigerSeven = loginDetails.vtigerVersion > 6;
    if (!vtigerSeven) {
        appendParamFor(searchInstance.state.moduleName, param);
    } else {
        param.append('_operation', 'listModuleRecords');
        param.append('module', searchInstance.state.moduleName);
    }
    param.append('page', pageToTake);
    if (searchInstance.state.searchText !== '') {
        param.append('searchText', searchInstance.state.searchText);
    }
    const responseJson = await getDatafromNet(param, dispatch);
    try {
        if (responseJson.success) {
            return await getAndSaveDataVtiger(responseJson, searchInstance, data, mySearchNo, dispatch, vtigerSeven);
        }
    } catch (e) {
        if (searchInstance.didFinishSearch()) {
            searchInstance.didFinishSearch();
        }
    }
    //Say unknown error occured
    //Send this error to smackcoders
    console.log('ERROR');
    throw new Error(JSON.stringify(responseJson));
};

const getAndSaveDataVtiger = async (responseJson, searchInstance, data, mySearchNo, dispatch, vtigerSeven) => {
    let records = (responseJson.result.records) ? responseJson.result.records : [];
    for (const record of records) {
        data.push(getModifiedRecord(searchInstance.state.moduleName, vtigerSeven, responseJson, record));
    }
    searchInstance.setState({
        data: data
    });
    if (mySearchNo !== searchInstance.state.searchNo) {
        throw new Error('New search started or completed');
    }
    const nextPage = (vtigerSeven) ? (responseJson.result.moreRecords) : (responseJson.result.nextPage > 0);

    if (searchInstance.didFinishSearch) {
        searchInstance.didFinishSearch();
    }

    return { nextPage, recordsAdded: records.length };
};

function getModifiedRecord(moduleName, vtigerSeven, responseJson, record) {
    let modifiedRecord;
    switch (moduleName) {
        case CAMPAIGNS:
            modifiedRecord = {
                lable: record.campaignname,
                id: record.id
            };
            break;
        case VENDORS:
            modifiedRecord = {
                vendorName: record.vendorname,
                vendorEmail: record.email,
                vendorPhone: record.phone,
                vendorWebsite: record.website,
                id: record.id
            };
            break;
        case FAQ:
            modifiedRecord = {
                question: record.question,
                id: record.id
            };
            break;
        case QUOTES:
            modifiedRecord = {
                quoteLable: record.subject,
                total: record.hdnGrandTotal,
                quoteStage: record.quotestage,
                id: record.id
            };
            break;
        case PURCHASEORDER:
            modifiedRecord = {
                poLable: record.subject,
                status: record.postatus,
                id: record.id
            };
            break;
        case SALESORDER:
            modifiedRecord = {
                soLable: record.subject,
                status: record.sostatus,
                id: record.id
            };
            break;
        case INVOICE:
            modifiedRecord = {
                invoiceLable: record.subject,
                invoiceStatus: record.invoicestatus,
                id: record.id
            };
            break;
        case PRICEBOOKS:
            modifiedRecord = {
                bookLable: record.bookname,
                id: record.id
            };
            break;
        case CALENDAR:
            modifiedRecord = {
                eventLable: record.subject,
                id: record.id
            };
            break;
        case LEADS:
            modifiedRecord = {
                contactsLable: record.firstname ? `${record.firstname} ${record.lastname}` : record.lastname,
                phone: record.phone,
                email: record.email,
                id: record.id
            };
            break;
        case ACCOUNTS:
            modifiedRecord = {
                accountsLable: record.accountname,
                website: record.website,
                phone: record.phone,
                email: record.email,
                id: record.id
            };
            break;
        case CONTACTS:
            modifiedRecord = {
                contactsLable: record.firstname
                    ? `${record.firstname} ${record.lastname}`
                    : record.lastname,
                phone: record.phone,
                email: record.email,
                id: record.id,
            };
            break;
        case OPPORTUNITIES:
            modifiedRecord = {
                potentialLable: record.potentialname,
                amount: record.amount,
                stage: record.sales_stage,
                id: record.id
            };
            break;
        case PRODUCTS:
            modifiedRecord = {
                productLable: record.productname,
                no: record.product_no,
                productcategory: record.productcategory,
                quantity: record.qtyinstock,
                id: record.id
            };
            break;
        case DOCUMENTS:
            modifiedRecord = {
                documentLable: record.notes_title,
                id: record.id
            };
            break;
        case TICKETS:
            modifiedRecord = {
                ticketLable: record.ticket_title,
                priority: record.ticketpriorities,
                id: record.id
            };
            break;
        case PBXMANAGER:
            modifiedRecord = {
                number: record.customernumber,
                id: record.id
            };
            break;
        case SERVICECONTRACTS:
            modifiedRecord = {
                scLable: record.subject,
                id: record.id
            };
            break;
        case SERVICES:
            modifiedRecord = {
                serviceLable: record.servicename,
                id: record.id
            };
            break;
        case ASSETS:
            modifiedRecord = {
                assetLable: record.assetname,
                id: record.id
            };
            break;
        case SMS_NOTIFIER:
            modifiedRecord = {
                message: record.message,
                id: record.id
            };
            break;
        case PROJECT_MILESTONE:
            modifiedRecord = {
                pmLable: record.projectmilestonename,
                id: record.id
            };
            break;
        case PROJECT_TASK:
            modifiedRecord = {
                ptLable: record.projecttaskname,
                id: record.id
            };
            break;
        case MODULE_PROJECT:
            modifiedRecord = {
                projectLable: record.projectname,
                id: record.id
            };
            break;
        case COMMENTS:
            modifiedRecord = {
                comment: record.commentcontent,
                id: record.id
            };
            break;
        default:
            modifiedRecord = {
                lable: (vtigerSeven)
                    ? record[responseJson.result.headers[0].name]
                    : record.label,
                id: record.id,
            };
            break;
    }
    return modifiedRecord;
}
