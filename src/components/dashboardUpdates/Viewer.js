import React, {Component} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {connect} from 'react-redux';
import {recordListRendererHelper} from '../../helper';
import {
  viewRecordAction,
  dashboardRefreshRecord,
  dashboardFetchRecord,
} from '../../actions';

class Viewer extends Component {
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
    };
  }

  UNSAFE_componentWillMount() {
    this.fetchRecord();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.props = newProps;
    this.fetchRecord();
  }

  onEndReached() {
    if (!this.onEndReachedCalledDuringMomentum) {
      if (this.state.nextPage) {
        //do nothing
      }
    }
  }

  onRecordSelect(id, index) {
    this.setState({
      selectedIndex: index,
    });
    this.props.viewRecordAction(id, index, this);
  }

  fetchRecord() {
    this.setState({
      loading: true,
      data: [],
      selectedIndex: -1,
      statusText: 'Fetching Record',
      statusTextColor: '#000000',
    });
    this.props.dashboardFetchRecord(this, this.props.moduleName);
  }

  refreshData() {
    this.setState({
      isFlatListRefreshing: true,
      selectedIndex: -1,
      statusText: 'Refreshing',
      statusTextColor: '#000000',
    });
    this.props.dashboardRefreshRecord(this, this.props.moduleName);
  }

  renderFooter() {
    if (this.state.nextPage) {
      //do render nothing
      return null;
    }
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
        <View style={{width: '100%'}}>
          {recordListRendererHelper(this, true)}
        </View>
      );
    }
    return view;
  }

  render() {
    return <View style={styles.subContainer}>{this.doRender()}</View>;
  }
}
const styles = {
  subContainer: {
    // justifyContent: 'flex-start',
    // flexDirection: 'row',
    // position: 'relative',
    //alignItems: 'center',
    flex: 1,
  },
};

const mapStateToProps = ({dashboardUpdate}) => {
  const {moduleName} = dashboardUpdate;
  return {moduleName};
};
export default connect(mapStateToProps, {
  dashboardFetchRecord,
  viewRecordAction,
  dashboardRefreshRecord,
})(Viewer);
