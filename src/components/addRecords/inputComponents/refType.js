import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  FlatList,
} from 'react-native';
import {commonStyles, fontStyles} from '../../../styles/common';
import {LOGINDETAILSKEY} from '../../../variables/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_listModuleRecords} from '../../../helper/api';
import {headerIconColor} from '../../../variables/themeColors';
import IconButton from '../../IconButton';
import store from '../../../store';

class RefType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      referenceValue: '',
      searchText: '',
      refTo:
        this.props?.obj?.type?.refersTo?.length > 0
          ? this.props?.obj?.type?.refersTo[0]
          : undefined,
      recordData: [],
      nameFields: [],
      referenceValue: '',
      saveValue: '',
      fieldName: this.props.obj.name,
    };
  }

  componentDidMount() {
    this.getDetails();
  }
  getDetails = async () => {
    try {
      let res;
      if (this.props?.obj?.name === 'assigned_user_id') {
        res = await API_listModuleRecords('Users');
      } else {
        res = await API_listModuleRecords(this.state.refTo, 1, 25);
      }
      console.log('res', res);
      if (res?.result?.records) {
        this.setState({recordData: res?.result?.records});
        this.setState({nameFields: res?.result?.nameFields});
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    return (
      <View style={commonStyles.inputHolder}>
        <View style={{paddingBottom: 10}}>{this.props.fieldLabelView}</View>
        <TouchableOpacity
          onPress={() => {
            this.setState({visible: true});
          }}>
          <View style={commonStyles.textbox}>
            <Text
              numberOfLines={1}
              style={[commonStyles.text, fontStyles.fieldValue]}>
              {this.state.referenceValue}
            </Text>
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible}
          // visible={true}
          onRequestClose={() => this.setState({visible: false})}>
          <View
            activeOpacity={1}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{flex: 0.1}}
              onPress={() => {
                this.setState({visible: false});
              }}>
              <Text></Text>
            </TouchableOpacity>
            <View
              style={{
                overflow: 'hidden',
                backgroundColor: '#fff',
                width: '100%',
                flex: 0.9,
                alignSelf: 'center',

                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
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
                  paddingHorizontal: 20,
                  marginTop: 20,
                  marginBottom: 10,
                  paddingBottom: 15,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#d3d2d8',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({visible: false});
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 16,
                      color: headerIconColor,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  // width: '90%',
                  marginHorizontal: 15,
                  backgroundColor: '#FFF',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: '#dfdfdf',
                }}>
                <IconButton icon={'search'} color={'#707070'} size={25} />
                <TextInput
                  autoGrow={true}
                  autoCorrect={false}
                  spellCheck={false}
                  underlineColorAndroid={'transparent'}
                  style={[
                    fontStyles.searchBoxLabel,
                    {
                      paddingLeft: 10,
                      width: '88%',
                    },
                  ]}
                  placeholder="Search"
                  placeholderTextColor="#707070"
                  ref="searchbox"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onChangeText={(text) => {
                    this.setState({searchText: text});
                  }}
                />
              </View>

              <FlatList
                contentContainerStyle={{
                  flexGrow: 1,
                  marginHorizontal: 15,
                  marginTop: 10,
                }}
                showsVerticalScrollIndicator={false}
                data={this.state.recordData}
                renderItem={({item}) => {
                  let recordName;
                  const fields = this.state.nameFields;
                  let result = {};

                  fields.forEach((fieldName) => {
                    if (item?.hasOwnProperty(fieldName)) {
                      result[fieldName] = item[fieldName];
                    }
                  });

                  switch (this.state.refTo) {
                    case 'Timesheets':
                      recordName = Object.values(result);
                      break;
                    case 'Contacts':
                      recordName = Object.values(result).join(' ');
                      break;
                    default:
                      recordName = Object.values(result);
                      break;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          saveValue: item?.id,
                          referenceValue: recordName,
                          visible: false,
                        });
                      }}
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: '#fff',
                        paddingVertical: 15,
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#d3d2d8',
                      }}>
                      <Text style={[commonStyles.text, fontStyles.fieldValue]}>
                        {recordName}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default RefType;
