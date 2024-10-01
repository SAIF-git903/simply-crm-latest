import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import React, {createRef, useState} from 'react';
import {commonStyles, fontStyles} from '../styles/common';
import SignatureScreen from 'react-native-signature-canvas';
import {headerIconColor} from '../variables/themeColors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const RecordModal = ({
  visible,
  newArr,
  onClose,
  onSave,
  inputValues,
  setInputValues,
}) => {
  const signatureRef = createRef();
  const [hasSigned, setHasSigned] = useState(false);
  const imgWidth = '100%';
  const imgHeight = 256;
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

  const handleInputChange = (label, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        contentContainerStyle={{flexGrow: 1}}>
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
                paddingHorizontal: 20,
                marginTop: 20,
                paddingBottom: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: '#d3d2d8',
              }}>
              <TouchableOpacity onPress={onClose}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    color: headerIconColor,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSave}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    color: headerIconColor,
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {newArr.map((val, index) => {
                const fieldValue = processFieldValue(val);

                return (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: 10,
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      marginTop: 10,
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
                    ) : (
                      <View
                        style={{
                          backgroundColor: '#f0f1f5',
                          paddingLeft: 10,
                          borderRadius: 5,
                        }}>
                        <TextInput
                          placeholderTextColor={'#707070'}
                          style={[fontStyles.fieldValue, {height: 40}]}
                          onChangeText={(text) =>
                            handleInputChange(val?.name, text)
                          }
                          placeholder={inputValues[val?.name] || fieldValue}
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
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default RecordModal;
