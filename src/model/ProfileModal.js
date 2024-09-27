import {View, Text, Modal, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const ProfileModal = ({profileVisible, onPress, profileImage}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={profileVisible}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onPress}>
        <View style={{width: '90%', height: '90%'}}>
          <Image
            source={{uri: profileImage}}
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ProfileModal;
