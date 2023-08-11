import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store';
import Section from '../components/common/section';
import SectionBox from '../components/common/section/sectionBox';
import Field from '../components/recordViewer/field';
import {
  DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR,
  DRAWER_SECTION_HEADER_IMAGE_COLOR,
} from '../variables/themeColors';
import {processFile} from './showImage';
import {addDatabaseKey} from '.';
import {API_fetchRecordWithGrouping} from './api';

var numbro = require('numbro');
const moment = require('moment-timezone');

export const fetchRecordDataHelper = async (viewerInstance, dispatch) => {
  //First check data is on database based on vtiger version
  const {auth} = store.getState();
  const loginDetails = auth.loginDetails;
  let recordOfflineData;

  try {
    if (loginDetails.vtigerVersion < 7) {
      recordOfflineData = JSON.parse(
        await AsyncStorage.getItem(viewerInstance.props.recordId),
      );
    } else {
      recordOfflineData = JSON.parse(
        await AsyncStorage.getItem(
          `${viewerInstance.props.moduleName}x${viewerInstance.props.recordId}`,
        ),
      );
    }

    if (recordOfflineData !== null) {
      //offline data is available
      const offlineFinishedTime = recordOfflineData.finishedTime;
      const currentTime = moment();
      const duration = moment.duration(currentTime.diff(offlineFinishedTime));
      const durationMinutes = parseInt(duration.asMinutes(), 10);

      if (durationMinutes < 1) {
        await getAndSaveData(
          recordOfflineData.record,
          viewerInstance,
          true,
          'Loading complete - Recently updated Pull to refresh',
        );
      } else {
        await getRecordDataFromInternet(
          viewerInstance,
          true,
          recordOfflineData,
          dispatch,
        );
      }
    } else {
      //Offline data is not available
      await getRecordDataFromInternet(viewerInstance, false, {}, dispatch);
    }
  } catch (error) {
    //Offline data is not available
    await getRecordDataFromInternet(viewerInstance, false, {}, dispatch);
  }
};

