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
        let nextPage = true;
        let recordsSearched = 0;
        let recordsAdded = 0;
        while (nextPage) {
            const result = await getDataFromInternet(searchInstance, pageToTake, data, recordsSearched, recordsAdded, mySearchNo, dispatch);
            nextPage = result.nextPage;
            if (nextPage) {
                pageToTake++;
            }
            recordsSearched = result.recordsSearched;
            recordsAdded = result.recordsAdded;
            if (recordsAdded > 100) {
                nextPage = false;
            }
        }

        searchInstance.setState({
            statusText: `Total searches: ${recordsSearched} Found: ${recordsAdded}`,
            statusTextColor: '#000000'
        });
    } catch (error) {
        //send error to smackcoders
        console.log(error);
    }
};

const getDataFromInternet = async (searchInstance, pageToTake, data, recordsSearched, recordsAdded, mySearchNo, dispatch) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    if (loginDetails.vtigerVersion < 7) {
        const param = new FormData();
        appendParamFor(searchInstance.state.moduleName, param);
        param.append('page', pageToTake);
        const responseJson = await getDatafromNet(param, dispatch);
        if (responseJson.success) {
            return await getAndSaveDataVtiger(responseJson, searchInstance, data, recordsSearched, recordsAdded, mySearchNo, dispatch, false);
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
        const responseJson = await getDatafromNet(param, dispatch);
        try {
            if (responseJson.success) {
                return await getAndSaveDataVtiger(responseJson, searchInstance, data, recordsSearched, recordsAdded, mySearchNo, dispatch, true);
            }
        } catch (e) {
            if (searchInstance.didFinishSearch()) searchInstance.didFinishSearch()
        }
        //Say unknown error occured
        //Send this error to smackcoders
        console.log('ERROR');
        throw new Error(JSON.stringify(responseJson));
    }
};

