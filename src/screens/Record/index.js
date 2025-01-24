import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
// import FontAwesome, {parseIconFromClassName} from 'react-native-fontawesome';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
// import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
// import NfcManager, {Ndef, NfcEvents, NfcTech} from 'react-native-nfc-manager';
// import LottieView from 'lottie-react-native';
// import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
// import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
// import * as RegularIcons from '@fortawesome/free-regular-svg-icons';

import Header from '../../components/common/Header';
import Viewer from '../../components/recordViewer/viewer';
import Updates from './Updates';
import Comments from './Comments/';
import Summery from '../../components/recordViewer/Summery';
import {URLDETAILSKEY} from '../../variables/strings';
import {
  API_describe,
  API_fetchButtons,
  API_fetchRecord,
  API_fetchRecordWithGrouping,
  API_forfetchImageData,
  API_saveFile,
  API_saveRecord,
} from '../../helper/api';
import store from '../../store';

import {
  deleteRecord,
  isTimeSheetModal,
  passValue,
  refreshRecordData,
  saveSuccess,
} from '../../actions';
import {deleteCalendarRecord} from '../../ducks/calendar';
import CommanView from '../../components/recordViewer/CommanView';
import AddRecords from '../../components/addRecords';
import {isLightColor} from '../../components/common/TextColor';
// import {DynamicIcon} from '../../components/common/DynamicIcon';
import {fontStyles} from '../../styles/common';
import RecordModal from '../../model/RecordModal';
import ProfileModal from '../../model/ProfileModal';
import FormMoadal from '../../model/FormMoadal';
import {
  generalBgColor,
  headerIconColor,
  textColor,
  textColor2,
} from '../../variables/themeColors';
import {DynamicIcon} from '../../components/common/DynamicIcon';
import DocumentDetailModal from '../../model/DocumentDetailModal';

