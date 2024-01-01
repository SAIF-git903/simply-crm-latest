import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, ActivityIndicator, Text, TextInput} from 'react-native';
import {commonStyles, fontStyles} from '../../../styles/common';
import {
  fetchRefRecord,
  refreshRefRecord,
  getNextRefPageRecord,
  markReferenceLabel,
  fetchRecord,
} from '../../../actions';
import {recordListRendererHelper} from '../../../helper';
import Lister from '../../recordLister/lister';
import SearchBox from '../../common/searchBox';

class ReferenceLister extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      loading: false,
      isFlatListRefreshing: false,
      data: [],
      selectedIndex: -1,
      nextPage: false,
      pageToTake: 1,
      statusText: '',
      statusTextColor: '#000000',
      searchText: '',
    };
  }

  UNSAFE_componentWillMount() {
    this.getRecords();
  }

  onRecordSelect(id, lable, index) {
    this.setState(
      {
        selectedIndex: index,
      },
      () => {
        this.props.navigation.goBack();
        this.props.dispatch(markReferenceLabel(id, lable, this.props.uniqueId));
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
            this.props.dispatch(
              getNextRefPageRecord(this, this.props.moduleName),
            );
          },
        );
      }
    }
  }

  doSearch(searchText) {
    if (this.props.moduleName === 'Users') {
      if (searchText) {
        const filteredData = this.state.data.filter((item) =>
          item.user_name.toLowerCase().includes(searchText.toLowerCase()),
        );
        this.setState({data: filteredData, searchLabel: searchText});
      }
    } else {
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
  }

  getRecords() {
    this.setState(
      {
        loading: true,
        isFlatListRefreshing: false,
        nextPage: false,
        data: [],
        pageToTake: 1,
        searchLabel: null,
        selectedIndex: -1,
        statusText: 'Fetching Record',
        statusTextColor: '#000000',
      },
      () => {
        this.props.dispatch(fetchRefRecord(this, this.props.moduleName));
      },
    );
  }

  refreshData() {
    this.setState(
      {
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
        this.props.dispatch(refreshRefRecord(this, this.props.moduleName));
      },
    );
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
          {recordListRendererHelper(this, false, true)}
        </View>
      );
    }
    return view;
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
            paddingTop: 10,
          }}>
          <ActivityIndicator color={'#000000'} />
        </View>
      );
    } else {
      view = (
        <View style={{flex: 1, width: '100%'}}>
          <View style={{marginHorizontal: 10, marginTop: 10}}>
            <SearchBox
              searchText={this.state.searchText}
              moduleName={this.props.moduleName}
              onChangeText={(searchText) =>
                this.setState({searchText: searchText})
              }
              doSearch={(searchText) => this.doSearch(searchText)}
            />
          </View>
          <View style={{flex: 1}}>{this.renderSearching()}</View>
        </View>
      );
    }
    return view;
  }

  render() {
    return (
      <>
        <View
          style={[
            commonStyles.recordListerBackground,
            // {backgroundColor: 'red'},
          ]}>
          {this.doRender()}
        </View>
      </>
    );
  }
}

const mapStateToProps = ({event}) => {
  const {isPortrait, width, height} = event;
  return {isPortrait, width, height};
};

export default connect(mapStateToProps)(ReferenceLister);
