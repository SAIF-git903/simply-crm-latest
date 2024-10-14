import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import RenderHTML from 'react-native-render-html';
import SignatureScreen from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MultiSelect from 'react-native-multiple-select';
import DatePicker from 'react-native-date-picker';

import {headerIconColor} from '../variables/themeColors';
import {commonStyles, fontStyles} from '../styles/common';
import {API_structure} from '../helper/api';
import IconButton from '../components/IconButton';
import store from '../store';

const RecordModal = ({
  visible,
  newArr,
  onClose,
  onSave,
  inputValues,
  setInputValues,
  popupText,
  popupWindowText,
  moduleName,
}) => {
  const source = {
    html: `
 ${popupText}`,
  };
  const signatureRef = createRef();
  const {width} = useWindowDimensions();
  const {colorRuducer} = store.getState();
  // console.log('colorRuducer', colorRuducer);

  const [hasSigned, setHasSigned] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [pickListValue, setPickListValue] = useState({data: [], fieldname: ''});
  const [selectedValues, setSelectedValues] = useState();
  const [saveValue, setSaveValue] = useState();

  const imgWidth = '100%';
  const imgHeight = 256;

  const getData = async (fieldName) => {
    try {
      let res = await API_structure(moduleName);
      let getFields = res?.result?.structure?.flatMap((block) => block.fields);
      let filterData = getFields?.filter((val) => val?.name === fieldName);

      if (filterData) {
        if (fieldName === 'cf_multi_select') {
          let newItems = [];
          filterData[0]?.type?.picklistValues.map((item) => {
            newItems.push({
              id: item.value,
              name: item.label,
              // name: item.value
            });
          });
          console.log('newItems', newItems);
          setItems(newItems);
        } else {
          setPickListValue({
            data: filterData[0]?.type?.picklistValues,
            fieldname: fieldName,
          });
        }
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  const processFieldValue = (field) => {
    let fieldValue;

    if (typeof field?.value === 'object' && field?.value !== null) {
      // If the value is an object, we use the label or value inside it
      fieldValue = field?.value?.label || field?.value?.value;
    } else {
      // If the value is a string or empty, use it directly
      fieldValue = field?.value;
    }

    return fieldValue;
  };
  const handleSignature = (signature, fieldName) => {
    handleInputChange(fieldName, signature);
    setHasSigned(true);
  };
  const handleConfirm = () => {
    signatureRef.current.readSignature();
  };

  const handleClear = (e, fieldName) => {
    signatureRef.current.clearSignature();
    handleInputChange(fieldName, '');
    setHasSigned(false);
  };

  const handleCheckboxChange = (fieldName) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      // [fieldName]: !prevValues[fieldName], // Toggle the checkbox value
      [fieldName]: prevValues[fieldName] === '1' ? '0' : '1',
    }));
  };

  const handleDateConfirm = (date, fieldName) => {
    setDatePickerVisible(false);
    setSelectedDate(date);
    handleInputChange(fieldName, date.toISOString().split('T')[0]); // Store date in YYYY-MM-DD format
  };

  const handleInputChange = (label, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
  };

  const handleSelectedItemsChange = (field, selectedItems) => {
    setSelectedValues(selectedItems);
    handleInputChange(field, selectedItems.join(' |##| '));
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity style={{flex: 0.1}} onPress={onClose}>
            <Text></Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              flex: 0.9,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingHorizontal: 10,
              paddingBottom: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // paddingVertical: 10,
              }}
            />
            {/* <TouchableOpacity
            activeOpacity={0.7}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}
            onPress={onClose}>
            <View
              style={{
                height: 5,
                width: 50,
                borderRadius: 10,
                backgroundColor: '#000',
              }}
            />
          </TouchableOpacity> */}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                // paddingHorizontal: 20,
                alignSelf: 'center',
                width: '95%',
                marginTop: 20,
                paddingBottom: 15,
                borderBottomWidth: 0.5,
                // borderWidth: 1,
                borderBottomColor: '#d3d2d8',
              }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: '20%',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  // borderWidth: 1,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    textAlign: 'left',
                    color: headerIconColor,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <View
                style={
                  {
                    // borderWidth: 1
                  }
                }>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  {popupWindowText}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onSave}
                style={{
                  width: '20%',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  // borderWidth: 1,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    color: headerIconColor,
                    textAlign: 'right',
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              scrollEnabled={isScrollEnabled}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  // marginTop: 15,
                  marginVertical: 15,
                  marginLeft: 10,

                  // alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <RenderHTML source={source} contentWidth={width} />
              </View>
              {newArr.map((val, index) => {
                const fieldValue = processFieldValue(val);

                return (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: 10,
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      // marginTop: 10,
                      paddingBottom: 5,
                    }}>
                    <View>
                      <Text style={fontStyles.fieldLabel}>{val?.label} </Text>
                    </View>
                    {val?.uitype === '164' ? (
                      <View
                        style={[
                          commonStyles.inputHolder,
                          {
                            width: imgWidth,
                            height: fieldValue ? 400 : imgHeight,
                          },
                        ]}>
                        <View>
                          {fieldValue ? (
                            <Image
                              resizeMode={'contain'}
                              style={{width: 100, height: 100}}
                              source={{uri: fieldValue}}
                            />
                          ) : null}
                        </View>
                        <SignatureScreen
                          ref={signatureRef}
                          onOK={(signature) =>
                            handleSignature(signature, val?.name)
                          }
                          onBegin={() => setIsScrollEnabled(false)} // Disable scroll on signature interaction
                          onEnd={() => setIsScrollEnabled(true)} // Re-enable scroll when signature ends
                          backgroundColor="#f0f1f5"
                          penColor={headerIconColor}
                          webStyle={`
                          .m-signature-pad {box-shadow: none; border: none; } 
                          .m-signature-pad--body {border: none;}
                          .m-signature-pad--footer {display: none; margin: 0px;}
                          body,html {
                          width: ${imgWidth}px; height: ${imgHeight}px;}
                      `}
                        />

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Button
                            title="Clear"
                            onPress={(e) => handleClear(e, val?.name)}
                          />
                          <Button title="Confirm" onPress={handleConfirm} />
                        </View>

                        {/* Optionally display a message if a signature is made */}
                        {hasSigned && (
                          <View style={{marginTop: 10}}>
                            <Text style={{fontFamily: 'Poppins-SemiBold'}}>
                              Signature captured!
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : val?.uitype === '5' ? (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setDatePickerVisible(true);
                          }}>
                          <View style={commonStyles.textbox}>
                            <Text
                              style={[
                                commonStyles.text,
                                fontStyles.fieldValue,
                              ]}>
                              {inputValues[val?.name] ||
                                selectedDate.toISOString().split('T')[0]}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <DatePicker
                          // ref="dateDialog"
                          modal
                          open={datePickerVisible}
                          mode="date"
                          date={new Date()}
                          onConfirm={(date) =>
                            handleDateConfirm(date, val?.name)
                          }
                          onCancel={() => {
                            setDatePickerVisible(false);
                            // handleDateConfirm();
                          }}
                        />
                      </View>
                    ) : val?.uitype === '56' ? (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => handleCheckboxChange(val?.name)}>
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderColor: '#ddd',
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          {inputValues[val?.name] === '1' ? (
                            <Icon name="check" size={22} color="green" />
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    ) : val?.uitype === '15' || val?.uitype === '16' ? (
                      // <TouchableOpacity style={commonStyles.inputHolder}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={{
                          width: '100%',
                          backgroundColor: 'rgba(100, 100, 100, 0.2)',
                          borderRadius: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => getData(val?.name)}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: 18,
                            paddingVertical: 5,
                          }}>
                          {inputValues[val?.name]
                            ? inputValues[val?.name]
                            : 'Select an option'}
                        </Text>
                      </TouchableOpacity>
                    ) : val?.uitype === '33' ? (
                      <MultiSelect
                        fontFamily={'Poppins-Regular'}
                        altFontFamily={'Poppins-Regular'}
                        itemFontFamily={'Poppins-Regular'}
                        items={items}
                        uniqueKey="id"
                        onSelectedItemsChange={(selectedItems) =>
                          handleSelectedItemsChange(val?.name, selectedItems)
                        }
                        selectedItems={selectedValues}
                        selectText="Pick Items"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        onToggleList={() => {
                          getData(val?.name);
                        }}
                      />
                    ) : (
                      // </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: '#f0f1f5',
                          paddingLeft: 10,
                          borderRadius: 5,
                        }}>
                        <TextInput
                          placeholderTextColor={'#707070'}
                          defaultValue={inputValues[val?.name] || fieldValue}
                          style={[fontStyles.fieldValue, {height: 40}]}
                          onChangeText={(text) =>
                            handleInputChange(val?.name, text)
                          }
                          onFocus={() => setIsScrollEnabled(true)}
                        />
                        {/* <Text style={fontStyles.fieldValue}>
                      {fieldValue ? fieldValue : 'N/A'}
                    </Text> */}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
        {pickListValue?.data?.length > 0 && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={pickListValue?.data?.length > 0 ? true : false}>
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={{flex: 0.1}}
                onPress={() => {
                  setPickListValue({data: [], fieldname: ''});
                }}>
                <Text></Text>
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                  flex: 0.9,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  paddingHorizontal: 10,
                  paddingBottom: 10,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    // paddingVertical: 10,
                  }}
                />
                {/* <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                }}
                onPress={onClose}>
                <View
                  style={{
                    height: 5,
                    width: 50,
                    borderRadius: 10,
                    backgroundColor: '#000',
                  }}
                />
              </TouchableOpacity> */}
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    // paddingHorizontal: 20,
                    alignSelf: 'center',
                    width: '95%',
                    marginTop: 20,
                    paddingBottom: 15,
                    borderBottomWidth: 0.5,
                    // borderWidth: 1,
                    borderBottomColor: '#d3d2d8',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setPickListValue({data: [], fieldname: ''});
                    }}
                    style={{
                      width: '20%',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      // borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 16,
                        textAlign: 'left',
                        color: headerIconColor,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <View
                  style={{
                    marginHorizontal: 5,
                    backgroundColor: '#FFF',
                    alignItems: 'center',
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#dfdfdf',
                    marginVertical: 10,
                  }}>
                  {searchText ? (
                    <IconButton
                      icon={'search'}
                      color={'#707070'}
                      size={25}
                      // onPress={() => this.onSearchText()}
                    />
                  ) : (
                    <IconButton
                      icon={'arrow-back-circle-sharp'}
                      color={'#007aff'}
                      size={25}
                      // onPress={() => this.onSearchText()}
                    />
                  )}
                  <TextInput
                    autoGrow={true}
                    autoCorrect={false}
                    spellCheck={false}
                    underlineColorAndroid={'transparent'}
                    style={[
                      fontStyles.searchBoxLabel,
                      {
                        paddingLeft: 10,
                        width: '80%',
                      },
                    ]}
                    placeholder="Search"
                    placeholderTextColor="#707070"
                    defaultValue={searchText}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onChangeText={(text) => {
                      setSearchText(text);
                    }}
                  />
                </View> */}
                <FlatList
                  data={pickListValue?.data}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#fff',
                          paddingVertical: 10,
                          borderBottomWidth: 0.5,
                          borderBottomColor: '#d3d2d8',
                          paddingLeft: 15,
                        }}
                        onPress={() => {
                          handleInputChange(
                            pickListValue?.fieldname,
                            item?.value,
                          );
                          setPickListValue({
                            data: [],
                            fieldname: pickListValue?.fieldname,
                          });
                        }}>
                        <Text
                          style={{
                            color: '#000',
                            fontFamily: 'Poppins-Regular',
                            fontSize: 18,
                          }}>
                          {item?.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RecordModal;