const getRecordDataFromInternet = async (
  viewerInstance,
  offlineAvailable,
  offlineData,
  dispatch,
) => {
  try {
    const responseJson = await API_fetchRecordWithGrouping(
      viewerInstance.props.moduleName,
      viewerInstance.props.recordId,
    );
    if (responseJson.success) {
      await getAndSaveData(responseJson, viewerInstance, false, '');
    } else {
      if (responseJson.error.code === 1) {
        viewerInstance.setState(
          {
            isScrollViewRefreshing: false,
            statusText: 'Loading...',
            recordId: viewerInstance.props.recordId,
          },
          async () => {
            await getRecordDataFromInternet(
              viewerInstance,
              false,
              {},
              dispatch,
            );
          },
        );
      } else {
        if (offlineAvailable) {
          console.log('offline');
          await getAndSaveData(
            offlineData.record,
            viewerInstance,
            true,
            'Showing Offline data - No internet Pull to refresh',
          );
        } else {
          //Show error to user that something went wrong.
          viewerInstance.setState({
            loading: false,
            statusText: 'Something went wrong',
            statusTextColor: 'red',
          });
        }
      }
    }
  } catch (error) {
    console.log(error);

    if (offlineAvailable) {
      console.log('offline');
      await getAndSaveData(
        offlineData.record,
        viewerInstance,
        true,
        'Showing Offline data - No internet Pull to refresh',
      );
    } else {
      //Show error to user that something went wrong.
      viewerInstance.setState({
        loading: false,
        statusText: 'Looks like no internet connection',
        statusTextColor: 'red',
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
      mantissa: decimalCount,
    });
    //TODO there is error: for non simplysupport user params 'currency_decimal_separator' and 'currency_grouping_separator' is undefined
    // because it empty in response from server, because tables 'vtiger_profile2field' and 'vtiger_def_org_field' dont have lines for these fieldIds
    // console.log('currency_decimal_separator');
    // console.log(currency_decimal_separator);
    // console.log('currency_grouping_separator');
    // console.log(currency_grouping_separator);
    result = result.replace(/\./, currency_decimal_separator);
    result = result.replace(/,/g, currency_grouping_separator);

    return result;
  } catch (e) {
    console.log(e);
    return numberString;
  }
};

const getAndSaveData = async (
  responseJson,
  viewerInstance,
  offline,
  message,
) => {
  const {auth} = store.getState();
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
      //block.label - label from database
      //block.translatedLabel - translated label
      const fieldViews = [];
      const fields = block.fields;

      if (viewerInstance.props.moduleName === 'Emails') {
        if (block.label === 'Emails_Block1') {
          block.translatedLabel = 'Created Time';
        } else if (block.label === 'Emails_Block2') {
          block.translatedLabel = 'Subject';
        } else if (block.label === 'Emails_Block3') {
          break;
        }
      }

      let k = 0;
      for (; k < fields.length; k++) {
        const field = fields[k];

        if (
          viewerInstance.props.moduleName === 'Calendar' &&
          field.name === 'contact_id'
        ) {
          continue;
        }

        let value;
        if (typeof field.value === 'string') {
          if (typeof field.uitype === 'string') {
            try {
              const uiType = parseInt(field.uitype, 10);
              if (uiType === 252) {
                const crmValue = moment.tz(
                  `${field.value}`,
                  'HH:mm:ss',
                  loginDetails.crmTz,
                );
                const userValue = crmValue.clone().tz(loginDetails.userTz);
                value = userValue.format('hh:mmA');
              } else if (uiType === 70) {
                const crmValue = moment.tz(
                  `${field.value}`,
                  'YYYY-MM-DD HH:mm:ss',
                  loginDetails.crmTz,
                );
                const userValue = crmValue.clone().tz(loginDetails.userTz);
                value = userValue.format('D-MM-YYYY hh:mmA');
              } else {
                value = field.value;
              }

              if (uiType === 7 || uiType === 72 || uiType === 71) {
                value = formatNumber(field.value);
              }
            } catch (error) {
              console.log(error);
              value = field.value;
            }
          } else {
            try {
              const uiType = field.uitype;
              if (uiType === 252) {
                const crmValue = moment.tz(
                  `${field.value}`,
                  'HH:mm:ss',
                  loginDetails.crmTz,
                );
                const userValue = crmValue.clone().tz(loginDetails.userTz);
                value = userValue.format('hh:mmA');
              } else if (uiType === 70) {
                const crmValue = moment.tz(
                  `${field.value}`,
                  'YYYY-MM-DD HH:mm:ss',
                  loginDetails.crmTz,
                );
                const userValue = crmValue.clone().tz(loginDetails.userTz);
                value = userValue.format('D-MM-YYYY hh:mmA');
              } else {
                value = field.value;
              }
            } catch (error) {
              console.log(error);
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
            index={k}
            uiType={field.uitype}
            recordId={viewerInstance.props.recordId}
            isLocation={
              field.name === 'location' &&
              (viewerInstance.props.moduleName === 'Calendar' ||
                viewerInstance.props.moduleName === 'Events')
            }
          />,
        );
      }
      //add "Show Image" line
      if (
        viewerInstance.props.moduleName === 'Documents' &&
        block.label === 'LBL_FILE_INFORMATION'
      ) {
        const div = processFile(records);
        if (div) {
          fieldViews.push(
            <Field
              key={k + 1}
              label={'Click to show image'}
              modal={div}
              uiType={1}
              recordId={viewerInstance.props.recordId}
            />,
          );
        }
      }

      blockViews.push(
        <Section
          key={i}
          headerStyle={{paddingLeft: 15}}
          style={{paddingTop: 5}}
          open={i === 0}
          sectionBackgroundColor={'#f2f3f8'}
          sectionHeaderBackground={'#f2f3f8'}
          sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
          sectionHeaderImageSelectedColor={
            DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR
          }
          headerName={block.translatedLabel}
          content={<SectionBox style={{padding: 5}}>{fieldViews}</SectionBox>}
          contentHeight={fieldViews.length * 60 + 5}
        />,
      );

      i++;
    }
    const viewData = [];
    viewData.push(blockViews);

    if (!offline) {
      const offlineData = {
        record: responseJson,
        finishedTime: moment(),
      };

      if (loginDetails.vtigerVersion < 7) {
        await AsyncStorage.setItem(
          viewerInstance.props.recordId,
          JSON.stringify(offlineData),
        );
        await addDatabaseKey(viewerInstance.props.recordId);
      } else {
        await AsyncStorage.setItem(
          `${viewerInstance.props.moduleName}x${viewerInstance.props.recordId}`,
          JSON.stringify(offlineData),
        );
        await addDatabaseKey(
          `${viewerInstance.props.moduleName}x${viewerInstance.props.recordId}`,
        );
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
        data: viewData,
      });
    }
  }
};
