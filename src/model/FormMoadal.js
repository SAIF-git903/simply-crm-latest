import {View, Text, Modal, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import AddRecords from '../components/addRecords';
const {height, width} = Dimensions.get('window');

const FormMoadal = ({timeSheetModal, onPress, component}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={timeSheetModal}
      onRequestClose={onPress}>
      <View
        activeOpacity={1}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity style={{flex: 0.1}} onPress={onPress}>
          <Text></Text>
        </TouchableOpacity>
        <View
          style={{
            overflow: 'hidden',
            width: '100%',
            flex: 0.9,
            // height: '90%',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            // borderRadius: 30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          {/* <View style={{position: 'absolute', zIndex: 1, top: 13}}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={onPress}>
                <View
                  style={{
                    height: 5,
                    width: 50,
                    borderRadius: 10,
                    backgroundColor: '#000',
                  }}
                />
              </TouchableOpacity>
            </View> */}
          {component}
        </View>
      </View>
    </Modal>
  );
};

export default FormMoadal;
