import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {commonStyles, fontStyles} from '../../../styles/common';
import {API_listModuleRecords} from '../../../helper/api';
import {generalBgColor, headerIconColor} from '../../../variables/themeColors';
import IconButton from '../../IconButton';

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
      referenceValue: this.props?.obj?.type?.picklistValues?.users[
        this.props?.obj?.default
      ]
        ? this.props?.obj?.type?.picklistValues?.users[this.props?.obj?.default]
        : '',
      saveValue: this.props?.obj?.default ? this.props?.obj?.default : '',
      fieldName: this.props.obj?.name,
      page: 1,
      limit: 25,
      isLoadingMore: false, // For handling pagination
      hasMoreData: true, // To track if there's more data to load
      searchText: '',
      isloading: false,
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
      } else if (this.props?.obj?.name === 'created_user_id') {
        res = await API_listModuleRecords('Users');
      } else {
        res = await API_listModuleRecords(
          this.state.refTo,
          this.state.page,
          this.state.limit,
          '',
          this.state.searchText,
        );
      }
      if (res?.result?.records) {
        this.setState({isloading: false});

        this.setState({
          recordData: res?.result?.records,
          nameFields: res?.result?.nameFields,
        });
      } else {
        this.setState({isloading: false});

        this.setState({
          recordData: [],
          nameFields: res?.result?.nameFields,
        });
      }
    } catch (error) {
      console.log('error', error);
      this.setState({isloading: false});
    }
  };

  handleLoadMore = async () => {
    if (this.state.isLoadingMore || !this.state.hasMoreData) {
      // If already loading or no more data, do nothing
      return;
    }

    this.setState({isLoadingMore: true});
    if (
      this.props?.obj?.name !== 'assigned_user_id' &&
      this.props?.obj?.name !== 'created_user_id'
    ) {
      try {
        const res = await API_listModuleRecords(
          this.state.refTo,
          this.state.page + 1, // Increment page for the next batch
          this.state.limit,
          this.state.searchText,
        );

        if (res?.result?.records?.length > 0) {
          // If new records are available, update the recordData and increment the page number
          this.setState((prevState) => ({
            recordData: [...prevState.recordData, ...res.result.records],
            page: prevState.page + 1,
          }));
        } else {
          // If no new records, set hasMoreData to false
          this.setState({hasMoreData: false});
        }
      } catch (error) {
        console.log('Error loading more data:', error);
      } finally {
        // Stop loading more data
        this.setState({isLoadingMore: false});
      }
    }
  };
  renderFooter = () => {
    if (!this.state.isLoadingMore) return null; // If not loading, no need to show the footer
    return (
      <View style={{paddingVertical: 20}}>
        {this.props?.obj?.name !== 'assigned_user_id' &&
          this.props?.obj?.name !== 'created_user_id' && (
            <ActivityIndicator size="small" color={headerIconColor} />
          )}
      </View>
    );
  };

  onSearchText = () => {
    this.setState({isloading: true});

    if (this.props?.obj?.name === 'assigned_user_id') {
      const filterData = this.state?.recordData?.filter(
        (val) =>
          val.first_name.includes(this.state.searchText) ||
          val.last_name.includes(this.state.searchText),
      );

      if (this.state.searchText) {
        this.setState({recordData: filterData});
      } else {
        this.getDetails();
      }

      setTimeout(() => {
        this.setState({isloading: false});
      }, 1000);
    } else {
      this.setState({
        page: 1,
        limit: 25,
      });
      this.getDetails();
    }
  };

  render() {
    return (
      <View style={[commonStyles.inputHolder]}>
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
                // backgroundColor: '#fff',
                backgroundColor: generalBgColor,
                width: '100%',
                flex: 0.9,
                alignSelf: 'center',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}>
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
                  marginHorizontal: 15,
                  backgroundColor: '#FFF',
                  alignItems: 'center',
                  flexDirection: 'row',
                  // justifyContent: 'space-between',
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: '#dfdfdf',
                }}>
                {this.state.searchText ? (
                  <IconButton
                    icon={'search'}
                    color={'#707070'}
                    size={25}
                    onPress={() => this.onSearchText()}
                  />
                ) : (
                  <IconButton
                    icon={'arrow-back-circle-sharp'}
                    color={'#007aff'}
                    size={25}
                    onPress={() => this.onSearchText()}
                  />
                )}
                <TextInput
                  autoGrow={true}
                  autoCorrect={false}
                  spellCheck={false}
                  underlineColorAndroid={'transparent'}
                  style={[
                    fontStyles.searchBoxLabel,
                    {
                      paddingLeft: 10,
                      width: '80%',
                    },
                  ]}
                  placeholder="Search"
                  placeholderTextColor="#707070"
                  ref="searchbox"
                  defaultValue={this.state.searchText}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onChangeText={(text) => {
                    this.setState({searchText: text});
                  }}
                />
                {this.state.searchText && (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        searchText: '',
                        isloading: true,
                      });
                      setTimeout(() => {
                        this.getDetails();
                      }, 1000);
                    }}>
                    <Ionicons name="close-circle" size={25} color={'#707070'} />
                  </TouchableOpacity>
                )}
              </View>

              {this.state.isloading ? (
                <View style={{paddingVertical: 20}}>
                  <ActivityIndicator size="small" color={headerIconColor} />
                </View>
              ) : this.state.recordData?.length > 0 ? (
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

                    recordName = Object.values(result)?.join(' ');

                    // switch (this.state.refTo) {
                    //   case 'Timesheets':
                    //     recordName = Object.values(result);
                    //     break;
                    //   case 'Contacts':
                    //     recordName = Object.values(result).join(' ');
                    //     break;
                    //   default:
                    //     recordName = Object.values(result);
                    //     break;
                    // }

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
                          paddingLeft: 15,
                        }}>
                        <Text
                          style={{
                            color: '#000',
                            fontFamily: 'Poppins-Regular',
                            fontSize: 18,
                          }}>
                          {recordName}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  onEndReached={this.handleLoadMore} // Pagination handler
                  onEndReachedThreshold={0.5} // Trigger when scrolled 50% to the end
                  ListFooterComponent={this.renderFooter}
                />
              ) : (
                <View
                  style={{
                    marginHorizontal: 15,
                    backgroundColor: '#fff',
                    marginTop: 10,
                    paddingVertical: 15,
                    paddingVertical: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={[commonStyles.text, fontStyles.fieldValue, {}]}>
                    No Records found.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default RefType;
