import React, {useState} from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {isLightColor} from './TextColor';
import {
  DRAWER_BORDER_COLOR,
  generalBgColor,
  headerIconColor,
} from '../../variables/themeColors';
import {bottomStyles} from './bottomSheetContainer';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

const TypeList = ({data, visible, onClose, onItemPress, activitytype}) => {
  const [searchText, setSearchText] = useState('');

  const filteredData = data
    .map((section) => ({
      ...section,
      data: section.data.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase()),
      ),
    }))
    .filter((section) => section.data.length > 0);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={bottomStyles.bottomSheetContainer}>
        {/* Cancel */}

        <TouchableOpacity style={styles.cancelContainer} onPress={onClose}>
          <Text style={bottomStyles.headertxt}>Cancel</Text>
        </TouchableOpacity>

        {/* Search Bar */}
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
            onChangeText={setSearchText}
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            returnKeyType="done"
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
          style={[
            bottomStyles.sectionListContainer,
            {
              backgroundColor: generalBgColor,
              borderRadius: 5,
            },
          ]}
          showsVerticalScrollIndicator={false}
          sections={filteredData}
          keyExtractor={(item, index) => item.value + index}
          renderSectionHeader={({section: {title}}) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          renderItem={({item, index, section}) => {
            const bgColor = item?.color ? item?.color : '#FFFFFF';
            const textColor = isLightColor?.(bgColor) ? 'black' : 'white';
            return (
              <TouchableOpacity
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: bgColor,
                    // borderTopRightRadius: index === 0 ? 5 : 0,
                    // borderTopLeftRadius: index === 0 ? 5 : 0,
                    // borderBottomRightRadius:
                    //   data[0].data?.length - 1 === index ? 5 : 0,
                    // borderBottomLeftRadius:
                    //   data[0].data?.length - 1 === index ? 5 : 0,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  onItemPress(item, section);
                  setSearchText('');
                }}>
                <Text style={{color: textColor}}>{item.label}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000077',
  },
  cancelContainer: {
    paddingBottom: 16,
    // borderBottomWidth: 0.5,
    // borderBottomColor: '#d3d2d8',
  },
  cancelText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: headerIconColor,
  },

  sectionHeader: {
    backgroundColor: '#B3BDCA',
    padding: 8,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 10,
    // borderBottomColor: '#e0e0e0',
    // borderBottomWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dfdfdf',
  },
});

export default TypeList;
