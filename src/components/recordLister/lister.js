import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ActivityIndicator,
  Text,
  Touchable,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBox from '../common/searchBox';
import {commonStyles, fontStyles} from '../../styles/common';
import {
  fetchRecord,
  viewRecordAction,
  refreshRecord,
  getNextPageRecord,
  passValue,
  filterField,
} from '../../actions';
import {recordListRendererHelper} from '../../helper';
import {
  API_describe,
  API_fetchFilters,
  API_listModuleRecords,
  API_query,
} from '../../helper/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOGINDETAILSKEY, URLDETAILSKEY} from '../../variables/strings';
import store from '../../store';

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
      loadingFilter: false,
      moduleName: '',
      visible: false,
      fieldLabel: [],
      openFilters: {},
    };
  }

  componentDidMount() {
    // this.getFields();
    this.getFilters();
    this.getRecords();
    this.getColors();
  }

  getFields = async () => {
    try {
      let res = await AsyncStorage.getItem('fields');
      let newArray = JSON.parse(res);
      this.setState({fieldLabel: newArray});
    } catch (error) {
      console.log('err', error);
    }
  };

  getFilters = async (module) => {
    this.setState({loadingFilter: true});

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

      if (module) {
        this.setState({loadingFilter: true});
        let res = await API_fetchFilters(trimmedUrl, module);
        if (res?.success === true) {
          this.setState({loadingFilter: false});
          let allfilters = res?.result;
          this.setState({filters: allfilters});
        }
      } else {
        let res = await API_fetchFilters(trimmedUrl, this.props.moduleName);
        if (res?.success === true) {
          this.setState({loadingFilter: false});
          let allfilters = res?.result;
          this.setState({filters: allfilters});
        }
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  getColors = async () => {
    try {
      const res = await API_describe(this.props.moduleName);

      let fieldsWithPicklistColors = [];
      for (
        let index = 0;
        index < res?.result?.describe?.fields?.length;
        index++
      ) {
        const field = res?.result?.describe?.fields[index];
        if (field?.type?.picklistColors) {
          fieldsWithPicklistColors.push(field);
        }
      }
      this.props.dispatch(passValue(fieldsWithPicklistColors));
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
        this.props.dispatch(viewRecordAction(id, index, this));
      },
    );
  }

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
    if (!this.state.openFilters[filterType]) {
      return null; // Do not render the FlatList if it's not open
    }
    return (
      <View style={{height: 300}}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={items}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                store.dispatch(filterField(item?.id));
                this.setState({visibleFilter: false}), this.dofilter(item.id);
              }}>
              <Text
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  color: '#000',
                  fontFamily: 'Poppins-Regular',
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
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
        selectedFilter: '',
        selectedIndex: -1,
        statusText: 'Fetching Record',
        statusTextColor: '#000000',
      },
      () => {
        setInterval(() => {
          this.getFields();
        }, 1000);
        this.setState({visibleFilter: false});
        this.setState({visible: false});
        this.props.dispatch(fetchRecord(this, this.props.moduleName));
        if (this.props.saved === 'saved') {
          this.refreshData();
        }
        store.dispatch(filterField(null));
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

  dofilter = (selectedFilter) => {
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
        selectedFilter,
      },
      () => {
        this.props.dispatch(fetchRecord(this, this.props.moduleName));
      },
    );
  };

  sortByName = (orderBy) => {
    let sortOrder = 'asc';
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
        orderBy,
        sortOrder,
      },
      () => {
        this.props.dispatch(fetchRecord(this, this.props.moduleName));
      },
    );
  };

  toggleFilter = (filterType) => {
    this.setState((prevState) => {
      const newOpenFilters = {[filterType]: !prevState.openFilters[filterType]};

      // Close all other filters
      Object.keys(prevState.openFilters).forEach((key) => {
        if (key !== filterType) {
          newOpenFilters[key] = false;
        }
      });

      return {openFilters: newOpenFilters};
    });
  };

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
                  this.getFilters(this.props.moduleName);
                  this.setState({visibleFilter: true});
                } else {
                  this.setState({visibleFilter: false});
                }
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Poppins-Regular',
                }}>
                My filter
              </Text>
              <EvilIcons name="chevron-down" size={20} color={'#000'} />
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
              <Text style={{color: '#000', fontFamily: 'Poppins-Regular'}}>
                Sorted by
              </Text>
              <EvilIcons name="chevron-down" size={20} color={'#000'} />
            </TouchableOpacity>
          </View>

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
              <FlatList
                data={this.state.fieldLabel}
                showsVerticalScrollIndicator={false}
                style={{height: 300}}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        marginVertical: 10,
                        marginTop: index === 0 ? 10 : 0,
                      }}
                      onPress={() => {
                        this.sortByName(item.name),
                          this.setState({visible: false});
                      }}>
                      <Text
                        style={{
                          fontStyle: 'normal',
                          textTransform: 'capitalize',
                          fontWeight: '600',
                          fontFamily: 'Poppins-Regular',
                          color: '#000',
                        }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
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
              {this.state.loadingFilter === true ? (
                <ActivityIndicator
                  animating={this.state.loadingFilter}
                  style={{padding: 10}}
                />
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {Object.keys(this.state.filters.filters).map((filterType) => (
                    <View key={filterType}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.toggleFilter(filterType)}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#eeeeee',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 10,
                              fontWeight: '700',
                              fontFamily: 'Poppins-Regular',
                              fontSize: 16,
                              color: '#000',
                            }}>
                            {filterType}
                          </Text>
                          <Icon
                            name={
                              this.state.openFilters[filterType]
                                ? 'arrow-up'
                                : 'arrow-down'
                            } // Choose the correct icon names
                            size={20}
                            color="#000"
                            style={{marginRight: 10}}
                          />
                        </View>
                      </TouchableOpacity>
                      {this.renderFilteredList(filterType)}
                    </View>
                  ))}
                </ScrollView>
              )}
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
