import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Header from './header';
import Viewer from './viewer';
import {saveRecordHelper, copyAddress} from '../../helper';
import {CALENDAR} from '../../variables/constants';
import timeSheetModalReducer from '../../reducers/TimeSheetReducer';
import {isTimeSheetModal} from '../../actions';
import {generalBgColor} from '../../variables/themeColors';
import store from '../../store';

class AddRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.route?.params?.id
        ? this.props.route?.params?.id
        : '',
      lister: this.props.route?.params?.lister
        ? this.props.route?.params?.lister
        : '',
      isDashboard: this.props.route?.params?.isDashboard
        ? this.props.route.params.isDashboard
        : false,
      parentRecord: this.props?.recordId,
      parentModuleName: this.props.moduleName,
      parentId: this.props?.route?.params?.parentId,
      // parentModuleName: this.props?.moduleData?.id,
      recordName: this.props?.recordName,
      currentId: this.props?.recordId,
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
          this.state.parentRecord,
          this.state.parentModuleName,
          this.state.parentId,
        );
      },
    );
  }

  showCopyOptions(headerInstance) {
    copyAddress(this.viewer, headerInstance);
  }

  render() {
    let moduleName;

    const {dashboardUpdate} = store.getState();

    if (this.props?.route?.params?.moduleFromCalender) {
      moduleName = this.props.route.params.moduleFromCalender;
    }

    if (!moduleName && this.props?.route?.params?.moduleName) {
      moduleName = this.props.route.params.moduleName;
    }

    if (!moduleName && this.props?.route?.params?.submodule) {
      moduleName = this.props.route.params.submodule;
    }

    if (!moduleName) {
      if (this.state.isDashboard) {
        moduleName = this.props?.route?.params?.selectedButton
          ? this.props.route.params.selectedButton
          : dashboardUpdate?.moduleName && dashboardUpdate.moduleName !== 'Home'
          ? dashboardUpdate.moduleName
          : this.state.lister?.props?.moduleName
          ? this.state.lister.props.moduleName
          : this.state.lister?.moduleName
          ? this.state.lister.moduleName
          : this.props?.selectedButton;
      } else {
        moduleName = this.props?.route?.params?.selectedButton
          ? this.props?.route?.params?.selectedButton
          : this.props?.selectedButton;
      }
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
    
    // Get moduleLable from modules list if moduleName is available
    let moduleLable = this.props.moduleLable;
    if (moduleName && !this.props?.isTimesheets) {
      if (this.props?.route?.params?.tabLabel) {
        moduleLable = this.props.route.params.tabLabel;
      } else {
        const {auth} = store.getState();
        const modules = auth?.loginDetails?.modules || [];
        const foundModule = modules.find(
          (mod) => mod?.name?.toLowerCase() === moduleName?.toLowerCase(),
        );
        if (foundModule?.label) {
          moduleLable = foundModule.label;
        }
      }
    }
    
    return (
      <View style={styles.backgroundStyle}>
        <Header
          recordId={this.state.recordId}
          navigation={this.props.navigation}
          moduleName={
            this.props?.isTimesheets ? this.props.isTimesheets : moduleName
          }
          moduleId={this.props.moduleId}
          moduleLable={
            this.props?.isTimesheets
              ? this.props.isTimesheets
              : moduleLable || this.props.moduleLable || moduleName || 'Edit Record'
          }
          callViewer={this.callViewer.bind(this)}
          showCopyOptions={this.showCopyOptions.bind(this)}
          isTimesheets={
            this.props?.isTimesheets ? this.props?.isTimesheets : null
          }
        />
        <View
          style={{
            width: '100%',
            height: Dimensions.get('screen').height * 0.85,
          }}>
          <Viewer
            recordId={this.state.recordId}
            subModule={this.props.route?.params?.submodule}
            navigation={this.props.navigation}
            moduleName={
              this.props?.isTimesheets ? this.props?.isTimesheets : moduleName
            }
            moduleId={this.props.moduleId}
            moduleLable={this.props.moduleLable}
            onRef={(ref) => (this.viewer = ref)}
            recordName={this.state.recordName}
            currentId={this.state.currentId}
            moduleFromCalender={this.props.route?.params?.moduleFromCalender}
          />
        </View>
        {/* {this.props.isTimesheets ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              height: '12%',
              width: '100%',
              alignSelf: 'center',
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row',
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,

              elevation: 3,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: '#EE4B2B',
                width: 110,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                borderRadius: 10,
              }}
              onPress={() => this.props.dispatch(isTimeSheetModal(false))}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: '#75C2F6',
                width: 110,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => this.callViewer(this)}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        ) : null} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',
    flex: 1,
    paddingBottom: 80,
    backgroundColor: generalBgColor,
  },
});

const mapStateToProps = ({drawer}) => {
  const {selectedButton, moduleId, moduleLable} = drawer;
  return {selectedButton, moduleId, moduleLable};
};

export default connect(mapStateToProps)(AddRecords);
