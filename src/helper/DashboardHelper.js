import React from 'react';
import { FlatList } from 'react-native';
import Contacts from '../components/dashboardUpdates/Contacts';
import Calendar from '../components/dashboardUpdates/Calendar';
import Leads from '../components/dashboardUpdates/Leads';
import { getDatafromNet } from './networkHelper';
import store from '../store';


export const fetchWidgetRecordHelper = async (viewerInstance, dispatch) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;
    
        if (loginDetails.vtigerVersion < 7) {
            let param = new FormData();
            param.append('_operation', 'query');
            param.append('query', `select * from ${viewerInstance.props.moduleName} orderby modifiedtime desc`);
            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                //console.log('get6');
                await getAndSaveDataVtiger(responseJson, viewerInstance);
            } else {
                //Show offline data and notify user
                viewerInstance.setState({
                    loading: false,
                    statusText: 'Showing Offline data - No internet Pull to refresh',
                    statusTextColor: '#000000',                        
                });
            }
        } else {
            let param = new FormData();
            param.append('_operation', 'listModuleRecords');
            param.append('module', viewerInstance.props.moduleName);
            console.log(param);
            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                console.log(responseJson);
                await getAndSaveDataVtiger(responseJson, viewerInstance);
            } else {
                //Show offline data and notify user
                viewerInstance.setState({
                    loading: false,
                    statusText: 'Showing Offline data - No internet Pull to refresh',
                    statusTextColor: '#000000',                        
                });
            }
        }
    } catch (error) {
        //Show error to user that something went wrong.
        viewerInstance.setState({ 
            loading: false, 
            statusText: 'Looks like no network connection', 
            statusTextColor: 'red' });
        //console.log(error);
    }
};
export const refreshRecordWidgetHelper = async (viewerInstance, dispatch) => {
    //console.log('widget refresh');
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        if (loginDetails.vtigerVersion < 7) {
            let param = new FormData();
            appendParamFor(viewerInstance.props.moduleName, param);
            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, viewerInstance, false, true, false);
            } else {
                //Show error to user that something went wrong.
                viewerInstance.setState({ 
                    isFlatListRefreshing: false, 
                    statusText: 'Something went wrong', 
                    statusTextColor: 'red' });
            }
        } else {
            let param = new FormData();
            param.append('_operation', 'listModuleRecords');
            param.append('module', viewerInstance.props.moduleName);
            const responseJson = await getDatafromNet(param, dispatch);
            if (responseJson.success) {
                await getAndSaveDataVtiger(responseJson, viewerInstance, true, true, false);
            } else {
                //Show error to user that something went wrong.
                viewerInstance.setState({ 
                    isFlatListRefreshing: false, 
                    statusText: 'Something went wrong', 
                    statusTextColor: 'red' });
            }
        }
    } catch (error) {
        //Show error to user that something went wrong.
        viewerInstance.setState({ 
            isFlatListRefreshing: false, 
            statusText: 'Looks like no network connection', 
            statusTextColor: 'red' });
    }  
};

const appendParamFor = (moduleName, param) => {
    switch (moduleName) {
        
        case 'Calendar':
            param.append('_operation', 'query');
            param.append('query', 'select subject,id from Calendar ORDER BY modifiedtime DESC');
            break;
        case 'Leads':
            param.append('_operation', 'query');
            param.append('query', 'select firstname,lastname,phone,email,id from Leads ORDER BY modifiedtime DESC');
            break;
     
        case 'Contacts':
            param.append('_operation', 'query');
            param.append('query', 'select firstname,lastname,phone,email,id from Contacts ORDER BY modifiedtime DESC');
            break;
   
        default:
            param.append('_operation', 'listModuleRecords ORDER BY modifiedtime DESC');
            param.append('module', moduleName);
            break;
    }
};

