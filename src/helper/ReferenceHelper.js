import React from 'react';
import store from '../store';
import { UPDATE_RECORD_VIEWER, COPY_CONTACT_ADDRESS, COPY_ORGANISATION_ADDRESS } from '../actions/types';
import { API_listModuleRecords, API_fetchRecordWithGrouping } from "./api";

export const viewRefRecord = async (recordId, listerInstance, dispatch) => {
    //TODO it is needed ??
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
        listerInstance.props.navigation.navigate('Record Details');
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
            listerInstance.props.navigation.navigate('Record Details');
        }
    }
};

export const getUserName = async (referenceInstance) => {
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;
        const responseJson = await API_listModuleRecords('Users');
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
        console.log('getUserName: ' + error);
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
        //TODO need to check 'fetchRecordWithGrouping'
        const responseJson = await API_fetchRecordWithGrouping(referenceInstance.state.selectedRefModule, referenceInstance.state.saveValue);
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
        console.log('getAddressDetails: ' + error);
    }
};

export const getPriceDetails = async (referenceInstance) => {
    //Get record details
    try {
        const { auth } = store.getState();
        const loginDetails = auth.loginDetails;
        const modules = loginDetails.modules;
        const productModuleId = modules.filter((item) => item.name === 'Products').map(({ id }) => (id));
        //TODO need to check 'fetchRecordWithGrouping'
        const responseJson = await API_fetchRecordWithGrouping(referenceInstance.state.selectedRefModule, referenceInstance.state.saveValue);
        if (responseJson.success) {
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
        console.log('getPriceDetails: ' + error);
    }
};
