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

    if (loginDetails.vtigerVersion < 7) {
        const param = new FormData();
        appendParamFor(searchInstance.state.moduleName, param);
        param.append('page', pageToTake);
        param.append('search_text', searchInstance.state.searchText);
        const responseJson = await getDatafromNet(param, dispatch);
        if (responseJson.success) {
            return await getAndSaveDataVtiger(responseJson, searchInstance, data, mySearchNo, dispatch, false);
        } else {
            //Say unknown error occured
            //Send this error to smackcoders
            throw new Error(JSON.stringify(responseJson));
        }
    } else {
        const param = new FormData();
        param.append('_operation', 'listModuleRecords');
        param.append('module', searchInstance.state.moduleName);
        param.append('page', pageToTake);
        param.append('search_text', searchInstance.state.searchText);
        const responseJson = await getDatafromNet(param, dispatch);
        try {
            if (responseJson.success) {
                return await getAndSaveDataVtiger(responseJson, searchInstance, data, mySearchNo, dispatch, true);
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
    }
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
        case VENDORS:
        case FAQ:
        case QUOTES:
        case PURCHASEORDER:
        case SALESORDER:
        case INVOICE:
        case PRICEBOOKS:
        case CALENDAR:
        case LEADS:
        case ACCOUNTS:
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
        case PRODUCTS:
        case DOCUMENTS:
        case TICKETS:
        case PBXMANAGER:
        case SERVICECONTRACTS:
        case SERVICES:
        case ASSETS:
        case SMS_NOTIFIER:
        case PROJECT_MILESTONE:
        case PROJECT_TASK:
        case MODULE_PROJECT:
        case COMMENTS:
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
