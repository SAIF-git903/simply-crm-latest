import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import React from 'react';
import {headerIconColor} from '../variables/themeColors';
import {fontStyles} from '../styles/common';

const DocumentDetailModal = ({
  data,
  docdetailModal,
  onClose,
  onSave,
  inputValues,
  setInputValues,
}) => {
  const handleInputChange = (label, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
  };

  return (
    <Modal animationType="slide" transparent={true} visible={docdetailModal}>
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
              }}
            />

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
            <ScrollView>
              {data?.map((val) => {
                return (
                  <View
                    style={{
                      marginHorizontal: 10,
                      marginTop: 10,
                    }}>
                    <Text style={fontStyles.fieldLabel}>{val?.label}</Text>
                    <View
                      style={{
                        backgroundColor: '#f0f1f5',
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}>
                      {val?.name === 'notecontent' ? (
                        <TextInput
                          placeholderTextColor={'#707070'}
                          multiline
                          style={[fontStyles.fieldValue, {height: 150}]}
                          onChangeText={(text) =>
                            handleInputChange(val?.name, text)
                          }
                        />
                      ) : (
                        <TextInput
                          defaultValue={inputValues[val?.name]}
                          placeholderTextColor={'#707070'}
                          style={[fontStyles.fieldValue, {height: 40}]}
                          onChangeText={(text) =>
                            handleInputChange(val?.name, text)
                          }
                        />
                      )}

                      {/* <Text style={fontStyles.fieldValue}>
                      {fieldValue ? fieldValue : 'N/A'}
                    </Text> */}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default DocumentDetailModal;
