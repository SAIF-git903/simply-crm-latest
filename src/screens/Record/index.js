import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {useIsFocused, CommonActions} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import FontAwesome, {
  SolidIcons,
  RegularIcons,
  BrandIcons,
  parseIconFromClassName,
} from 'react-native-fontawesome';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Header from '../../components/common/Header';
import Viewer from '../../components/recordViewer/viewer';
import Updates from './Updates';
import Comments from './Comments/';
import IconTabBar from '../../components/common/IconTabBar';
import {backgroundColor} from 'react-native-calendars/src/style';
import Summery from '../../components/recordViewer/Summery';
import {LOGINDETAILSKEY, URLDETAILSKEY} from '../../variables/strings';
import {
  API_deleteRecord,
  API_fetchButtons,
  API_fetchRecordWithGrouping,
  API_saveFile,
} from '../../helper/api';
import store from '../../store';
import moment from 'moment';
import {deleteRecord} from '../../actions';
import {deleteCalendarRecord} from '../../ducks/calendar';

var ScrollableTabView = require('react-native-scrollable-tab-view');

export default function RecordDetails({route}) {
  const isFocused = useIsFocused();

  const listerInstance = route?.params?.listerInstance;
  const index = route?.params?.index;

  const recordViewerState = useSelector((state) => state.recordViewer);
  console.log('recordViewerState', recordViewerState);

  const {enabledModules} = useSelector(
    (state) => state.comments,
    (p, n) => p.enabledModules === n.enabledModules,
  );

  const dispatch = useDispatch();

  const {navigation, moduleName, recordId} = recordViewerState;

  function createTabs() {
    const tabs = [];

    const Summary = {
      tabIcon: 'list-ul',
      tabLabel: 'Summary',
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
    const viewer = {
      tabIcon: 'file-alt',
      tabLabel: 'Details',
      component: (
        <Viewer
          key={1}
          tabLabel="Details"
          navigation={navigation}
          moduleName={moduleName}
          recordId={recordId}
        />
      ),
    };

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

    const contacts = {
      tabIcon: 'user',
      tabLabel: 'Contacts',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };

    const deals = {
      tabIcon: 'handshake',
      tabLabel: 'Deals',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const messagehistory = {
      tabIcon: 'sms',
      tabLabel: 'Message History',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const salesOrders = {
      tabIcon: 'clipboard-list',
      tabLabel: 'Sales Orders',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const invoices = {
      tabIcon: 'file-invoice-dollar',
      tabLabel: 'Invoices',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const activities = {
      tabIcon: 'calendar-alt',
      tabLabel: 'Activities',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const emails = {
      tabIcon: 'envelope',
      tabLabel: 'Emails',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const documents = {
      tabIcon: 'file',
      tabLabel: 'Documents',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const members = {
      tabIcon: 'building',
      tabLabel: 'Members',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const tickets = {
      tabIcon: 'ticket-alt',
      tabLabel: 'Tickets',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const products = {
      tabIcon: 'shopping-cart',
      tabLabel: 'Products',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const services = {
      tabIcon: 'hand-holding-usd',
      tabLabel: 'Services',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const simplyvoice = {
      tabIcon: 'phone-call',
      tabLabel: 'Simply Voice',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const feedBack = {
      tabIcon: 'feedback',
      tabLabel: 'Feedback',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const webtracker = {
      tabIcon: 'search',
      tabLabel: 'Web Tracker',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const vendors = {
      tabIcon: 'shield-alt',
      tabLabel: 'Vendors',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };
    const participations = {
      tabIcon: 'groups',
      tabLabel: 'Participations',
      component: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No details found</Text>
        </View>
      ),
    };

    const comments = {
      tabIcon: 'comment',
      tabLabel: 'Comments',
      component: <Comments key={3} tabLabel="Comments" recordId={recordId} />,
    };

    tabs.push(
      // Summary,
      viewer,
      updates,
      // contacts,
      // deals,
      // messagehistory,
      // salesOrders,
      // invoices,
      // activities,
      // emails,
      // documents,
      // members,
      // tickets,
      // products,
      // services,
      // simplyvoice,
      // feedBack,
      // webtracker,
      // vendors,
      // participations,
    );

    if (enabledModules.includes(moduleName)) tabs.push(comments);

    return tabs;
  }

  const tabs = createTabs();
  // const tabIcons = tabs.map((x) => x.tabIcon);
  // const tabComponents = tabs.map((x) => x.component);
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
      lbl: 'Add Document (From Camera)',
      icon: <Icon name="camera" size={25} color="#757575" />,
    },
    {
      id: 4,
      lbl: 'Add Document (From Gallery)',
      icon: <IconFontAwesome name="photo" size={25} color="#757575" />,
    },
    // {
    //   id: 5,
    //   lbl: 'Create New Document',
    //   icon: <Ionicons name="document-text-outline" size={30} color="#757575" />,
    // },
  ];

  const loadMore = () => {
    setItemsToShow(itemsToShow + 5); // Load more items
  };

  useEffect(() => {
    const filteredFields = itemFields?.map((val) => {
      return fields?.find((itm) => val === itm?.name);
    });
    if (filteredFields != null && filteredFields != undefined) {
      setNewArr(filteredFields);
    }
  }, [itemFields]);

  useEffect(() => {
    if (firstname || lastname) {
      setFullName(`${firstname} ${lastname}`);
    }
  }, [firstname, lastname]);

  useEffect(() => {
    if (isFocused) {
      getRecords();
      if (moduleName === 'Contacts' || moduleName === 'Accounts') {
        getButtons();
      }
    }
  }, [isFocused]);
  // useEffect(() => {
  //   if (visible === false) {
  //     if ((state.fun, state.value)) {

  //     }
  //   }
  // }, [visible]);

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
      res?.result?.record?.blocks[0]?.fields.map((val) => {
        if (val.name === 'firstname') {
          setFirstName(val?.value);
        }
        if (val.name === 'lastname') {
          setLastName(val?.value);
        }
        if (moduleName === 'Contacts' && val.name === 'account_id') {
          setOrgName(val?.value?.label);
        }
        if (moduleName === 'Accounts' && val.name === 'accountname') {
          setOrgName(val?.value);
        }
        if (moduleName === 'Calendar' && val.name === 'subject') {
          setSubject(val?.value);
        }
      });

      setFields(res?.result?.record?.blocks[0]?.fields);
      setloading(false);
    } catch (error) {
      setloading(false);

      console.log('err', error);
    }
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

  const ongenericFunction = (fun, params) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailPattern.test(params)) {
      const emailUrl = `${fun}:${params}`;
      Linking.openURL(emailUrl)
        .then((res) => console.log('res', res))
        .catch((err) => console.log('err', err));
    } else {
      if (fun === 'call') {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
          phoneNumber = `tel:${params}`;
        } else {
          phoneNumber = `telprompt:${params}`;
        }

        Linking.openURL(phoneNumber)
          .then((res) => console.log('res', res))
          .catch((err) => console.log('err', err));
      } else {
        Linking.openURL(`${fun}:${params}`)
          .then((res) => console.log('res', res))
          .catch((err) => console.log('err', err));
      }
    }
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
      useFrontCamera: true,
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

        saveFile(file, true);
      })
      .catch((err) => console.log('err', err));
  };

  const openimagelib = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      saveFile(res[0], true);
    } catch (err) {
      console.log('err', err);
    }
  };

  const onEdit = () => {
    navigation.navigate('Edit Record', {
      id: recordId,
      lister: listerInstance,
      isDashboard: false,
    });
  };

  function onEditForCalender() {
    navigation.navigate('Edit Record', {
      id: recordId,
    });
  }
  const onDelete = () => {
    Alert.alert(
      'Are you sure want to delete this record ?',
      fullName,
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
      subject,
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
          setTimeout(() => {
            openimagelib();
          }, 1000);
        } else {
          openimagelib();
        }
        break;
      case 5:
        console.log('Create New Document selected');
        break;
      default:
        break;
    }
    setdocumentModal(false);
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
          borderBottomColor: item.tabLabel === items ? '#00BBF2' : '#707070',
          padding: 5,
        }}
        onPress={() => setItems(item.tabLabel)}>
        {item.tabLabel === 'Simply Voice' ? (
          <Feather
            name={item.tabIcon}
            color={item.tabLabel === items ? '#00BBF2' : '#707070'}
            size={20}
          />
        ) : item.tabLabel === 'Feedback' ? (
          <MaterialIcons
            name={item.tabIcon}
            color={item.tabLabel === items ? '#00BBF2' : '#707070'}
            size={20}
          />
        ) : item.tabLabel === 'Participations' ? (
          <MaterialIcons
            name={item.tabIcon}
            color={item.tabLabel === items ? '#00BBF2' : '#707070'}
            size={20}
          />
        ) : (
          <Icon
            name={item.tabIcon}
            color={item.tabLabel === items ? '#00BBF2' : '#707070'}
            size={20}
          />
        )}

        <Text
          style={{
            paddingLeft: 10,
            fontFamily:
              item.tabLabel === items ? 'Poppins-Medium' : 'Poppins-Regular',
            color: item.tabLabel === items ? '#00BBF2' : '#707070',
          }}>
          {item.tabLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
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
          <View style={{paddingTop: 8, width: '100%', backgroundColor: '#fff'}}>
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
                }}>
                <View
                  style={{
                    height: 65,
                    width: 65,
                    borderRadius: 60,
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={require('../../../assets/images/user.png')}
                    style={{height: '100%', width: '100%'}}
                  />
                </View>
              </View>
              <View style={{width: '70%'}}>
                {moduleName === 'Contacts' ? (
                  <>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 20,
                        color: fullName ? '#000' : '#9a9a9c',
                        fontFamily: 'Poppins-SemiBold',
                      }}>
                      {fullName ? fullName : 'Full Name'}
                    </Text>

                    <Text
                      style={{
                        fontSize: 15,
                        color: orgname ? '#000' : '#9a9a9c',
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
          <View
            style={{
              backgroundColor: '#fff',
              paddingVertical: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FlatList
              data={btnTop}
              horizontal
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                flexGrow: 1,
                marginHorizontal: 10,
              }}
              // scrollEnabled={false}
              renderItem={({item, index}) => {
                const parsedIcon = parseIconFromClassName(item.icon);
                return (
                  <View
                    style={{
                      paddingHorizontal: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {parsedIcon ? (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          setState({
                            value: item?.runFunction[0].parameter,
                            fun: item?.runFunction[0].function,
                          });

                          setVisible(!visible);
                          setItemFields(item.showModal);
                        }}>
                        <FontAwesome
                          icon={parsedIcon}
                          style={{color: item.color, fontSize: 30}}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={item.id}
                        style={{
                          backgroundColor: item.color,
                          paddingHorizontal: 20,
                          paddingVertical: 5,
                        }}
                        onPress={() => {
                          setState({
                            value: item?.runFunction[0].parameter,
                            fun: item?.runFunction[0].function,
                          });

                          setVisible(!visible);
                          setItemFields(item.showModal);
                        }}>
                        <Text style={{fontFamily: 'Poppins-SemiBold'}}>
                          {item.text}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
            />
          </View>
        </View>
      ) : null}

      <View
        style={{
          height: '7%',
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <FlatList
          data={tabs.slice(0, itemsToShow)}
          horizontal
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ListFooterComponent={
            tabs.length > itemsToShow && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#00BBF2',
                  marginRight: 10,
                  borderRadius: 5,
                }}
                onPress={loadMore}>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: '#fff',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Load More
                </Text>
              </TouchableOpacity>
            )
          }
        />
      </View>
      <View style={{flex: 1}}>
        {tabs.map((val) => {
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
      {visible === true && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(100, 100, 100, 0.3)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              width: '80%',
              alignSelf: 'center',
              backgroundColor: '#fff',
              shadowColor: '#000',
              borderRadius: 5,
              paddingHorizontal: 10,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            {newArr.map((val, index) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    marginTop: 10,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#9a9a9c',
                    paddingBottom: 5,
                  }}>
                  <View style={{width: '50%'}}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {val?.label} :
                    </Text>
                  </View>
                  <View style={{width: '50%'}}>
                    <Text
                      style={{
                        color: val?.value ? '#000' : '#9a9a9c',
                        fontFamily: 'Poppins-Regular',
                      }}>
                      {val?.value ? val?.value : 'No detail'}
                    </Text>
                  </View>
                </View>
              );
            })}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  // alignSelf: 'flex-end',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // marginVertical: 10,
                  marginTop: 20,
                  marginBottom: 10,
                  // backgroundColor: '#EE4B2B',
                  borderColor: '#EE4B2B',
                  borderWidth: 2.5,
                  borderRadius: 5,
                  marginRight: 10,
                }}
                onPress={() => setVisible(false)}>
                <Text
                  style={{
                    paddingVertical: 3,
                    color: '#EE4B2B',
                    fontWeight: 'bold',
                    paddingHorizontal: 20,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  // alignSelf: 'flex-end',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // marginVertical: 10,
                  marginTop: 20,
                  marginBottom: 10,
                  // backgroundColor: '#75C2F6',
                  borderColor: '#75C2F6',
                  borderWidth: 2.5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setVisible(false), ongenericFunction(state.fun, state.value);
                }}>
                <Text
                  style={{
                    paddingVertical: 3,
                    color: '#75C2F6',
                    fontWeight: 'bold',
                    paddingHorizontal: 20,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',

    backgroundColor: 'white',
  },
});
