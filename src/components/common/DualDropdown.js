// components/DualDropdown.js
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';

const DualDropdown = ({onTypesPress, onUsersPress}) => {
  return (
    <View
      style={{
        position: 'absolute',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        bottom: Dimensions.get('screen').height * 0.01,
      }}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnDropDown}
          onPress={onTypesPress}>
          <Text style={styles.txt}>Types</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnDropDown}
          onPress={onUsersPress}>
          <Text style={styles.txt}>Users</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DualDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnDropDown: {
    backgroundColor: '#b3bdca',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  txt: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
