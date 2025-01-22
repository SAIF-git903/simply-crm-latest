import {
  View,
  Text,
  SectionList,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {API_comman} from '../../helper/api';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {headerIconColor, textColor} from '../../variables/themeColors';

const CommanView = ({
  tabId,
  lister,
  tabLabel,
  moduleName,
  recordId,
  navigation,
  onPress,
}) => {
  // console.log('tabId', tabId);
  // console.log('tabLabel', tabLabel);
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [Blocks, setBlocks] = useState();
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await API_comman(recordId, moduleName, tabLabel);

      let labelFields = res?.result?.records[0]?.labelFields;
      let blockResults = [];

      res?.result?.records.forEach((record) => {
        record?.blocks.forEach((block) => {
          let currentValues = {};

          block.fields.forEach((field) => {
            if (labelFields.includes(field.name)) {
              currentValues[field.name] = field.value;
            }
          });

          const allFieldsPresent =
            Object.keys(currentValues).length === labelFields.length;

          if (allFieldsPresent) {
            if (tabLabel === 'Documents') {
              blockResults.push({
                blockId: record.id,
                values: currentValues,
                blocks: record.blocks,
                downloadData: record.downloadData,
              });
            } else {
              blockResults.push({
                blockId: record.id,
                values: currentValues,
                blocks: record.blocks,
              });
            }
          }
        });
      });

      setData(blockResults);
      console.log('blockResults', blockResults);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('err', error);
    }
  };

  const setDataandModel = (blocks) => {
    setBlocks(blocks);
    setVisible(true);
  };

  // Helper function to extract the value from different structures
  const extractValue = (fieldVal) => {
    if (typeof fieldVal === 'string') {
      // If it's a string, use it as is
      return fieldVal;
    } else if (typeof fieldVal === 'object' && fieldVal.label !== undefined) {
      // If it's an object with a 'value' property, use that value
      return fieldVal.label;
    } else {
      // If none of the above, return a default value or handle as needed
      return 'N/A'; // You can adjust this based on your requirements
    }
  };

  return (
    <>
      {tabId === '9' ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => {
              navigation.navigate('Add Record', {
                submodule: 'Events',
                navigation: navigation,
                selectedButton: 'Events',
                tabLabel: 'Events',
                lister: lister,
              });
            }}>
            <Text
              style={{
                color: headerIconColor,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Add Event
            </Text>
            <View style={{marginLeft: 15}}>
              <FontAwesomeIcon
                icon={'plus'}
                size={20}
                color={headerIconColor}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => {
              navigation.navigate('Add Record', {
                submodule: 'Tasks',
                navigation: navigation,
                selectedButton: 'Calendar',
                tabLabel: 'Tasks',
                lister: lister,
              });
            }}>
            <Text
              style={{
                color: headerIconColor,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Add Task
            </Text>
            <View style={{marginLeft: 15}}>
              <FontAwesomeIcon
                icon={'plus'}
                size={20}
                color={headerIconColor}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
            marginHorizontal: 20,
            // borderWidth: 1,
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => {
            navigation.navigate('Add Record', {
              navigation: navigation,
              selectedButton: tabLabel,
              tabLabel: tabLabel,
              lister: lister,
            });
          }}>
          <Text
            style={{
              color: headerIconColor,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Add {tabLabel}
          </Text>
          <View style={{marginLeft: 15}}>
            <FontAwesomeIcon icon={'plus'} size={20} color={headerIconColor} />
          </View>
        </TouchableOpacity>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 20}}>
        {loading && (
          <View style={{marginTop: 15}}>
            <ActivityIndicator
              animating={loading}
              color={'#000'}
              size="large"
            />
          </View>
        )}
        {loading === false && (data?.length === 0 || data === undefined) && (
          <View style={{alignSelf: 'center', marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: '#707070',
                fontSize: 14,
              }}>
              No records found
            </Text>
          </View>
        )}
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          {tabLabel === 'Documents' ? (
            <View>
              {data?.map((val, ind) => {
                return (
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      borderRadius: 5,
                    }}>
                    <View
                      style={{
                        paddingVertical: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          paddingLeft: 15,
                        }}>
                        {Object.entries(val?.values).map(([key, value]) => (
                          <View key={key}>
                            <Text
                              style={{
                                fontFamily: 'Poppins-Medium',
                                color: '#000',
                                fontSize: 16,
                              }}>
                              {value.length > 22
                                ? `${value.substring(0, 22)}...`
                                : value}
                            </Text>
                          </View>
                        ))}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginRight: 15,
                        }}>
                        {val?.downloadData[0]?.type?.includes('image/') && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={{marginHorizontal: 5}}
                            onPress={() => onPress(val.downloadData)}>
                            <EvilIcons name="image" size={30} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => setDataandModel(val?.blocks)}>
                          <EvilIcons name="eye" size={30} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        borderWidth: ind === data.length - 1 ? 0 : 0.5,
                        borderColor: '#707070',
                      }}
                    />
                  </View>
                );
              })}
            </View>
          ) : (
            <View>
              {data?.map((val, ind) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                    }}
                    onPress={() => {
                      setDataandModel(val?.blocks);
                    }}>
                    {/* Render values key-wise */}
                    <View
                      style={{
                        paddingVertical: 8,
                        paddingLeft: 15,
                      }}>
                      {Object.entries(val?.values).map(([key, value]) => (
                        <View key={key}>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Medium',
                              color: '#000',
                              fontSize: 16,
                            }}>
                            {value}
                          </Text>
                        </View>
                      ))}
                    </View>
                    {/* Render values key-wise on one line */}
                    {/* <View style={{marginLeft: 10, marginTop: 5}}>
                <Text>
                  {Object.entries(val.values)
                    .map(([key, value]) => `${value}`)
                    .join(', ')}
                </Text>
              </View> */}
                    <View
                      style={{
                        borderWidth: ind === data.length - 1 ? 0 : 0.5,
                        borderColor: '#707070',
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      {visible && (
        <>
          <View
            style={{
              //   marginTop: 10,
              position: 'absolute',
              backgroundColor: '#f2f2f2',
              height: '100%',
              width: '100%',
            }}>
            <ScrollView>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  // alignItems: 'flex-end',
                  // marginTop: 10,
                  // marginRight: 20,
                  right: 15,
                  top: 5,
                  zIndex: 1,
                  position: 'absolute',
                }}
                onPress={() => setVisible(false)}>
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={30}
                  color="#EE4B2B"
                />
              </TouchableOpacity>
              {Blocks?.map((val) => {
                return (
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: 15,
                    }}>
                    <View style={{marginVertical: 10}}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Medium',
                          color: '#707070',
                          fontSize: 18,
                        }}>
                        {val?.translatedLabel}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: '#707070',
                      }}
                    />
                    <View
                      style={{
                        backgroundColor: '#fff',
                        paddingHorizontal: 15,

                        // borderRadius: 5,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,

                        elevation: 3,
                      }}>
                      {val?.fields?.map((fieldVal) => {
                        let defaultVal = extractValue(fieldVal?.value);
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginVertical: 5,
                            }}>
                            <View style={{width: '45%'}}>
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: '#707070',
                                  fontSize: 14,
                                }}>
                                {fieldVal?.label}
                              </Text>
                            </View>
                            <View style={{marginVertical: 20}} />
                            <View style={{width: '45%'}}>
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: '#707070',
                                  fontSize: 14,
                                }}>
                                {defaultVal
                                  ? defaultVal
                                  : 'No detail available'}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
};

export default CommanView;
