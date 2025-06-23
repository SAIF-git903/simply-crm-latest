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
  textColor,
  textColor2,
} from '../../variables/themeColors';
import {bottomStyles} from './bottomSheetContainer';

const UserList = ({
  userID,
  setuserID,
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

  useEffect(() => {
    if (userID) {
      const allItems = data.flatMap((section) => section.data);
      const matchedUser = allItems.find((item) => item.id === userID);

      if (matchedUser) {
        setSelectedIds((prev) => {
          const alreadySelected = prev.some((u) => u.id === matchedUser.id);
          if (!alreadySelected) {
            return [...prev, matchedUser];
          }
          return prev;
        });
      }
    }
  }, []);

  // Toggle selection logic
  const toggleSelection = (item) => {
    const isAlreadySelected = selectedIds.some(
      (selected) => selected.id === item.id,
    );

    if (isAlreadySelected) {
      setSelectedIds((prev) =>
        prev.filter((selected) => selected.id !== item.id),
      );
      setuserID([]);
    } else {
      setSelectedIds((prev) => [...prev, item]);
    }
  };

  // Toggle between Clear All and Select All
  const toggleAll = () => {
    if (selectedIds.length > 0) {
      // Clear all
      setSelectedIds([]);
      setuserID([]);
    } else {
      // Select all
      const allItems = filterData.flatMap((section) => section.data);
      setSelectedIds(allItems);
    }
  };

  // Filter logic
  useEffect(() => {
    if (searchText.trim()) {
      const filteredUserData = filterSectionedData(data, searchText);
      setFilterData(filteredUserData);
    } else {
      setFilterData(data);
    }
  }, [searchText, data]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClosePress}>
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

      <View style={bottomStyles.bottomSheetContainer}>
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
            style={{justifyContent: 'center'}}
            onPress={onClosePress}>
            <Text style={bottomStyles.headertxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => onDonePress(selectedIds)}>
            <Text style={bottomStyles.headertxt}>Save</Text>
          </TouchableOpacity>
        </View>

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

        <SectionList
          sections={filterData}
          style={[
            bottomStyles.sectionListContainer,
            {
              borderWidth: 0.5,
              height: Dimensions.get('screen').height * 0.61,
            },
          ]}
          keyExtractor={(item, index) => item.id + index}
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
        <View
          style={{
            height: Dimensions.get('screen').height * 0.1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={toggleAll}
            activeOpacity={0.7}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: textColor,
                fontSize: 16,
              }}>
              {selectedIds.length > 0 ? 'Clear All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UserList;
