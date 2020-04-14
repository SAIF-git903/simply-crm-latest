import React from 'react';
import { AsyncStorage } from 'react-native';
import store from '../store';
import { getDatafromNet } from './networkHelper';
import Section from '../components/common/section';
import Field from '../components/recordViewer/field';
import {
    DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR,
    DRAWER_SECTION_HEADER_IMAGE_COLOR
} from '../variables/themeColors';
import { addDatabaseKey } from '.';


const moment = require('moment-timezone');

export const viewRecordRenderer = async (viewerInstance, dispatch) => {
    //First check data is on database based on vtiger version
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;
    let recordOfflineData;

    try {
        if (loginDetails.vtigerVersion < 7) {
            recordOfflineData = JSON.parse(await AsyncStorage.getItem(viewerInstance.props.recordId));
        } else {
            recordOfflineData = JSON.parse(await AsyncStorage.getItem(`${viewerInstance.props.moduleName}
                x${viewerInstance.props.recordId}`));
        }

        if (recordOfflineData !== null) {
            //offline data is available
            const offlineFinishedTime = recordOfflineData.finishedTime;
            const currentTime = moment();
            const duration = moment.duration(currentTime.diff(offlineFinishedTime));
            const durationMinutes = parseInt(duration.asMinutes(), 10);

            if (durationMinutes < 1) {
                await getAndSaveData(recordOfflineData.record, viewerInstance, true, 'Loading complete - Recently updated Pull to refresh');
            } else {
                await getDataFromInternet(viewerInstance, true, recordOfflineData, dispatch);
            }
        } else {
            //Offline data is not available
            await getDataFromInternet(viewerInstance, false, {}, dispatch);
        }
    } catch (error) {
        // console.log(error);
        //Offline data is not available
        await getDataFromInternet(viewerInstance, false, {}, dispatch);
    }
};

export const refreshRecordDataHelper = async (viewerInstance, dispatch) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        let responseJson;

        if (loginDetails.vtigerVersion < 7) {
            const param = new FormData();
            param.append('_operation', 'fetchRecordWithGrouping');
            param.append('record', viewerInstance.props.recordId);
            responseJson = await getDatafromNet(param, dispatch);
        } else {
            const param = new FormData();
            param.append('_operation', 'fetchRecordWithGrouping');
            param.append('module', viewerInstance.props.moduleName);
            param.append('record', viewerInstance.state.recordId);
            responseJson = await getDatafromNet(param, dispatch);
        }

        if (responseJson.success) {
            await getAndSaveData(responseJson, viewerInstance, false, '');
        } else {
            if (responseJson.error.code === 1) {
                viewerInstance.setState({
                    isScrollViewRefreshing: false,
                    statusText: 'Loading...',
                    recordId: viewerInstance.props.recordId
                },
                    async () => { await refreshRecordDataHelper(viewerInstance, dispatch); });
            } else {
                viewerInstance.setState({
                    isScrollViewRefreshing: false,
                    statusText: 'Something went wrong',
                    statusTextColor: 'red'
                });
            }
        }
    } catch (error) {
        viewerInstance.setState({
            isScrollViewRefreshing: false,
            statusText: 'Looks like no network connection',
            statusTextColor: 'red'
        });
    }
};

const getDataFromInternet = async (viewerInstance, offlineAvailable, offlineData, dispatch) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;

        let responseJson;

        if (loginDetails.vtigerVersion < 7) {
            const param = new FormData();
            param.append('_operation', 'fetchRecordWithGrouping');
            param.append('record', viewerInstance.props.recordId);
            responseJson = await getDatafromNet(param, dispatch);
        } else {
            const param = new FormData();
            param.append('_operation', 'fetchRecordWithGrouping');
            param.append('module', viewerInstance.props.moduleName);
            param.append('record', viewerInstance.state.recordId);
            responseJson = await getDatafromNet(param, dispatch);
        }

        console.log(responseJson);
        if (responseJson.success) {
            await getAndSaveData(responseJson, viewerInstance, false, '');
        } else {
            if (responseJson.error.code === 1) {
                viewerInstance.setState({
                    isScrollViewRefreshing: false,
                    statusText: 'Loading...',
                    recordId: viewerInstance.props.recordId
                },
                    async () => { await getDataFromInternet(viewerInstance, false, {}, dispatch); });
            } else {
                if (offlineAvailable) {
                    await getAndSaveData(offlineData.record, viewerInstance, true, 'Showing Offline data - No internet Pull to refresh');
                } else {
                    //Show error to user that something went wrong.
                    viewerInstance.setState({
                        loading: false,
                        statusText: 'Something went wrong',
                        statusTextColor: 'red'
                    });
                }
            }
        }
    } catch (error) {
        if (offlineAvailable) {
            await getAndSaveData(offlineData.record, viewerInstance, true, 'Showing Offline data - No internet Pull to refresh');
        } else {
            //Show error to user that something went wrong.
            viewerInstance.setState({
                loading: false,
                statusText: 'Looks like no internet connection',
                statusTextColor: 'red'
            });
        }
    }
};