// var ScrollableTabView = require('react-native-scrollable-tab-view');
const icon = <FontAwesome5 name={'comments'} />;
export default function RecordDetails({route}) {
  // const isFocused = useIsFocused();
  const {height, width} = Dimensions.get('window');

  const listerInstance = route?.params?.listerInstance;

  const index = route?.params?.index;
  const itemID = route?.params?.recordId;
  const recordViewerState = useSelector((state) => state.recordViewer);

  const {enabledModules} = useSelector(
    (state) => state.comments,
    (p, n) => p.enabledModules === n.enabledModules,
  );

  const dispatch = useDispatch();

  // console.log('recordName', recordName);
  const {navigation, moduleName, recordId} = recordViewerState;

  useEffect(() => {
    const setRecordID = async () => {
      try {
        await AsyncStorage.setItem('UID', JSON.stringify(recordId));
      } catch (error) {
        console.log('err', error);
      }
    };
    setRecordID();
  }, []);

  function createTabs() {
    const tabs = [];
    const viewer = {
      tabIcon: 'file-alt',
      tabLabel: 'Details',
      component: (
        <Viewer
          key={0}
          tabLabel="Details"
          navigation={navigation}
          moduleName={moduleName}
          recordId={recordId}
        />
      ),
    };
    const Summary = {
      tabIcon: 'list-ul',
      tabLabel: 'Details',
      component: (
        <Summery
          key={1}
          tabLabel="Details"
          navigation={navigation}
          moduleName={moduleName}
          recordId={recordId}
        />
      ),
    };

    // const viewer = {
    //   tabIcon: 'file-alt',
    //   tabLabel: 'Details',
    //   component: (
    //     <Viewer
    //       key={1}
    //       tabLabel="Details"
    //       navigation={navigation}
    //       moduleName={moduleName}
    //       recordId={recordId}
    //     />
    //   ),
    // };

    const updates = {
      tabIcon: 'history',
      tabLabel: 'Updates',
      component: (
        <Updates
          key={2}
          tabLabel="Updates"
          moduleName={moduleName}
          recordId={recordId}
        />
      ),
    };

    const comments = {
      tabIcon: 'comment',
      tabLabel: 'Comments',
      component: <Comments key={3} tabLabel="Comments" recordId={recordId} />,
    };

    tabs.push(viewer, Summary, updates);

    if (enabledModules.includes(moduleName)) tabs.push(comments);

    return tabs;
  }

  const tabs = createTabs();
  // const tabIcons = tabs.map((x) => x.tabIcon);
  // const tabComponents = tabs.map((x) => x.component);
  // const [items, setItems] = useState('Details');
  const [items, setItems] = useState('Details');
  const [itemsToShow, setItemsToShow] = useState(3);
  const [btnTop, setBtnTop] = useState([]);
  const [id, setId] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [documentModal, setdocumentModal] = useState(false);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgname, setOrgName] = useState('');
  const [subject, setSubject] = useState('');
  const [fields, setFields] = useState([]);
  const [itemFields, setItemFields] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [state, setState] = useState({value: '', fun: ''});
  const [newTabs, setNewTabs] = useState([]);
  const [imageModel, setImageModel] = useState(false);
  const [IMG, setIMG] = useState();
  const [fileType, setFileType] = useState('');
  const [NFCModel, setNFCModel] = useState(false);
  const [saveTextModel, setSaveTextModel] = useState(false);
  const [isCompare, setIsCompare] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [nfcText, setNFCText] = useState();
  const [file, setFile] = useState(null);
  const [timeSheetModal, setTimeSheetModal] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [saveText, setSaveText] = useState();
  const [popupText, setPopupText] = useState();
  const [popupWindowText, setPopupWindowText] = useState();
  const [inputValues, setInputValues] = useState({});
  const [inputImgFieldval, setInputImgFieldval] = useState({});
  const [profileImage, setProfileImage] = useState();
  const [moduleData, setModuleData] = useState();
  const [documentDetails, setDocumentDetails] = useState([]);
  const [docdetailModal, setDocdetailModal] = useState(false);
  const [recordName, setRecordName] = useState();
  let data = [
    {
      id: 1,
      lbl: 'Edit',
      icon: (
        <MaterialIcons name="mode-edit-outline" size={25} color="#757575" />
      ),
    },
    {
      id: 2,
      lbl: 'Delete',
      icon: <MaterialIcons name="delete" size={25} color="#757575" />,
    },
    {
      id: 3,
      // lbl: 'Add Document (From Camera)',
      lbl: 'Take a photo with camera ',
      icon: <Icon name="camera" size={25} color="#757575" />,
    },
    {
      id: 4,
      // lbl: 'Add Document (From Gallery)',
      lbl: 'Add a photo from camera\nlibrary',
      icon: <IconFontAwesome name="photo" size={25} color="#757575" />,
    },
    {
      id: 5,
      lbl: 'File From Documents',
      icon: <Ionicons name="document-text-outline" size={30} color="#757575" />,
    },
  ];

  useEffect(() => {
    setloading(true);
    getRelativeModuleModules();
  }, []);

  const getColors = async () => {
    try {
      const res = await API_describe('Timesheets');
      let fieldsWithPicklistColors = [];
      for (
        let index = 0;
        index < res?.result?.describe?.fields?.length;
        index++
      ) {
        const field = res?.result?.describe?.fields[index];
        if (field?.type?.picklistColors) {
          fieldsWithPicklistColors.push(field);
        }
      }
      dispatch(passValue(fieldsWithPicklistColors));
    } catch (error) {
      console.log('err', error);
    }
  };
  const colorsType = useSelector((state) => state?.colorRuducer?.passedValue);

  let isTime_SheetModal = useSelector(
    (state) => state?.timeSheetModalReducer?.is_TimeSheetModal,
  );

  useEffect(() => {
    if (isTime_SheetModal === false) {
      setTimeSheetModal(isTime_SheetModal);
      dispatch(isTimeSheetModal(null));
    }
  }, [isTime_SheetModal]);

  const getImageData = async (data) => {
    let record = data[0]?.record;

    let url = await get_Url();

    try {
      let res = await axios.post(
        `${url}/modules/Mobile/api.php`,
        {
          record,
          module: 'Documents',
          _operation: 'downloadFile',
        },

        {
          responseType: 'blob',
        },
      );

      let imgUrl = URL.createObjectURL(res.data);
      setIMG(imgUrl);
      setImageModel(true);
    } catch (error) {
      console.log('err', error);
    }
  };

  const openFile = async (data, fileName) => {
    let record = data[0]?.record;

    let url = await get_Url();

    try {
      let res = await axios.post(
        `${url}/modules/Mobile/api.php`,
        {
          record,
          module: 'Documents',
          _operation: 'downloadFile',
        },
        {
          responseType: 'blob',
        },
      );

      let imgUrl = URL.createObjectURL(res.data);
      openBlobFile(imgUrl, fileName);
    } catch (error) {
      console.log('err', error);
    }
  };

  const openBlobFile = async (blobUrl, fileName) => {
    try {
      // Define the path to save the file locally
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;

      // Fetch the blob data
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // Convert blob to base64
      const base64Data = await blobToBase64(blob);

      // Write the file locally
      await RNFS.writeFile(filePath, base64Data, 'base64');

      // Open the file with react-native-file-viewer
      await FileViewer.open(filePath);

      console.log('File opened successfully');
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  const getDocumentDetails = async () => {
    try {
      let res = await API_describe('Documents');

      if (res?.success === true) {
        let newData = res?.result?.describe?.fields?.filter(
          (val) => val?.name === 'filename' || val?.name === 'notecontent',
        );
        setDocumentDetails(newData);
        setDocdetailModal(true);
      }
    } catch (error) {
      console.log('err', err);
    }
  };

  const getRelativeModuleModules = async () => {
    try {
      let res = await API_describe(moduleName);

      let recordName = listerInstance?.state?.data?.filter(
        (val) => val?.id === recordId,
      );
      if (recordName) {
        setRecordName(recordName?.[0]?.[res?.result?.describe?.labelFields]);
      }

      let relatedModules = res?.result?.describe?.relatedModules;

      let isArry = Array.isArray(relatedModules);
      // let newData = isArry
      //   ? relatedModules
      //   : Object.values(relatedModules)?.map((module) => module?.label);

      // console.log('newData', newData);

      const moduleData = relatedModules[moduleName];
      setModuleData(moduleData);

      let newData1 = isArry ? relatedModules : Object.values(relatedModules);

      const filter_Data = newData1?.filter(
        (val) => val?.label !== 'ModComments',
      );

      const new_array = filter_Data?.map((val, index) => {
        return {
          tabLabel: val?.label,
          // tabIcon: '',
          component: (
            <CommanView
              tabId={val?.tabid}
              lister={route?.params?.listerInstance}
              tabLabel={val?.label}
              moduleName={moduleName}
              recordId={recordId}
              navigation={navigation}
              onPress={(data) => {
                getImageData(data);
              }}
              openFile={(data, fileName) => {
                openFile(data, fileName);
              }}
            />
          ),
        };
      });

      // let newarray = tabs.filter((val) => {
      //   return res?.result?.describe?.relatedModules.some(
      //     (mod) => val.tabLabel === mod,
      //   );
      // });
      // if (newarray) {
      //   setloading(false);
      // }

      setNewTabs([
        // tabs[0],
        tabs[1],
        tabs[2],
        tabs[tabs.length - 1],
        ...new_array,
      ]);
    } catch (error) {
      setNewTabs([tabs[1], tabs[2], tabs[tabs.length - 1]]);
      console.log('err', error);
    }
  };

  const loadMore = () => {
    setItemsToShow(itemsToShow + 5); // Load more items
  };

  useEffect(() => {
    const filteredFields = itemFields?.map((val) => {
      return fields?.find((itm) => val === itm?.name);
    });

    if (filteredFields != null && filteredFields != undefined) {
      const filteredArray = filteredFields.filter(
        (item) => item !== null && item !== undefined,
      );
      setNewArr(filteredArray);
    }
  }, [itemFields]);

  useEffect(() => {
    getRecords();
    getButtons();
    if (moduleName === 'Contacts' || moduleName === 'Accounts') {
      getFatchRecord();
    }
  }, []);

  useEffect(() => {
    if (firstname || lastname) {
      setFullName(`${firstname} ${lastname}`);
    }
  }, [firstname, lastname]);

  const get_Url = async () => {
    const URLDetails = await AsyncStorage.getItem(URLDETAILSKEY);
    let urlDetail = JSON.parse(URLDetails);
    let url = urlDetail.url;
    let trimmedUrl = url.replace(/ /g, '')?.replace(/\/$/, '');
    trimmedUrl =
      trimmedUrl.indexOf('://') === -1 ? 'https://' + trimmedUrl : trimmedUrl;
    if (url.includes('www.')) {
      trimmedUrl = trimmedUrl?.replace('www.', '');
    }
    if (url.includes('http://')) {
      trimmedUrl = trimmedUrl?.replace('http://', 'https://');
    }

    return trimmedUrl;
  };

  const getRecords = async () => {
    try {
      setloading(true);
      let res = await API_fetchRecordWithGrouping(moduleName, recordId);
      res?.result?.record?.blocks?.forEach((block) =>
        block?.fields?.forEach((field) => {
          if (field?.name === 'firstname') {
            setFirstName(field?.value);
            // console.log('field', field?.value);
          }
          if (field?.name === 'lastname') {
            setLastName(field?.value);
            // console.log('field', field?.value);
          }
          if (moduleName === 'Contacts' && field?.name === 'account_id') {
            setOrgName(field?.value?.label);
          }
          if (moduleName === 'Accounts' && field?.name === 'accountname') {
            setOrgName(field?.value);
          }
          if (moduleName === 'Calendar' && field?.name === 'subject') {
            setSubject(field?.value);
          }
        }),
      );
      // const labelToCheck =
      //   moduleName === 'Contacts'
      //     ? 'LBL_CONTACT_INFORMATION'
      //     : moduleName === 'Calendar'
      //     ? 'LBL_EVENT_INFORMATION'
      //     : 'LBL_ACCOUNT_INFORMATION';

      // const containsLabel = res?.result?.record?.blocks.find(
      //   (item) => item.label,
      // );

      // containsLabel?.fields.map((val) => {
      //   if (val.name === 'firstname') {
      //     setFirstName(val?.value);
      //   }
      //   if (val.name === 'lastname') {
      //     setLastName(val?.value);
      //   }
      //   if (moduleName === 'Contacts' && val.name === 'account_id') {
      //     setOrgName(val?.value?.label);
      //   }
      //   if (moduleName === 'Accounts' && val.name === 'accountname') {
      //     setOrgName(val?.value);
      //   }
      //   if (moduleName === 'Calendar' && val.name === 'subject') {
      //     setSubject(val?.value);
      //   }
      // });
      const allFields = getAllFields(res?.result?.record);
      setloading(false);

      setFields(allFields);
    } catch (error) {
      setloading(false);

      console.log('err', error);
    }
  };
  const getAllFields = (record) => {
    // Use flatMap to combine all fields from each block into a single array
    return record.blocks.flatMap((block) => block.fields);
  };
  const getButtons = async () => {
    let modulename = moduleName;

    try {
      setloading(true);

      let trimmedUrl = await get_Url();
      let res = await API_fetchButtons(trimmedUrl, modulename);
      if (res?.result?.buttons !== null) {
        res?.result?.buttons.map((val) => {
          // if (val.location === 'top') {
          setBtnTop(res?.result?.buttons);
          // }
        });
        setloading(false);
      }
    } catch (error) {
      setloading(false);
      console.log('err', error);
    }
  };
  const getFatchRecord = async () => {
    try {
      setloading(true);

      const param = {
        record: recordId,
        module: moduleName,
      };
      let res = await API_fetchRecord(param);
      if (res?.result?.record?.imagename) {
        setProfileImage(res?.result?.record?.imagename);
      }
      // if (res?.result?.buttons !== null) {
      //   res?.result?.buttons.map((val) => {
      //     // if (val.location === 'top') {
      //     setBtnTop(res?.result?.buttons);
      //     // }
      //   });
      // }
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log('err', error);
    }
  };

  const ongenericFunction = (fun, params) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailPattern.test(params)) {
      const emailUrl = `${fun}:${params}`;
      Linking.openURL(emailUrl)
        .then((res) => console.log('res', res))
        .catch((err) => console.log('err', err));
    } else if (fun === 'map') {
      openMap(params);
    } else if (fun === 'quickcreate') {
      getColors();
      setloading(true);
      setTimeout(() => {
        setSaveText(params);
        setloading(false);
        setTimeSheetModal(true);
      }, 1000);
      dispatch(isTimeSheetModal(true));
    } else {
      if (fun === 'call') {
        const ph_no = getValueByName(params);

        if (ph_no) {
          let phoneNumber = '';
          if (Platform.OS === 'android') {
            phoneNumber = `tel:${ph_no}`;
          } else {
            phoneNumber = `telprompt:${ph_no}`;
          }

          Linking.openURL(phoneNumber)
            .then((res) => console.log('res', res))
            .catch((err) => console.log('err', err));
        }
      } else {
        const ph_no = getValueByName(params);

        if (ph_no) {
          let phoneNumber = '';
          if (Platform.OS === 'android') {
            phoneNumber = `tel:${ph_no}`;
          } else {
            phoneNumber = `telprompt:${ph_no}`;
          }
          Linking.openURL(`${fun}:${phoneNumber}`)
            .then((res) => console.log('res', res))
            .catch((err) => console.log('err', err));
        }
      }
    }
  };

  const getValueByName = (params) => {
    const match = fields.find((val) => val?.name === params);

    return match?.value ? match?.value : undefined;
  };

  const saveFile = async (filedata) => {
    filedata.fileName = filedata.name;
    try {
      setloading(true);
      const {auth} = store.getState();
      const loginDetails = auth.loginDetails;
      let modulename = 'Documents';
      let parentRecord = recordId;
      let parentModule = moduleName;
      let val = {
        notes_title: filedata?.name,
        assigned_user_id: '19x' + loginDetails?.userId,
        filename: filedata?.name,
        inputImgFieldval,
      };

      let trimmedUrl = await get_Url();
      let res = await API_saveFile(
        trimmedUrl,
        modulename,
        val,
        filedata,
        parentRecord,
        parentModule,
      );
      if (res.success === true) {
        // Alert.alert('Document added successfully.');
        setloading(false);
      } else {
        // Alert.alert('Document could not be added.');
        setloading(false);
      }
    } catch (error) {
      console.log('err', error);
      setloading(false);
    }
  };
  const saveField = async () => {
    try {
      setloading(true);

      let modulename = 'Documents';

      let res = await API_saveRecord(modulename, inputImgFieldval, recordId);

      if (res.success === true) {
        Alert.alert('Document added successfully.');
        setloading(false);
      } else {
        Alert.alert('Document could not be added.');
        setloading(false);
      }
    } catch (error) {
      console.log('err', error);
      setloading(false);
    }
  };

  const opencamera = async () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      mediaType: 'photo',
      includeBase64: true,
      // useFrontCamera: true,
      cropping: true,
    })
      .then((image) => {
        const getFileName = (filePath) => {
          // Use react-native-fs to extract filename from path
          const pathArray = filePath.split('/');
          const filename = pathArray[pathArray.length - 1];
          return filename;
        };
        let fileName = getFileName(image.path);

        let file = {
          uri: image.path,
          name: fileName,
          filename: fileName,
          type: image.mime,
        };
        getDocumentDetails();
        setInputImgFieldval({filename: image?.filename});
        // saveFile(file, true);
        setFile(file);
      })
      .catch((err) => console.log('err', err));
  };

  const openimagelib = async () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'photo',
      includeBase64: true,
      // useFrontCamera: true,
      cropping: true,
    })
      .then((image) => {
        const getFileName = (filePath) => {
          // Use react-native-fs to extract filename from path
          const pathArray = filePath.split('/');
          const filename = pathArray[pathArray.length - 1];
          return filename;
        };

        let fileName = getFileName(image.path);

        let file = {
          uri: image.path,
          name: fileName,
          filename: fileName,
          type: image.mime,
        };
        setInputImgFieldval({filename: image?.filename});
        getDocumentDetails();
        setFile(file);
        // saveFile(file, true);
      })
      .catch((err) => console.log('err', err));
    // try {
    //   const res = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.images],
    //   });

    //   saveFile(res[0], true);
    // } catch (err) {
    //   console.log('err', err);
    // }
  };

  const onEdit = async () => {
    try {
      let res = await AsyncStorage.getItem('UID');
      let jsonValue = JSON.parse(res);
      navigation.navigate('Edit Record', {
        id: jsonValue,
        lister: listerInstance,
        isDashboard: true,
      });
    } catch (error) {
      console.log('err', error);
    }
  };

  async function onEditForCalender() {
    try {
      let res = await AsyncStorage.getItem('UID');
      let jsonValue = JSON.parse(res);
      navigation.navigate('Edit Record', {
        id: jsonValue,
      });
    } catch (error) {
      console.log('err', error);
    }
  }
  const onDelete = () => {
    Alert.alert(
      'Are you sure want to delete this record ?',
      '',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            listerInstance.setState({selectedIndex: -1});
            listerInstance.setState(
              {
                isFlatListRefreshing: true,
              },
              () => {
                dispatch(
                  deleteRecord(listerInstance, recordId, index, () => {
                    listerInstance.setState({
                      isFlatListRefreshing: false,
                    });
                  }),
                );
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {name: 'Drawer'}, // Navigate to the top-level navigator
                    ],
                  }),
                );
              },
            );
          },
        },
      ],
      {cancelable: true},
    );
  };
  function onDeleteForCalender() {
    Alert.alert(
      'Are you sure want to delete this record ?',
      '',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            dispatch(deleteCalendarRecord(recordId));
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {name: 'Drawer'}, // Navigate to the top-level navigator
                ],
              }),
            );
          },
        },
      ],
      {cancelable: true},
    );
  }

  // const checkIsSupported = async () => {
  //   const deviceIsSupported = await NfcManager.isSupported();
  //   const deviceIsEnable = await NfcManager.isEnabled();

  //   if (deviceIsSupported === false) {
  //     Alert.alert('NFC functionality is not supported on this device.');
  //   } else if (deviceIsEnable === false) {
  //     if (Platform.OS === 'ios') {
  //       Alert.alert('To use NFC, enable it in your device settings.');
  //     } else {
  //       Alert.alert('Please enable NFC to proceed.');
  //     }
  //   } else {
  //     await readNdef();
  //   }
  // };

  // async function readNdef() {
  //   try {
  //     if (Platform.OS === 'android') {
  //       setNFCModel(true);
  //     }
  //     await NfcManager.requestTechnology(NfcTech.Ndef);
  //     const tag = await NfcManager.getTag();

  //     if (
  //       tag?.ndefMessage &&
  //       tag?.ndefMessage[0] &&
  //       tag.ndefMessage[0].payload?.length === 0
  //     ) {
  //       Alert.alert('Invalid or empty tag');
  //       setNFCModel(false);
  //       return;
  //     }

  //     if (tag?.ndefMessage[0]?.payload?.length > 0) {
  //       setNFCModel(false);

  //       let payloadData = tag?.ndefMessage[0]?.payload;
  //       // Convert numeric values to Uint8Array
  //       // const uint8Array = new Uint8Array(payloadData);

  //       // Decode the Uint8Array into a string
  //       // const decoder = new TextDecoder('utf-8');
  //       // const resultString = decoder.decode(uint8Array);

  //       const resultString = String.fromCharCode.apply(null, payloadData);
  //       const modifiedString = resultString.replace(/en/g, '');

  //       if (nfcText) {
  //         if (modifiedString === nfcText) {
  //           setIsCompare(true);
  //           setNFCText();
  //         } else {
  //           setIsWrong(true);
  //           setNFCText();
  //         }
  //       } else {
  //         setSaveTextModel(true);
  //         setNFCText(modifiedString);
  //       }
  //     }
  //   } catch (ex) {
  //     console.log('Oops!', ex);
  //   } finally {
  //     // stop the nfc scanning
  //     NfcManager.cancelTechnologyRequest();
  //   }
  // }

  const handlePress = (itemId) => {
    switch (itemId) {
      case 1:
        moduleName === 'Calendar' ? onEditForCalender() : onEdit();
        break;
      case 2:
        moduleName === 'Calendar' ? onDeleteForCalender() : onDelete();
        break;
      case 3:
        if (Platform.OS === 'ios') {
          setTimeout(() => {
            opencamera();
          }, 1000);
        } else {
          opencamera();
        }
        break;
      case 4:
        if (Platform.OS === 'ios') {
          setloading(true);
          setTimeout(() => {
            openimagelib();
          }, 1000);
          setTimeout(() => {
            setloading(false);
          }, 1100);
        } else {
          openimagelib();
        }
        break;
      case 5:
        if (Platform.OS === 'ios') {
          setTimeout(() => {
            pickFile();
          }, 1000);
        } else {
          pickFile();
        }
        break;
      default:
        break;
    }
    setdocumentModal(false);
  };
  const openMap = (address) => {
    const encodedAddress = encodeURIComponent(address);

    // URL format for Apple Maps (iOS) and Google Maps (Android)
    const appleMapsUrl = `maps://?q=${encodedAddress}`; // Apple Maps (iOS)
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`; // Google Maps (Android and iOS)

    // Open Google Maps on Android, Apple Maps on iOS
    const url = Platform.select({
      ios: appleMapsUrl,
      android: googleMapsUrl,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Unable to open map', 'No map application available.');
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      getDocumentDetails();
      setInputImgFieldval({filename: res[0]?.name});

      // saveFile(res[0], true);
      setFile(file);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('err', err);
      } else {
        console.log('err', err);
        // Alert.alert('Unknown error: ' + JSON.stringify(err));
      }
    }
  };

  // const uploadFile = async () => {
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri: file.uri,
  //       type: file.type,
  //       name: file.name,
  //     });

  //     try {
  //       const response = await axios.post('YOUR_SERVER_URL/upload', formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });
  //       Alert.alert('File uploaded successfully');
  //     } catch (err) {
  //       Alert.alert('File upload failed: ' + JSON.stringify(err));
  //     }
  //   } else {
  //     Alert.alert('Please select a file first');
  //   }
  // };

  const updateData = async () => {
    try {
      const responseJson = await API_saveRecord(
        moduleName,
        JSON.stringify(inputValues),
        recordId,
      );
      console.log('responseJson', responseJson);
      if (responseJson?.success === true) {
        let data = {
          loading: false,
          isScrollViewRefreshing: true,
          statusText: 'Refreshing',
          statusTextColor: '#000000',
        };

        navigation.pop();
      }
      if (responseJson?.success === false) {
        Alert.alert(responseJson?.error?.message);
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 15,
          justifyContent: 'center',
          borderBottomWidth: item.tabLabel === items ? 2 : 0,
          borderBottomColor:
            item.tabLabel === items ? headerIconColor : textColor,
          // padding: 5,
          paddingHorizontal: 5,
          paddingBottom: 10,
        }}
        onPress={() => setItems(item.tabLabel)}>
        {item.tabLabel === 'SimplyVoice' ? (
          <Feather
            name={item.tabIcon}
            color={item.tabLabel === items ? headerIconColor : textColor}
            size={20}
          />
        ) : item.tabLabel === 'SMPFeedback' ? (
          <MaterialIcons
            name={item.tabIcon}
            color={item.tabLabel === items ? headerIconColor : textColor}
            size={20}
          />
        ) : item.tabLabel === 'Participations' ? (
          <MaterialIcons
            name={item.tabIcon}
            color={item.tabLabel === items ? headerIconColor : textColor}
            size={20}
          />
        ) : item.tabLabel === 'Potentials' ? (
          <MaterialCommunityIcons
            name={item.tabIcon}
            color={item.tabLabel === items ? headerIconColor : textColor}
            size={20}
          />
        ) : (
          <Icon
            name={item.tabIcon}
            color={item.tabLabel === items ? headerIconColor : textColor}
            size={20}
          />
        )}

        <Text
          style={{
            paddingLeft: item.tabIcon ? 10 : 0,
            fontFamily:
              item.tabLabel === items ? 'Poppins-Medium' : 'Poppins-Regular',
            color: item.tabLabel === items ? headerIconColor : textColor,
            // color: item.tabLabel === items ? headerIconColor : '#707070',
          }}>
          {item.tabLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: generalBgColor}}>
      {imageModel && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(52,52,52,0.3)',
            zIndex: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: height - 120,
              width: width - 40,
              alignSelf: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={{height: '100%', width: '100%'}}
              source={{uri: IMG}}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              // justifyContent: 'space-between',
              justifyContent: 'center',
              // flexDirection: 'row',
              marginHorizontal: 20,
            }}>
            {/* <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: '#5699E6',
                paddingHorizontal: 25,
                paddingVertical: 8,
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => downloadImage()}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                }}>
                Download
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: '#EE4B2B',
                paddingHorizontal: 25,
                paddingVertical: 8,
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => setImageModel(false)}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Header
        title={'Record Details'}
        showBackButton
        showDetailButton
        onPress={() => {
          setdocumentModal(!documentModal);
        }}
      />
      {loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <ActivityIndicator
            animating={loading}
            size={'large'}
            color={'#fff'}
          />
        </View>
      )}

      {documentModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={documentModal}
          onRequestClose={() => {
            setdocumentModal(!documentModal);
          }}>
          <TouchableOpacity
            onPress={() => setdocumentModal(false)}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 10,
                marginHorizontal: 1,
                borderTopRightRadius: 10,
                paddingBottom: 50,
              }}>
              <View
                style={{
                  borderRadius: 50,
                  width: '15%',
                  backgroundColor: '#000',
                  height: '3%',
                  marginTop: 3,
                  alignSelf: 'center',
                }}
              />

              <View style={{paddingLeft: 20, paddingVertical: 15}}>
                <Text
                  style={{
                    // color: '#757575',
                    fontSize: 20,
                    fontFamily: 'Poppins-SemiBold',
                    fontWeight: '700',
                    color: '#000',
                  }}>
                  Select option:
                </Text>
              </View>
              {data.map((value, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',

                      borderBottomWidth: 3,
                      borderRadius: 3,
                      marginHorizontal: 20,
                      borderBottomColor: '#efefef',
                    }}
                    onPress={() => handlePress(value.id)}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {value.icon}
                    </View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '700',
                        fontFamily: 'Poppins-SemiBold',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 10,
                        paddingLeft: 15,
                        color: '#000000',
                      }}>
                      {value.lbl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* {moduleName === 'Contacts' ? ( */}
      {moduleName === 'Contacts' || moduleName === 'Accounts' ? (
        <View>
          <View
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              width: '100%',
              backgroundColor: '#fff',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
              <View
                style={{
                  width: '25%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // shadowColor: '#000',
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 1,
                  // },
                  // shadowOpacity: 0.22,
                  // shadowRadius: 2.22,

                  // elevation: 3,
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    height: 65,
                    width: 65,
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                  onPress={() => {
                    if (profileImage) {
                      setProfileVisible(true);
                    }
                  }}>
                  <Image
                    // source={{uri: profileImage}}
                    source={
                      profileImage
                        ? {uri: profileImage}
                        : require('../../../assets/images/userProfile.jpg')
                    }
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{width: '70%'}}>
                {moduleName === 'Contacts' ? (
                  <>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 20,
                        color: fullName ? textColor2 : textColor,
                        fontFamily: 'Poppins-SemiBold',
                      }}>
                      {fullName ? fullName : 'Full Name'}
                    </Text>

                    <Text
                      style={{
                        fontSize: 15,
                        color: orgname ? textColor2 : textColor,
                        fontFamily: orgname
                          ? 'Poppins-Regular'
                          : 'Poppins-SemiBold',
                      }}>
                      {orgname ? orgname : 'Organization Name'}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={{
                      fontSize: 20,
                      color: orgname ? '#000' : '#9a9a9c',
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    {orgname ? orgname : 'Organization Name'}
                  </Text>
                )}
              </View>
              {/* <TouchableOpacity>
                <Entypo name="edit" size={28} color="#9a9a9c" />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      ) : null}
      {btnTop?.length > 0 && (
        <View
          style={{
            backgroundColor: '#fff',
            paddingVertical: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '80%',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: nfcText
                    ? 'rgba(0, 133, 222, 0.3)'
                    : '#0085DE',
                  borderRadius: 5,
                }}
                disabled={nfcText ? true : false}
                onPress={() => checkIsSupported()}>
                <Text style={styles.nfcbtn}>saveNFC</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: nfcText
                    ? '#4ec759'
                    : 'rgba(78, 199, 89, 0.3)',
                  borderRadius: 5,
                }}
                disabled={nfcText ? false : true}
                onPress={() => checkIsSupported()}>
                <Text style={styles.nfcbtn}>compareNFC</Text>
              </TouchableOpacity>
            </View> */}
          <FlatList
            data={btnTop}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              flexGrow: 1,
              marginHorizontal: 10,
            }}
            // scrollEnabled={false}
            renderItem={({item, index}) => {
              const textColor = isLightColor(item?.color) ? 'black' : 'white';
              // const parsedIcon = parseIconFromClassName(item.icon);
              return (
                <View
                  key={index}
                  style={{
                    paddingHorizontal: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* {parsedIcon ? (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={{
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          if (item?.showModal[0] === '') {
                            ongenericFunction(
                              item?.runFunction[0].function,
                              item?.runFunction[0].parameter,
                            );
                            setSaveText(item?.runFunction[0].parameter);
                          } else {
                            setVisible(!visible);
                            setItemFields(item.showModal);
                            setState({
                              value: item?.runFunction[0].parameter,
                              fun: item?.runFunction[0].function,
                            });
                            setSaveText(item?.runFunction[0].parameter);
                          }
                        }}>
                        <FontAwesome
                          icon={parsedIcon}
                          style={{color: item.color, fontSize: 30}}
                        />
                      </TouchableOpacity>
                    ) : ( */}
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      backgroundColor: item.color,
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      borderRadius: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      // setVisible(!visible);
                      if (item?.showModal[0] === '') {
                        ongenericFunction(
                          item?.runFunction[0].function,
                          item?.runFunction[0].parameter,
                        );
                        setSaveText(item?.runFunction[0].parameter);
                        setPopupText(item?.popupText);
                        setPopupWindowText(item?.popupWindowTitle);
                      } else {
                        setVisible(!visible);
                        setItemFields(item.showModal);
                        setState({
                          value: item?.runFunction[0].parameter,
                          fun: item?.runFunction[0].function,
                        });
                        setSaveText(item?.runFunction[0].parameter);
                        setPopupText(item?.popupText);
                        setPopupWindowText(item?.popupWindowTitle);
                      }
                    }}>
                    <DynamicIcon iconName={item?.icon} color={textColor} />
                    {/* <FontAwesome
                      name={item?.icon}
                      color={textColor}
                      size={20}
                    /> */}
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: textColor,
                        marginLeft: 10,
                      }}>
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                  {/* )} */}
                </View>
              );
            }}
          />
        </View>
      )}
      <View
        style={{
          // height: '7%',
          backgroundColor: '#fff',
          borderBottomWidth: 0.5,
          // marginTop: 10,
          paddingTop: 10,
          borderBottomColor: '#d3d2d8',
        }}>
        <FlatList
          // data={newTabs.slice(0, itemsToShow)}
          data={newTabs}
          horizontal
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          // ListFooterComponent={
          //   newTabs.length > itemsToShow && (
          //     <TouchableOpacity
          //       style={{
          //         backgroundColor: '#00BBF2',
          //         marginRight: 10,
          //         borderRadius: 5,
          //       }}
          //       onPress={loadMore}>
          //       <Text
          //         style={{
          //           paddingHorizontal: 10,
          //           paddingVertical: 5,
          //           color: '#fff',
          //           fontFamily: 'Poppins-Regular',
          //         }}>
          //         Load More
          //       </Text>
          //     </TouchableOpacity>
          //   )
          // }
        />
      </View>
      <View style={{flex: 1}}>
        {newTabs.map((val) => {
          if (val.tabLabel === items) {
            return val.component;
          }
        })}
      </View>

      {/* <View style={{width: '100%', flex: 1}}>
        <ScrollableTabView
          prerenderingSiblingsNumber={Infinity}
          style={{backgroundColor: '#f2f3f8'}}
          renderTabBar={() => <IconTabBar tabIcons={tabIcons} />}
          tabBarActiveTextColor={'#00BBF2'}
          tabBarInactiveTextColor={'#707070'}
          tabBarUnderlineStyle={{
            backgroundColor: '#00BBF2',
            height: 3,
          }}
          contentProps={{
            keyboardShouldPersistTaps: 'handled',
          }}
          tabBarTextStyle={{
            fontSize: 14,
            paddingTop: 10,
          }}>
          {tabComponents}
        </ScrollableTabView>
      </View> */}
      <DocumentDetailModal
        data={documentDetails}
        docdetailModal={docdetailModal}
        onClose={() => {
          // saveFile();
          setDocdetailModal(false);
        }}
        onSave={() => {
          setDocdetailModal(false);
          saveFile(file);
          saveField();
        }}
        inputValues={inputImgFieldval}
        setInputValues={setInputImgFieldval}
      />
      <RecordModal
        visible={visible}
        newArr={newArr}
        onClose={() => setVisible(false)}
        onSave={() => {
          const isEmpty = (obj) => {
            return Object.keys(obj).length === 0;
          };
          let isData = !isEmpty(inputValues);

          if (isData) {
            updateData();
          }
          setVisible(false);
          ongenericFunction(state.fun, state.value);
        }}
        inputValues={inputValues}
        setInputValues={setInputValues}
        popupText={popupText}
        popupWindowText={popupWindowText}
        moduleName={moduleName}
      />

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={NFCModel}
        onRequestClose={() => {
          setNFCModel(false);
        }}>
        <View style={styles.nfcScanView}>
          <View style={styles.nfcInnerView}>
            <Text style={styles.nfcreadytoscan}>Ready to Scan</Text>
            <LottieView
              source={require('../../../assets/images/NFC.json')}
              style={{width: '90%', height: '90%'}}
              autoPlay
              loop
            />
            <TouchableOpacity
              style={styles.btnCancle}
              onPress={() => {
                setNFCModel(false), NfcManager.cancelTechnologyRequest();
              }}>
              <Text style={{color: '#000', fontWeight: '700', fontSize: 20}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={saveTextModel}>
        <View style={styles.nfcViewTag}>
          <View style={styles.nfcView}>
            <LottieView
              source={require('../../../assets/images/savetext.json')}
              style={{width: '100%', height: '100%'}}
              autoPlay
              loop={false}
              speed={1}
              onAnimationFinish={() => setSaveTextModel(false)}
            />
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={isCompare}>
        <View style={styles.nfcViewTag}>
          <View style={styles.nfcView}>
            <LottieView
              source={require('../../../assets/images/comparetext.json')}
              style={{width: '100%', height: '100%'}}
              autoPlay
              loop={false}
              speed={1}
              onAnimationFinish={() => setIsCompare(false)}
            />
            <Text style={styles.nfcTitle}>Correct NFC code</Text>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={isWrong}>
        <View style={styles.nfcViewTag}>
          <View style={styles.nfcView}>
            <LottieView
              source={require('../../../assets/images/wrongtext.json')}
              style={{width: '90%', height: '90%'}}
              autoPlay
              loop={false}
              speed={1}
              onAnimationFinish={() => setIsWrong(false)}
            />
            <Text style={styles.nfcTitle}>Sorry, wrong NFC code</Text>
          </View>
        </View>
      </Modal> */}

      <FormMoadal
        timeSheetModal={timeSheetModal}
        onPress={() => {
          dispatch(isTimeSheetModal(null));
          setTimeSheetModal(false);
        }}
        component={
          <AddRecords
            recordId={recordId}
            recordName={recordName}
            moduleName={moduleName}
            lister={route?.params?.listerInstance}
            isDashboard={false}
            navigation={route?.params?.listerInstance?.props?.navigation}
            isTimesheets={saveText}
            colorsType={colorsType}
            moduleData={moduleData}
          />
        }
      />

      <ProfileModal
        profileVisible={profileVisible}
        profileImage={profileImage}
        onPress={() => setProfileVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',
    backgroundColor: 'white',
  },
  nfcScanView: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  nfcInnerView: {
    position: 'absolute',
    bottom: 5,
    borderRadius: 30,
    height: '45%',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcreadytoscan: {
    color: '#afafaf',
    fontWeight: '400',
    fontSize: 30,
    position: 'absolute',
    zIndex: 1,
    top: 30,
  },
  nfcViewTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcView: {
    borderRadius: 15,
    height: '25%',
    width: '55%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  nfcTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    position: 'absolute',
    bottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  btnCancle: {
    backgroundColor: '#d3d2d8',
    width: '80%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    position: 'absolute',
    bottom: 30,
  },
  nfcbtn: {
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
