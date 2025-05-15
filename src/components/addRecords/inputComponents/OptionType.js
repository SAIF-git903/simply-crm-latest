import React, {Component} from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {commonStyles, fontStyles} from '../../../styles/common';
import {isLightColor} from '../../common/TextColor';
import {generalBgColor, headerIconColor} from '../../../variables/themeColors';
import IconButton from '../../IconButton';

class OptionType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveValue: this.props.obj.default ? this.props.obj.default.trim() : null,
      fieldName: this.props.obj.name,
      visible: false,
      isColor: null,
      istextColor: null,
      searchText: '',
    };
  }

  newarray = () => {
    const picklistValues = this.props?.obj?.type?.picklistValues || [];
    const colorsType = this.props?.colorsType || {};
    return picklistValues.map((item) => ({
      ...item,
      color: colorsType[item?.value] || null,
    }));
  };

  closeSheet = () => {
    this.setState({visible: false, searchText: ''});
  };

  filteredOptions = () => {
    const search = this.state.searchText.toLowerCase();
    return this.newarray().filter((item) =>
      item.label?.toLowerCase().includes(search),
    );
  };

  render() {
    return (
      <View style={commonStyles.inputHolder}>
        <View style={{paddingBottom: 10}}>{this.props.fieldLabelView}</View>

        {/* Trigger Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.selectionButton,
            {
              backgroundColor:
                this.state?.isColor || 'rgba(100, 100, 100, 0.2)',
            },
          ]}
          onPress={() => this.setState({visible: true})}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
              paddingVertical: 5,
              color: this.state?.istextColor || '#000',
            }}>
            {this.state.saveValue || 'Select an option'}
          </Text>
        </TouchableOpacity>

        {/* Bottom Sheet Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible}
          onRequestClose={this.closeSheet}>
          <Pressable style={styles.backdrop} onPress={this.closeSheet} />
          <View style={styles.sheetContainer}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={{
                paddingBottom: 16,
                borderBottomWidth: 0.5,
                justifyContent: 'center',
                borderBottomColor: '#d3d2d8',
              }}
              onPress={this.closeSheet}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: headerIconColor,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>

            {/* Search Box */}
            <View
              style={{
                backgroundColor: '#FFF',
                alignItems: 'center',
                flexDirection: 'row',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#dfdfdf',
                marginTop: 12,
                marginBottom: 16,
                paddingHorizontal: 10,
              }}>
              <Ionicons
                name="search"
                size={20}
                color="#707070"
                style={{marginRight: 5}}
              />
              <TextInput
                style={[
                  fontStyles.searchBoxLabel,
                  {
                    flex: 1,
                    paddingLeft: 5,
                    paddingVertical: 8,
                  },
                ]}
                placeholder="Search"
                placeholderTextColor="#707070"
                value={this.state.searchText}
                autoCorrect={false}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                returnKeyType="done"
                onChangeText={(text) => this.setState({searchText: text})}
              />
              {this.state.searchText.length > 0 && (
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

            {/* Options List */}
            <ScrollView
              style={{height: Dimensions.get('screen').height * 0.72}}
              showsVerticalScrollIndicator={false}>
              {this.filteredOptions()?.map((item, index) => {
                const textColor = isLightColor(
                  item?.color ? item?.color : '#FFFFFF',
                )
                  ? 'black'
                  : 'white';
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.option,
                      {
                        backgroundColor: item?.color || 'rgba(100,100,100,0.2)',
                      },
                    ]}
                    onPress={() => {
                      this.setState({
                        visible: false,
                        saveValue: item?.value,
                        isColor: item?.color,
                        istextColor: textColor,
                        searchText: '',
                      });
                    }}>
                    <Text style={[styles.optionText, {color: textColor}]}>
                      {item?.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selectionButton: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginVertical: 4,
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});

export default OptionType;
