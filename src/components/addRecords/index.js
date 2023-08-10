import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Header from './header';
import Viewer from './viewer';
import {saveRecordHelper, copyAddress} from '../../helper';
import {CALENDAR} from '../../variables/constants';

class AddRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.route.params.id ? this.props.route.params.id : '',
      lister: this.props.route.params.lister,
      isDashboard: this.props.route.params.isDashboard
        ? this.props.route.params.isDashboard
        : false,
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    //TODO fixed unserialized values ??
    this.props.navigation.setOptions({
      id: this.state.recordId,
      lister: this.state.lister,
      isDashboard: this.state.isDashboard,
    });
  }

  callViewer(headerInstance) {
    headerInstance.setState(
      {
        loading: true,
      },
      () => {
        saveRecordHelper(
          this.viewer,
          headerInstance,
          this.props.dispatch,
          this.state.lister,
        );
      },
    );
  }

  showCopyOptions(headerInstance) {
    copyAddress(this.viewer, headerInstance);
  }

  render() {
    let moduleName;
    if (this.state.isDashboard) {
      moduleName = this.state.lister.props.moduleName;
    } else {
      moduleName = this.props.selectedButton;
    }
    if (moduleName === CALENDAR) {
      let ids = this.state.recordId.split('x');
      switch (parseInt(ids[0], 10)) {
        case 18:
          moduleName = 'Events';
          break;
        case 9:
        default:
          //no need to change, it works fine
          break;
      }
    }

    return (
      <View style={styles.backgroundStyle}>
        <Header
          recordId={this.state.recordId}
          navigation={this.props.navigation}
          moduleName={moduleName}
          moduleId={this.props.moduleId}
          moduleLable={this.props.moduleLable}
          callViewer={this.callViewer.bind(this)}
          showCopyOptions={this.showCopyOptions.bind(this)}
        />
        <View style={{width: '100%', height: '100%', paddingBottom: 100}}>
          <Viewer
            recordId={this.state.recordId}
            navigation={this.props.navigation}
            moduleName={moduleName}
            moduleId={this.props.moduleId}
            moduleLable={this.props.moduleLable}
            onRef={ref => (this.viewer = ref)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',
    flex: 1,
  },
});

const mapStateToProps = ({drawer}) => {
  const {selectedButton, moduleId, moduleLable} = drawer;
  return {selectedButton, moduleId, moduleLable};
};

export default connect(mapStateToProps)(AddRecords);
