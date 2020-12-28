import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View } from 'react-native';
import store from '../store';
import { getDatafromNet } from './networkHelper';
import Section from '../components/common/section';
import SectionBox from '../components/common/section/sectionBox';
import Field from '../components/recordViewer/field';
import {
    DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR,
    DRAWER_SECTION_HEADER_IMAGE_COLOR
} from '../variables/themeColors';
import { processFile } from './showImage';
import { addDatabaseKey } from '.';

var numbro = require('numbro');
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
            recordOfflineData = JSON.parse(await AsyncStorage.getItem(`${viewerInstance.props.moduleName}x${viewerInstance.props.recordId}`));
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
                    console.log('offline');
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
        console.log(error);

        if (offlineAvailable) {
            console.log('offline');
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

const formatNumber = (numberString) => {
    try {
        const {
            no_of_currency_decimals,
            currency_grouping_separator,
            currency_decimal_separator,
        } = store.getState().UserReducer.userData;

        let result = parseFloat(numberString);

        const decimalCount = parseInt(no_of_currency_decimals);

        result = numbro(result).format({
            thousandSeparated: true,
            mantissa: decimalCount
        });

        result = result.replace(/\./, currency_decimal_separator);
        result = result.replace(/,/g, currency_grouping_separator);

        return result;
    } catch (e) {
        console.log(e);
        return numberString;
    }
};

const getAndSaveData = async (responseJson, viewerInstance, offline, message) => {
    const { auth } = store.getState();
    const loginDetails = auth.loginDetails;

    if (responseJson.success) {
        const records = responseJson.result.record;
        const blocks = records.blocks;

        const blockViews = [];
        if (blocks.length === 0) {
            viewerInstance.setState({
                loading: false,
                isScrollViewRefreshing: false,
                statusText: 'No data available',
                statusTextColor: '#000000',
            });
            return;
        }
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
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

            let k = 0;
            for (; k < fields.length; k++) {
                const field = fields[k];

                if (viewerInstance.props.moduleName === 'Calendar' && field.name === 'contact_id') {
                    continue;
                }

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

                            if (uiType === 7
                                || uiType === 72
                                || uiType === 71) {
                                value = formatNumber(field.value)
                            }

                        } catch (error) {
                            console.log(error);
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
                fieldViews.push(
                    <Field
                        key={k}
                        label={field.label}
                        value={value}
                        uiType={field.uitype}
                        recordId={viewerInstance.props.recordId}
                    />
                );
            }
            //add "Show Image" line
            if (viewerInstance.props.moduleName === 'Documents' && block.label === 'File Details') {
                fieldViews.push(
                    <Field
                        key={k+1}
                        label={'Click to show image'}
                        value={processFile(records)}
                        uiType={1}
                        recordId={viewerInstance.props.recordId}
                    />
                );
            }

            blockViews.push(
                <Section
                    key={i}
                    headerStyle={{ paddingLeft: 15 }}
                    style={{ paddingTop: 5 }}
                    open={(i === 0)}
                    sectionBackgroundColor={'#f2f3f8'}
                    sectionHeaderBackground={'#f2f3f8'}
                    sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
                    sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
                    headerName={block.label}
                    content={<SectionBox style={{ padding: 5 }}>{fieldViews}</SectionBox>}
                    contentHeight={fieldViews.length * 60 + 5}
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
                await AsyncStorage.setItem(`${viewerInstance.props.moduleName}x${viewerInstance.props.recordId}`, JSON.stringify(offlineData));
                await addDatabaseKey(`${viewerInstance.props.moduleName}x${viewerInstance.props.recordId}`);
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

