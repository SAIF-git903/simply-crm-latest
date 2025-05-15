import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {filterSectionedData} from './Common';
import {
  DRAWER_BORDER_COLOR,
  generalBgColor,
  textColor2,
} from '../../variables/themeColors';
import {bottomStyles} from './bottomSheetContainer';

const UserList = ({
  visible,
  onClosePress,
  data,
  selectedIds = [],
  setSelectedIds,
  onDonePress,
  headerIconColor = '#333',
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState(data);

  // Toggle selection logic
  const toggleSelection = (item) => {
    const isAlreadySelected = selectedIds.some(
      (selected) => selected.id === item.id,
    );

    if (isAlreadySelected) {
      setSelectedIds((prev) =>
        prev.filter((selected) => selected.id !== item.id),
      );
    } else {
      setSelectedIds((prev) => [...prev, item]);
    }
  };

  // Filter logic
  useEffect(() => {
    if (searchText.trim()) {
      const filteredUserData = filterSectionedData(data, searchText);
      setFilterData(filteredUserData);
    } else {
      setFilterData(data); // Reset to original data when search is empty
    }
  }, [searchText, data]); // Include data in dependencies to handle prop changes

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClosePress}>
      {/* Backdrop */}
      <Pressable
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onPress={onClosePress}
      />

      {/* Bottom Sheet Container */}
      <View style={bottomStyles.bottomSheetContainer}>
        {/* Cancel / Close Button */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: '#d3d2d8',
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
            }}
            onPress={onClosePress}>
            <Text style={bottomStyles.headertxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
            }}
            onPress={() => {
              onDonePress(selectedIds);
            }}>
            <Text style={bottomStyles.headertxt}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Search Box */}
        <View style={bottomStyles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color="#707070"
            style={{marginRight: 5}}
          />
          <TextInput
            style={bottomStyles.serachBoxContainer}
            placeholder="Search"
            placeholderTextColor="#707070"
            value={searchText}
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            returnKeyType="done"
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color="#707070"
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Section List */}
        <SectionList
          sections={filterData}
          style={[
            bottomStyles.sectionListContainer,
            {
              borderWidth: 0.5,
            },
          ]}
          keyExtractor={(item, index) => item.id + index} // Use item.id for uniqueness
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            const isSelected = selectedIds.some(
              (selected) => selected.id === item.id,
            );
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  padding: 15,
                  borderBottomWidth: 0.5,
                  borderBottomColor: DRAWER_BORDER_COLOR,
                }}
                onPress={() => toggleSelection(item)}>
                <View
                  style={{
                    marginRight: 10,
                    borderRadius: 3,
                    height: 20,
                    borderWidth: 1,
                    width: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: textColor2,
                  }}>
                  {isSelected && (
                    <FontAwesome name="check" size={15} color={textColor2} />
                  )}
                </View>
                <Text style={{color: textColor2}}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={{padding: 16, alignItems: 'center'}}>
              <Text>No users found</Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

export default UserList;