const getAndSaveDataVtiger = async (responseJson, searchInstance, data, recordsSearched, recordsAdded, mySearchNo, dispatch, vtigerSeven) => {
    let totalRecordsSearched = recordsSearched;
    let totalRecordsAdded = recordsAdded;
    let records = responseJson.result.records;
    if (records === null) {
        records = [];
    }
    switch (searchInstance.state.moduleName) {
        case CAMPAIGNS: {
            for (const record of records) {
                const modifiedRecord = {
                    lable: record.campaignname,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
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
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case FAQ: {
            for (const record of records) {
                const modifiedRecord = {
                    question: record.question,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
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
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
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
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
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
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case INVOICE: {
            for (const record of records) {
                const modifiedRecord = {
                    invoiceLable: record.subject,
                    invoiceStatus: record.invoicestatus,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    throw new Error('No results');
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case PRICEBOOKS: {
            for (const record of records) {
                const modifiedRecord = {
                    bookLable: record.bookname,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case CALENDAR: {
            for (const record of records) {
                const modifiedRecord = {
                    eventLable: record.subject,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case LEADS: {
            for (const record of records) {
                const modifiedRecord = {
                    contactsLable: record.firstname ? `${record.firstname} ${record.lastname}` : record.lastname,
                    phone: record.phone,
                    email: record.email,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case ACCOUNTS: {
            for (const record of records) {
                const modifiedRecord = {
                    accountsLable: record.accountname,
                    website: record.website,
                    phone: record.phone,
                    email: record.email,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    throw new Error('No results');
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case CONTACTS: {
            for (const record of records) {
                const modifiedRecord = {
                    contactsLable: record.firstname ? `${record.firstname} ${record.lastname}` : record.lastname,
                    phone: record.phone,
                    email: record.email,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    // console.log('search records', modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                //console.log(mySearchNo);
                //console.log(searchInstance.state.searchNo);
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case OPPORTUNITIES: {
            for (const record of records) {
                const modifiedRecord = {
                    potentialLable: record.potentialname,
                    amount: record.amount,
                    stage: record.sales_stage,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case PRODUCTS: {
            for (const record of records) {
                const modifiedRecord = {
                    productLable: record.productname,
                    no: record.product_no,
                    productcategory: record.productcategory,
                    quantity: record.qtyinstock,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case DOCUMENTS: {
            for (const record of records) {
                const modifiedRecord = {
                    documentLable: record.notes_title,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
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
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case PBXMANAGER: {
            for (const record of records) {
                const modifiedRecord = {
                    number: record.customernumber,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case SERVICECONTRACTS: {
            for (const record of records) {
                const modifiedRecord = {
                    scLable: record.subject,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case SERVICES: {
            for (const record of records) {
                const modifiedRecord = {
                    serviceLable: record.servicename,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case ASSETS: {
            for (const record of records) {
                const modifiedRecord = {
                    assetLable: record.assetname,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case SMS_NOTIFIER: {
            for (const record of records) {
                const modifiedRecord = {
                    message: record.message,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case PROJECT_MILESTONE: {
            for (const record of records) {
                const modifiedRecord = {
                    pmLable: record.projectmilestonename,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case PROJECT_TASK: {
            for (const record of records) {
                const modifiedRecord = {
                    ptLable: record.projecttaskname,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case MODULE_PROJECT: {
            for (const record of records) {
                const modifiedRecord = {
                    projectLable: record.projectname,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
            break;
        }
        case COMMENTS: {
            for (const record of records) {
                const modifiedRecord = {
                    comment: record.commentcontent,
                    id: record.id
                };
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
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
                if (await isKeywordAvailable(searchInstance.state.moduleName, record.id, searchInstance.state.searchText, dispatch, searchInstance)) {
                    data.push(modifiedRecord);
                    searchInstance.setState({
                        data: data.slice()
                    });
                    totalRecordsAdded++;
                } else {
                    break;
                }
                searchInstance.setState({
                    statusText: `Searched records: ${totalRecordsSearched}`,
                    statusTextColor: '#000000'
                });
                totalRecordsSearched++;
                if (mySearchNo !== searchInstance.state.searchNo) {
                    throw new Error('New search started or completed');
                }
            }
        }
    }

    const nextPage = (vtigerSeven) ? (responseJson.result.moreRecords) : (responseJson.result.nextPage > 0);

    if (searchInstance.didFinishSearch) searchInstance.didFinishSearch()

    return { nextPage, recordsSearched: totalRecordsSearched, recordsAdded: totalRecordsAdded };
};

export const isKeywordAvailable = async (moduleName, recordId, searchText, dispatch, searchInstance) => {
    try {
        return await getRecordDataFromInternet(moduleName, recordId, searchText, dispatch, searchInstance);
    } catch (error) {
        console.log(error);
        return false;
    }
};

const getRecordDataFromInternet = async (moduleName, recordId, searchText, dispatch, searchInstance) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    let responseJson;
    // console.log(recordId);

    if (loginDetails.vtigerVersion < 7) {
        const param = new FormData();
        param.append('_operation', 'fetchRecordWithGrouping');
        param.append('record', recordId);
        responseJson = await getDatafromNet(param, dispatch);
    } else {

        const param = new FormData();
        param.append('_operation', 'fetchRecordWithGrouping');
        param.append('module', moduleName);
        param.append('record', recordId);
        if (loginDetails.vtigerVersion <= 7.1) {
            param.append('record', `${searchInstance.props.moduleId}x${recordId}`);
        }
        responseJson = await getDatafromNet(param, dispatch);
    }


    if (responseJson.success) {
        const records = responseJson.result.record;
        const blocks = records.blocks;
        // console.log('BLOCKS', blocks);
        if (blocks.length === 0) {
            return false;
        }
        for (const block of blocks) {
            const fields = block.fields;
            for (const field of fields) {
                let value;
                if (typeof field.value === 'string') {
                    value = field.value;
                } else {
                    value = field.value.label;
                }
                // console.log(value);
                //console.log(searchText);
                let leftValue;
                if (value !== undefined) {
                    leftValue = value.toLowerCase();
                } else {
                    leftValue = '';
                }
                const rightValue = searchText.toLowerCase();

                //debugger;
                if (leftValue.includes(rightValue)) {
                    //return true if record field contain search string
                    //else return undefined
                    return true;
                }
            }
        }
    } else {
        // if (responseJson.error.code === 'ACCESS_DENIED') {
        //     await isKeywordAvailable(moduleName, recordId, searchText, dispatch, searchInstance);
        //     // await getRecordDataFromInternet(moduleName, `${searchInstance.props.moduleId}x${recordId}`, searchText, dispatch, searchInstance);
        // } else {
        throw new Error(JSON.stringify(responseJson));
        // } 
    }
};
