import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {commonStyles, fontStyles} from '../../../styles/common';
import {
  DRAWER_BORDER_COLOR,
  generalBgColor,
  headerIconColor,
  textColor,
  textColor2,
} from '../../../variables/themeColors';

class MutiTypeList extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);

    const initialValue =
      props?.obj?.currentValue !== undefined
        ? props?.obj?.currentValue
        : props?.obj?.default !== 'Empty' && props?.obj?.default;

    // Helper function to safely parse JSON or fallback to string
    const safeParse = (value) => {
      if (!value || value === 'Empty') return null;
      if (
        typeof value === 'string' &&
        (value.startsWith('[') || value.startsWith('{'))
      ) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value; // fallback if invalid JSON
        }
      }
      return value;
    };

    const parsedValue = safeParse(initialValue);

    this.state = {
      selectedValue: Array.isArray(parsedValue)
        ? parsedValue
        : parsedValue
        ? [
            {
              id: parsedValue,
              name: parsedValue,
            },
          ]
        : [],
      saveValue: Array.isArray(parsedValue)
        ? parsedValue
        : parsedValue
        ? [
            {
              id: parsedValue,
              name: parsedValue,
            },
          ]
        : [],
      fieldName: props?.obj?.name,
      visible: false,
      searchText: '',
    };
  }

  toggleSelection = (item) => {
    const {selectedValue} = this.state;
    const exists = selectedValue.some((val) => val?.id === item?.id);
    if (exists) {
      this.setState({
        selectedValue: selectedValue.filter((val) => val?.id !== item?.id),
      });
    } else {
      this.setState({
        selectedValue: [...selectedValue, item],
      });
    }
  };

  isSelected = (item) => {
    return this.state.selectedValue.some((val) => val?.id === item?.id);
  };

  getDisplayText = () => {
    const {saveValue} = this.state;
    if (!saveValue || saveValue?.length === 0) return 'Pick Items';
    return saveValue.map((i) => i.name).join(', ');
  };

  openSheet = () => {
    this.setState({
      visible: true,
      selectedValue: [...this.state.saveValue],
    });
  };

  closeSheet = () => {
    this.setState({visible: false, searchText: ''});
  };

  saveAndClose = () => {
    this.setState(
      {
        saveValue: [...this.state.selectedValue],
        visible: false,
        searchText: '',
      },
      () => {
        if (this.props.onValueChange) {
          const joinedValue = selectedValue.map((i) => i?.name).join(' |##| ');
          this.props.onValueChange(joinedValue);
        }
      },
    );
  };

  render() {
    const options = this.props.obj.type.picklistValues.map((item) => ({
      id: item.label,
      name: item.label,
    }));

    const filteredItems = options.filter((item) =>
      item.name.toLowerCase().includes(this.state.searchText.toLowerCase()),
    );

    return (
      <View style={commonStyles.inputHolder}>
        <View style={{paddingBottom: 10}}>{this.props.fieldLabelView}</View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.selectionButton}
          onPress={this.openSheet}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
              color: '#000',
            }}
            numberOfLines={1}>
            {this.getDisplayText()}
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible}
          onRequestClose={this.closeSheet}>
          <Pressable style={styles.backdrop} onPress={this.closeSheet} />
          <View style={styles.sheetContainer}>
            {/* Header with Cancel and Save */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 16,
                borderBottomWidth: 0.5,
                borderBottomColor: '#d3d2d8',
              }}>
              <TouchableOpacity onPress={this.closeSheet}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.saveAndClose}>
                <Text style={styles.cancelText}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* Search Box */}
            <View style={styles.searchBox}>
              <Ionicons
                name="search"
                size={20}
                color="#707070"
                style={{marginRight: 5}}
              />
              <TextInput
                style={[
                  fontStyles.searchBoxLabel,
                  {flex: 1, paddingLeft: 5, paddingVertical: 8},
                ]}
                placeholder="Search"
                placeholderTextColor="#707070"
                value={this.state.searchText}
                onChangeText={(text) => this.setState({searchText: text})}
              />
              {this.state.searchText?.length > 0 && (
                <TouchableOpacity
                  onPress={() => this.setState({searchText: ''})}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="#707070"
                    style={{marginLeft: 5}}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Option List */}
            <ScrollView
              style={{height: Dimensions.get('screen').height * 0.62}}
              showsVerticalScrollIndicator={false}>
              {filteredItems.map((item, index) => {
                const selected = this.isSelected(item);
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      padding: 15,
                      borderBottomWidth: 0.5,
                      borderBottomColor: DRAWER_BORDER_COLOR,
                      backgroundColor: '#FFF',
                      borderTopRightRadius: index === 0 ? 5 : 0,
                      borderTopLeftRadius: index === 0 ? 5 : 0,
                      borderBottomRightRadius:
                        filteredItems?.length - 1 === index ? 5 : 0,
                      borderBottomLeftRadius:
                        filteredItems?.length - 1 === index ? 5 : 0,
                    }}
                    onPress={() => this.toggleSelection(item)}>
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
                      {selected && (
                        <FontAwesome
                          name="check"
                          size={15}
                          color={textColor2}
                        />
                      )}
                    </View>
                    <Text style={{color: textColor2}}>{item?.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Clear All */}
            <View
              style={{
                height: Dimensions.get('screen').height * 0.1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.setState({selectedValue: []})}
                activeOpacity={0.7}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    color: textColor,
                    fontSize: 16,
                  }}>
                  Clear all
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default MutiTypeList;

const styles = StyleSheet.create({
  selectionButton: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: generalBgColor,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  cancelText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: headerIconColor,
  },
  searchBox: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#dfdfdf',
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
});