const getAndSaveDataVtiger = async (responseJson, viewerInstance, vtigerSeven, refresh) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    const tmpdata = [];
    let records = responseJson.result.records;
        if (records === null) {
            records = [];
        }
        let i = 0;
        switch (viewerInstance.props.moduleName) {
            case 'Contacts':
                for (const rec of records) {
                    if (i < 5) {
                    const tmp = { id: rec.id,
                                  contactsLable: `${rec.firstname} ${rec.lastname}`,
                                  email: rec.email  
                                };
                    tmpdata.push(tmp); 
                    i++; 
                    } else {
                        break;
                    }                                              
                }
                viewerInstance.setState({
                    data: tmpdata
                });
                break;
            case 'Calendar':
                for (const rec of records) {
                    if (i < 5) {
                    const tmp = { id: rec.id,
                                  subject: rec.subject   
                                };
                    tmpdata.push(tmp); 
                    i++;
                    } else {
                       break; 
                    }                                              
                }
                viewerInstance.setState({
                    data: tmpdata
                });
                break;    
            case 'Leads':
                for (const rec of records) {
                    if (i < 5) {
                    const tmp = { id: rec.id,
                                  lable: `${rec.firstname} ${rec.lastname}`,
                                  email: rec.email  
                                };
                    tmpdata.push(tmp);
                    i++;
                    } else {
                        break;
                    }
                }
                viewerInstance.setState({
                    data: tmpdata
                });
                break;            
            default:
        }
        i++;
        

    if (refresh) {
        viewerInstance.setState({
            isFlatListRefreshing: false,
            statusText: 'Loading complete - Recently updated Pull to refresh',
            statusTextColor: '#000000',
        });
    } else {
        if (records.length === 0) {
            viewerInstance.setState({
                loading: false,
                statusText: 'Loading complete - Module is Empty',
                statusTextColor: '#000000', 
            });   
        } else {
            viewerInstance.setState({
                loading: false,
                statusText: 'Loading complete - Recently updated Pull to refresh',
                statusTextColor: '#000000', 
            });   
        }
        viewerInstance.setState({
            loading: false,
            statusTextColor: '#000000',
    });
    }
};


export const dashboardHelper = (viewerInstance) => {
    switch (viewerInstance.props.moduleName) {
        case 'Contacts': {
            return (
                <FlatList
                onRefresh={viewerInstance.refreshData.bind(viewerInstance)}
                data={viewerInstance.state.data}
                refreshing={viewerInstance.state.isFlatListRefreshing}
                ListFooterComponent={(viewerInstance.state.nextPage) ? viewerInstance.renderFooter.bind(viewerInstance) : undefined}
                onEndReached={viewerInstance.onEndReached.bind(viewerInstance)}
                onMomentumScrollBegin={() => { viewerInstance.onEndReachedCalledDuringMomentum = false; }}
                renderItem={({ item, index }) => 
                <Contacts
                    index={index} 
                    selectedIndex={viewerInstance.state.selectedIndex}
                    viewerInstance={viewerInstance}
                    item={item} 
                    onRecordSelect={viewerInstance.onRecordSelect.bind(viewerInstance)}
                />}
                />
            );
        }
        case 'Calendar': {
            return (
                <FlatList
                onRefresh={viewerInstance.refreshData.bind(viewerInstance)}
                data={viewerInstance.state.data}
                refreshing={viewerInstance.state.isFlatListRefreshing}
                ListFooterComponent={(viewerInstance.state.nextPage) ? viewerInstance.renderFooter.bind(viewerInstance) : undefined}
                onEndReached={viewerInstance.onEndReached.bind(viewerInstance)}
                onMomentumScrollBegin={() => { viewerInstance.onEndReachedCalledDuringMomentum = false; }}
                renderItem={({ item, index }) => 
                <Calendar 
                    index={index} 
                    selectedIndex={viewerInstance.state.selectedIndex}
                    viewerInstance={viewerInstance}
                    item={item} 
                    onRecordSelect={viewerInstance.onRecordSelect.bind(viewerInstance)}
                />}
                />
            );
        }
        case 'Leads': {
            return (
                <FlatList
                onRefresh={viewerInstance.refreshData.bind(viewerInstance)}
                data={viewerInstance.state.data}
                refreshing={viewerInstance.state.isFlatListRefreshing}
                ListFooterComponent={(viewerInstance.state.nextPage) ? viewerInstance.renderFooter.bind(viewerInstance) : undefined}
                onEndReached={viewerInstance.onEndReached.bind(viewerInstance)}
                onMomentumScrollBegin={() => { viewerInstance.onEndReachedCalledDuringMomentum = false; }}
                renderItem={({ item, index }) => 
                <Leads
                    index={index} 
                    selectedIndex={viewerInstance.state.selectedIndex}
                    viewerInstance={viewerInstance}
                    item={item} 
                    onRecordSelect={viewerInstance.onRecordSelect.bind(viewerInstance)}
                />}
                />
            );
        }
        
        default : 
    }
};