const getAndSaveData = async (responseJson, viewerInstance, offline, message) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    if (responseJson.success) {
        const records = responseJson.result.record;
        const blocks = records.blocks;

        const blockViews = [];
        let i = 0;
        if (blocks.length === 0) {
            viewerInstance.setState({
                loading: false,
                isScrollViewRefreshing: false,
                statusText: 'No data available',
                statusTextColor: '#000000',
            });
            return;
        }
        for (const block of blocks) {
            const fieldViews = [];
            const fields = block.fields;

            if (viewerInstance.props.moduleName === 'Emails') {
                if (block.label === 'Emails_Block1') {
                    block.label = 'Created Time';
                } else if (block.label === 'Emails_Block2') {
                    block.label = 'Subject';
                } else if (block.label === 'Emails_Block3') {
                    break;
                }
            }

            for (const field of fields) {
                let value;
                if (typeof field.value === 'string') {
                    if (typeof field.uitype === 'string') {
                        try {
                            const uiType = parseInt(field.uitype, 10);
                            if (uiType === 252) {
                                const crmValue = moment.tz(`${field.value}`, 'HH:mm:ss', loginDetails.crmTz);
                                const userValue = crmValue.clone().tz(loginDetails.userTz);
                                value = userValue.format('hh:mmA');
                            } else if (uiType === 70) {
                                const crmValue = moment.tz(`${field.value}`, 'YYYY-MM-DD HH:mm:ss', loginDetails.crmTz);
                                const userValue = crmValue.clone().tz(loginDetails.userTz);
                                value = userValue.format('D-MM-YYYY hh:mmA');
                            } else {
                                value = field.value;
                            }
                        } catch (error) {
                            //console.log(error);
                            value = field.value;
                        }
                    } else {
                        try {
                            const uiType = field.uitype;
                            if (uiType === 252) {
                                const crmValue = moment.tz(`${field.value}`, 'HH:mm:ss', loginDetails.crmTz);
                                const userValue = crmValue.clone().tz(loginDetails.userTz);
                                value = userValue.format('hh:mmA');
                                //console.log(value);  
                            } else if (uiType === 70) {
                                const crmValue = moment.tz(`${field.value}`, 'YYYY-MM-DD HH:mm:ss', loginDetails.crmTz);
                                const userValue = crmValue.clone().tz(loginDetails.userTz);
                                value = userValue.format('D-MM-YYYY hh:mmA');
                            } else {
                                value = field.value;
                            }
                        } catch (error) {
                            //console.log(error);
                            value = field.value;
                        }
                    }
                } else {
                    value = field.value.label;
                }
                fieldViews.push(<Field label={field.label} value={value} />);
            }

            console.log(block.label);
            blockViews.push(
                <Section
                    open={(i === 0)}
                    sectionBackgroundColor={'white'}
                    sectionHeaderBackground={'white'}
                    sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
                    sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
                    headerName={block.label}
                    content={fieldViews}
                    contentHeight={fieldViews.length * 35}
                />);
            i++;
        }
        const viewData = [];
        viewData.push(blockViews);

        if (!offline) {
            const offlineData = {
                record: responseJson,
                finishedTime: moment()
            };

            if (loginDetails.vtigerVersion < 7) {
                await AsyncStorage.setItem(viewerInstance.props.recordId, JSON.stringify(offlineData));
                await addDatabaseKey(viewerInstance.props.recordId);
            } else {
                await AsyncStorage.setItem(`${viewerInstance.props.moduleName}
                x${viewerInstance.props.recordId}`, JSON.stringify(offlineData));
                await addDatabaseKey(`${viewerInstance.props.moduleName}
                x${viewerInstance.props.recordId}`);
            }

            viewerInstance.setState({
                loading: false,
                isScrollViewRefreshing: false,
                statusText: 'Loading complete - Recently updated Pull to refresh',
                statusTextColor: '#000000',
                data: viewData,
            });
        } else {
            viewerInstance.setState({
                loading: false,
                isScrollViewRefreshing: false,
                statusText: message,
                statusTextColor: '#000000',
                data: viewData
            });
        }
    }
};

