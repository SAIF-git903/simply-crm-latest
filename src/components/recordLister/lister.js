import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ActivityIndicator,
  Text,
  Touchable,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import SearchBox from '../common/searchBox';
import {commonStyles, fontStyles} from '../../styles/common';
import {
  fetchRecord,
  viewRecordAction,
  refreshRecord,
  getNextPageRecord,
} from '../../actions';
import {recordListRendererHelper} from '../../helper';
import {API_fetchFilters} from '../../helper/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOGINDETAILSKEY, URLDETAILSKEY} from '../../variables/strings';

class Lister extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      //label when search is active
      searchLabel: null,
      sortBy: 'asc',
      //progressbars
      searching: false, //onSearch
      loading: false, //onGetRecords and onRefresh
      isFlatListRefreshing: false, //onGetNextPage
      visibleFilter: false,
      nextPage: false, //is the next page of the list of records available

      //request params
      data: [], //current records on page
      pageToTake: 1, //current page
      searchText: '', //text for search

      selectedIndex: -1,
      statusText: '',
      statusTextColor: '#000000',
      // navigation: this.props.navigation
      filters: [],
      visible: false,
    };
  }

  componentDidMount() {
    this.getFilters();
    this.getRecords();
  }

  getFilters = async () => {
    try {
      const URLDetails = JSON.parse(await AsyncStorage.getItem(URLDETAILSKEY));
      let url = URLDetails.url;
      let trimmedUrl = url.replace(/ /g, '').replace(/\/$/, '');
      trimmedUrl =
        trimmedUrl.indexOf('://') === -1 ? 'https://' + trimmedUrl : trimmedUrl;
      if (url.includes('www.')) {
        trimmedUrl = trimmedUrl.replace('www.', '');
      }
      if (url.includes('http://')) {
        trimmedUrl = trimmedUrl.replace('http://', 'https://');
      }

      let res = await API_fetchFilters(trimmedUrl, this.props.moduleName);
      let allfilters = res?.result;
      this.setState({filters: allfilters});
    } catch (error) {
      console.log('err', error);
    }
  };

  UNSAFE_componentWillReceiveProps(newprops) {
    this.setState(
      {
        loading: true,
        searching: false,
        searchLabel: null,
      },
      () => {
        this.props = newprops;
        if (this.props.saved !== 'not_saved') {
          this.getRecords();
        }
      },
    );
  }

  onRecordSelect(id, index) {
    this.setState(
      {
        selectedIndex: index,
      },
      () => {
        this.props.dispatch(viewRecordAction(id, this));
      },
    );
  }

  sortByName = (sortKey) => {
    const sortedData = [...this.state.data].sort((a, b) =>
      a[sortKey].localeCompare(b[sortKey]),
    );
    this.setState({data: sortedData});
  };

  onEndReached() {
    if (!this.onEndReachedCalledDuringMomentum) {
      if (this.state.nextPage) {
        this.setState(
          {
            pageToTake: this.state.pageToTake + 1,
          },
          () => {
            this.props.dispatch(getNextPageRecord(this, this.props.moduleName));
          },
        );
      }
    }
  }
  renderFilteredList = (filterType) => {
    const items = this.state.filters.filters[filterType] || [];

    return (
      <FlatList
        data={items}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => this.setState({visibleFilter: false})}>
            <Text style={{paddingVertical: 10, paddingHorizontal: 10}}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  };

  // onAddButtonPress() {
  //     const { navigate } = this.props.navigation;
  //     navigate('AddRecordScreen');
  // }

  getRecords() {
    this.setState(
      {
        searchLabel: null,
        searching: false,
        loading: true,
        isFlatListRefreshing: false,
        nextPage: false,
        data: [],
        pageToTake: 1,
        searchText: '',
        selectedIndex: -1,
        statusText: 'Fetching Record',
        statusTextColor: '#000000',
      },
      () => {
        this.props.dispatch(fetchRecord(this, this.props.moduleName));
        if (this.props.saved === 'saved') {
          this.refreshData();
        }
      },
    );
  }

  refreshData() {
    this.setState(
      {
        searchLabel: null,
        searching: false,
        loading: false,
        isFlatListRefreshing: true,
        nextPage: false,
        // data: [],
        pageToTake: 1,
        selectedIndex: -1,
        statusText: 'Refreshing',
        statusTextColor: '#000000',
      },
      () => {
        this.props.dispatch(refreshRecord(this, this.props.moduleName));
      },
    );
  }

  doSearch(searchText) {
    this.setState(
      {
        searchLabel: null,
        searching: true,
        loading: false,
        isFlatListRefreshing: false,
        nextPage: false,
        // data: [],
        pageToTake: 1,
        selectedIndex: -1,
        statusText: 'Searching .....',
        statusTextColor: '#000000',
      },
      () => {
        this.props.dispatch(fetchRecord(this, this.props.moduleName));
      },
    );
  }

  doRender() {
    let view;
    if (this.state.loading) {
      view = (
        <View
          style={{
            width: '100%',
            height: 50,
            alignItems: 'center',
            marginTop: 20,
          }}>
          <ActivityIndicator color={'#000000'} />
        </View>
      );
    } else {
      view = (
        <View style={{flex: 1}}>
          <View
            style={{
              padding: 15,
              paddingBottom: 5,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 40,
            }}>
            <SearchBox
              searchText={this.state.searchText}
              disabled={this.state.searching}
              moduleName={this.props.moduleName}
              onChangeText={(searchText) =>
                this.setState({searchText: searchText})
              }
              doSearch={(searchText) => this.doSearch(searchText)}
            />
          </View>
          {this.props.moduleName === 'Contacts' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '100%',
                marginTop: 10,
              }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingHorizontal: 10,
                  paddingVertical: 5,
                  width: '45%',
                }}
                onPress={() => {
                  this.setState({visible: false});
                  if (this.state.visibleFilter === false) {
                    this.setState({visibleFilter: true});
                  } else {
                    this.setState({visibleFilter: false});
                  }
                }}>
                <Text>My filter</Text>
                <EvilIcons name="chevron-down" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({visibleFilter: false});
                  if (this.state.visible === false) {
                    this.setState({visible: true});
                  } else {
                    this.setState({visible: false});
                  }
                }}
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingHorizontal: 10,
                  paddingVertical: 5,
                  width: '45%',
                }}>
                <Text>Sorted by name</Text>
                <EvilIcons name="chevron-down" size={20} />
              </TouchableOpacity>
            </View>
          )}
          {this.state.visible === true && (
            <View
              style={{
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                paddingHorizontal: 10,
                top: 105,
                zIndex: 1,
                right: 10,
                borderRadius: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                width: '45%',
              }}>
              <TouchableOpacity
                style={{marginTop: 10}}
                onPress={() => {
                  this.sortByName('firstname'), this.setState({visible: false});
                }}>
                <Text>First Name</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: 10}}
                onPress={() => {
                  this.sortByName('lastname'), this.setState({visible: false});
                }}>
                <Text>Last Name</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginVertical: 10}}
                onPress={() => this.setState({visible: false})}>
                <Text>Organization Name</Text>
              </TouchableOpacity>
            </View>
          )}
          {this.state.visibleFilter === true && (
            // <FlatList
            //   data={this.state.filters}
            //   renderItem={this.renderFiltersItem}
            // />
            <View
              style={{
                backgroundColor: '#fff',
                position: 'absolute',
                top: 105,
                zIndex: 1,
                left: 10,
                borderRadius: 5,
                width: '45%',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}>
              {Object.keys(this.state.filters.filters).map((filterType) => (
                <View key={filterType}>
                  <View style={{backgroundColor: '#eeeeee'}}>
                    <Text
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        fontWeight: '700',
                        fontSize: 16,
                      }}>
                      {filterType}
                    </Text>
                  </View>
                  {this.renderFilteredList(filterType)}
                </View>
              ))}
            </View>
          )}
          <View style={{flex: 1}}>{this.renderSearching()}</View>
        </View>
      );
    }
    return view;
  }

  renderFooter() {
    if (this.state.nextPage) {
      return (
        <View
          style={{
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: 50,
            flexDirection: 'row',
          }}>
          <Text>Getting next page</Text>
          <ActivityIndicator />
        </View>
      );
    }
  }

  renderSearching() {
    let view;
    if (this.state.searching) {
      view = (
        <View
          style={{
            width: '100%',
            height: 50,
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text
            style={[fontStyles.fieldLabel, {paddingBottom: 10, fontSize: 14}]}>
            Searching...
          </Text>
          <ActivityIndicator color={'#000000'} />
        </View>
      );
    } else {
      view = (
        <View style={{flex: 1}}>
          {this.renderSearchLabel()}
          {recordListRendererHelper(this)}
        </View>
      );
    }
    return view;
  }

  renderSearchLabel() {
    let view;
    if (this.state.searchLabel) {
      view = (
        <View style={{paddingTop: 10, alignItems: 'center'}}>
          <Text style={fontStyles.fieldLabel}>{this.state.searchLabel}</Text>
          <Text
            onPress={() => this.getRecords()}
            style={[
              fontStyles.fieldLabel,
              {fontSize: 14, paddingTop: 5, color: '#007aff'},
            ]}>
            Go Back
          </Text>
        </View>
      );
    } else {
      view = null;
    }
    return view;
  }

  render() {
    return (
      <View style={commonStyles.recordListerBackground}>{this.doRender()}</View>
    );
  }
}

const mapStateToProps = ({event, recordViewer, drawer}) => {
  const {isPortrait, width, height} = event;
  const {saved} = recordViewer;
  const {moduleId} = drawer;
  return {isPortrait, width, height, saved, moduleId};
};

export default connect(mapStateToProps, null, null, {forwardRef: true})(Lister);
