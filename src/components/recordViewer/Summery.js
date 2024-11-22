import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Platform,
  UIManager,
  LayoutAnimation,
  Animated,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {API_fetchRecordWithGrouping, API_trackCall} from '../../helper/api';
import {fontStyles} from '../../styles/common';
import Icon from 'react-native-vector-icons/FontAwesome6';
import IconButton from '../IconButton';
import store from '../../store';
import {isLightColor} from '../common/TextColor';
import {
  generalBgColor,
  headerIconColor,
  textColor2,
  textColor as txtColor,
} from '../../variables/themeColors';
import {makePhoneCall, sendSMS} from '../common/Common';

// Enable layout animation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Summery = ({navigation, moduleName, recordId}) => {
  const {colorRuducer} = store.getState();

  const picklistColors = colorRuducer?.passedValue?.reduce((acc, item) => {
    if (item?.type?.picklistColors) {
      acc[item.name] = item?.type?.picklistColors;
    }
    return acc;
  }, {});
  const [data, setData] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      data?.map((varl) => {
        if (varl?.display_status === 'collapsed') toggleOpen(varl?.label);
      });
    }
  }, [data]);

  // Toggle function to open/close a specific item, only if display_status is 'open'
  const toggleOpen = (label) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenItems((prevState) => ({
      ...prevState,
      [label]: !prevState[label], // Toggle the state of the clicked item
    }));
  };
  const getData = async () => {
    try {
      setRefreshing(true);
      let res = await API_fetchRecordWithGrouping(moduleName, recordId);

      if (res?.result?.record) {
        setRefreshing(false);
        setData(res?.result?.record?.blocks);
      }
    } catch (error) {
      setRefreshing(false);
      console.log('err', error);
    }
  };

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    await getData(); // Re-fetch data
  };

  const onPressAction = (uiType, value, fieldName) => {
    switch (uiType) {
      case '11':
        Linking.openURL(`tel:${value}`).then(() => {
          API_trackCall(recordId);
        });
        break;

      case '13':
        Linking.openURL(`mailto:${value}`);
        break;

      case '17':
        let website = value;
        const isHttp = website.includes('http://');
        if (isHttp) {
          website = website.replace('http://', 'https://');
        }
        const isHttps = website.includes('https://');
        Linking.openURL(`${isHttps ? '' : 'https://'}${website}`);
        break;

      case '1':
        const query = value.replace(/ /g, '+');
        if (Platform.OS === 'ios') {
          //let encodedName = "address" + stringByAddingPercentEncodingWithAllowedCharacters(.URLQueryAllowedCharacterSet()) ?? "";
          Linking.openURL(`http://maps.apple.com/?q=${query}`);
        } else {
          Linking.openURL(`geo:0,0?q=${query}`);
        }
        break;
      case '21':
        const query1 = value.replace(/ /g, '+');
        if (Platform.OS === 'ios') {
          //let encodedName = "address" + stringByAddingPercentEncodingWithAllowedCharacters(.URLQueryAllowedCharacterSet()) ?? "";
          Linking.openURL(`http://maps.apple.com/?q=${query1}`);
        } else {
          Linking.openURL(`geo:0,0?q=${query1}`);
        }
        break;
      case '16':
        const q = value.replace(/ /g, '+');
        if (Platform.OS === 'ios') {
          //let encodedName = "address" + stringByAddingPercentEncodingWithAllowedCharacters(.URLQueryAllowedCharacterSet()) ?? "";
          Linking.openURL(`http://maps.apple.com/?q=${q}`);
        } else {
          Linking.openURL(`geo:0,0?q=${q}`);
        }
        break;

      default:
        break;
    }
    //process location field for Calendar/Event module
    // if (fieldName === 'location') {
    //   const query = value.replace(/ /g, '+');
    //   if (Platform.OS === 'ios') {
    //     //let encodedName = "address" + stringByAddingPercentEncodingWithAllowedCharacters(.URLQueryAllowedCharacterSet()) ?? "";
    //     Linking.openURL(`http://maps.apple.com/?q=${query}`);
    //   } else {
    //     Linking.openURL(`geo:0,0?q=${query}`);
    //   }
    // }
  };

  // Function to render field values safely
  const renderFieldValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      // If it's an object, render a specific property or convert it to a string
      return value?.name || value?.label;
    }
    return value; // Otherwise, just render the value as is
  };

  const getBackgroundColor = (fieldName, fieldValue) => {
    const colors = picklistColors?.[fieldName];
    if (colors && fieldValue) {
      return colors[fieldValue] || ''; // Default to white if color is not found
    }
    return ''; // Default to white if no colors available
  };

  const ListItem = ({item, isOpen, toggleOpen}) => {
    let arrowIcon = isOpen ? 'angle-right' : 'angle-down';
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleOpen}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
          }}>
          <Text
            style={[
              fontStyles.sectionTitle,
              ,
              {
                // fontWeight: 'bold',
                marginVertical: 10,
                // color: item?.display_status === 'open' ? '#707070' : 'gray',
                color: txtColor,
              },
            ]}>
            {item.translatedLabel}
          </Text>
          <Icon
            name={arrowIcon}
            size={16}
            // color={'#707070'}
            color={txtColor}
            style={{
              marginLeft: 20,
            }}
          />
        </TouchableOpacity>
        {isOpen || (
          <View
            style={{
              backgroundColor: '#fff',
              // backgroundColor: 'red',
              marginHorizontal: 3,
              // paddingHorizontal: 10,
              paddingVertical: 10,
            }}>
            {item?.fields?.map((field, index) => {
              const fieldValue = renderFieldValue(field?.value);
              const getBG = getBackgroundColor(field?.name, fieldValue);
              const textColor = isLightColor(getBG) ? 'black' : 'white';

              return (
                <View
                  key={index}
                  style={{
                    borderBottomWidth: 2,
                    // borderBottomColor: '#d3d2d8',
                    borderBottomColor: generalBgColor,
                    marginBottom: 10,
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    style={[
                      fontStyles.fieldLabel,
                      {
                        color: txtColor,
                        fontSize: 13,
                      },
                    ]}
                    numberOfLines={2}>
                    {field?.label}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {field?.uitype === '179' ? (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          onPressAction(
                            field?.uitype,
                            renderFieldValue(field?.value),
                            field?.name,
                          );
                        }}>
                        <Text
                          style={[
                            fontStyles.fieldValue,
                            {
                              paddingVertical: 10,

                              // color: color
                              //   ? textColor
                              // color: renderFieldValue(field?.value)
                              //   ? '#707070'
                              //   : '#707070',
                              color: renderFieldValue(field?.value)
                                ? textColor2
                                : textColor2,
                            },
                          ]}>
                          {renderFieldValue(field?.value)
                            ? showPassword === true
                              ? renderFieldValue(field?.value)
                              : '*'.repeat(
                                  renderFieldValue(field?.value?.length),
                                )
                            : ''}
                        </Text>
                      </TouchableOpacity>
                    ) : field?.uitype === '56' ? (
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderColor: '#ddd',
                          borderWidth: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginVertical: 10,
                        }}>
                        {field?.value === '1' && (
                          <Icon
                            name={'check'}
                            size={22}
                            color={headerIconColor}
                          />
                        )}
                      </View>
                    ) : field?.uitype === '164' ? (
                      field?.value ? (
                        <View
                          style={{
                            height: 100,
                            width: 100,
                          }}>
                          <Image
                            source={{uri: field?.value}}
                            style={{
                              height: '100%',
                              width: '100%',
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                      ) : (
                        <Text
                          style={[
                            fontStyles.fieldValue,
                            {color: textColor2, marginVertical: 10},
                          ]}>
                          {''}
                        </Text>
                      )
                    ) : field?.uitype === '69' ? (
                      <View
                        style={{
                          height: 50,
                          width: 50,
                        }}>
                        <Image
                          source={{uri: field?.value}}
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: getBackgroundColor(
                            field?.name,
                            renderFieldValue(field?.value),
                          ),
                          borderRadius: 5,
                          marginVertical: 10,
                        }}
                        activeOpacity={0.7}
                        onPress={() => {
                          onPressAction(
                            field?.uitype,
                            renderFieldValue(field?.value),
                            field?.name,
                          );
                        }}>
                        <Text
                          style={[
                            fontStyles.fieldValue,
                            {
                              paddingHorizontal: textColor && getBG ? 10 : 0,
                              // color: fieldValue
                              //   ? textColor && getBG
                              //     ? textColor
                              //     : '#707070'
                              //   : '#707070',
                              color: fieldValue
                                ? textColor && getBG
                                  ? textColor
                                  : textColor2
                                : textColor2,
                            },
                          ]}>
                          {renderFieldValue(field?.value)
                            ? renderFieldValue(field?.value)
                            : ''}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {field?.uitype === '179' && (
                      <View style={{paddingHorizontal: 20}}>
                        <IconButton
                          solid
                          color={headerIconColor}
                          icon={
                            showPassword ? 'eye-off-outline' : 'eye-outline'
                          }
                          size={25}
                          onPress={() => {
                            setShowPassword(!showPassword);
                          }}
                        />
                      </View>
                    )}
                    {field?.uitype === '13' && (
                      <View style={{paddingHorizontal: 20}}>
                        <IconButton
                          solid
                          color={headerIconColor}
                          icon={'mail-outline'}
                          size={25}
                          onPress={() => {
                            Linking.openURL(`mailto:${field?.value}`);
                          }}
                        />
                      </View>
                    )}
                    {field?.uitype === '11' && (
                      <View style={{flexDirection: 'row'}}>
                        <IconButton
                          solid
                          color={headerIconColor}
                          icon={'chatbox-outline'}
                          size={25}
                          onPress={() => {
                            sendSMS(field?.value, '');
                          }}
                        />
                        <View style={{paddingHorizontal: 20}}>
                          <IconButton
                            solid
                            color={headerIconColor}
                            icon={'call-outline'}
                            size={25}
                            onPress={() => {
                              makePhoneCall(field?.value);
                            }}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: generalBgColor}}>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // marginHorizontal: 5,
          // backgroundColor: '#000',
          marginTop: 20,
          // marginBottom: 100,
          paddingBottom: 50,
        }}
        keyExtractor={(item) => item?.label}
        renderItem={({item}) => (
          <ListItem
            item={item}
            isOpen={openItems[item?.label]} // Pass down whether the item is open
            toggleOpen={() => toggleOpen(item?.label)} // Function to toggle the open state
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Pull-to-refresh handler
            tintColor={'#707070'}
          />
        }
      />
    </View>
  );
};

export default Summery;
