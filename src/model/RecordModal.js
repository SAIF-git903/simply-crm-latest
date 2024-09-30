import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import {fontStyles} from '../styles/common';

const RecordModal = ({
  visible,
  newArr,
  onClose,
  onSave,
  inputValues,
  setInputValues,
}) => {
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
  const handleInputChange = (label, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '100%',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 10,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
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
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#EE4B2B',
                borderWidth: 2.5,
                borderRadius: 5,
                marginRight: 10,
              }}
              onPress={onClose}>
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
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#75C2F6',
                borderWidth: 2.5,
                borderRadius: 5,
              }}
              onPress={onSave}>
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
                    style={{
                      height: 100,
                      width: '100%',
                      backgroundColor: '#f0f1f5',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={{uri: val?.value}}
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                    />
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
        </View>
      </View>
    </Modal>
  );
};

export default RecordModal;
