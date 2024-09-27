import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {commonStyles, fontStyles} from '../../styles/common';
import {isTimeSheetModal, saveSuccess} from '../../actions';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SinglePickerMaterialDialog} from 'react-native-material-dialog';
import {
  headerIconColor,
  HEADER_COLOR,
  headerTextColor,
} from '../../variables/themeColors';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dialogueVisible: false,
      copyFrom: 'Contacts',
      recordId: this.props.recordId,
    };
  }

  onBackButtonPress() {
    this.props.dispatch(saveSuccess('not saved'));
    this.props.navigation.goBack(null);
  }

  onAddButtonPress() {
    this.props.callViewer(this);
  }

  onShowCopyOption() {
    this.props.showCopyOptions(this);
  }

  renderBackButton() {
    if (this.props.width > 600 && !this.props.isPortrait) {
      //TODO dont know why
      //when this is Landscape tablet
      return null;
    }

    return (
      <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
        {/* <Icon name="arrow-left" size={28} color={headerIconColor} /> */}
        <MaterialIcons name="arrow-back" size={30} color={headerIconColor} />
      </TouchableOpacity>
    );
  }

  getSaveButton() {
    let view;
    if (this.state.loading) {
      view = (
        <View>
          {/* <ActivityIndicator color={'white'} /> */}
          <ActivityIndicator color={headerIconColor} />
        </View>
      );
    } else {
      view = (
        <>
          {this.props?.isTimesheets ? (
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: headerIconColor,
              }}>
              Save
            </Text>
          ) : (
            <Ionicons
              style={{alignSelf: 'flex-end'}}
              name="save-outline"
              solid
              size={29}
              color={headerIconColor}
            />
          )}
        </>

        // <Icon
        //   style={{alignSelf: 'flex-end'}}
        //   name="save"
        //   solid
        //   size={28}
        //   color={headerIconColor}
        // />
      );
    }
    return view;
  }
  getCancleButton() {
    return (
      <TouchableOpacity
        onPress={() => this.props.dispatch(isTimeSheetModal(false))}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: 16,
            color: headerIconColor,
          }}>
          Cancel
        </Text>
      </TouchableOpacity>
    );
  }

  getCopyView() {
    let view = null;
    if (!this.props.recordId) {
      const copyOptions = [];
      copyOptions.push({label: 'Contacts', value: 0});
      copyOptions.push({label: 'Organisation', value: 1});
      view = (
        <SinglePickerMaterialDialog
          title={'Copy Billing & Shipping Address From'}
          items={copyOptions}
          visible={this.state.dialogueVisible}
          selectedItem={this.state.dialogueSelectedValue}
          onCancel={() => this.setState({dialogueVisible: false})}
          onOk={(result) => {
            this.setState(
              {
                dialogueSelectedValue: result.selectedItem,
                dialogueVisible: false,
                copyFrom: result.selectedItem.label,
              },
              () => {
                this.onShowCopyOption();
              },
            );
          }}
          scrolled={false}
        />
      );
    }
    return view;
  }

  render() {
    return (
      <View
        style={[
          commonStyles.headerBackground,
          {
            // backgroundColor: this.props?.isTimesheets ? '#fff' : HEADER_COLOR,
            backgroundColor: '#FFF',
            borderBottomWidth: 0.5,
            borderBottomColor: '#d3d2d8',
          },
        ]}>
        <SafeAreaView forceInset={{top: 'always', bottom: 'never'}}>
          <View style={commonStyles.headerContentStyle}>
            <View style={{minWidth: 40}}>
              {this.props?.isTimesheets
                ? this.getCancleButton()
                : this.renderBackButton()}
            </View>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={[
                  fontStyles.navbarTitle,
                  {
                    textAlign: 'center',
                    color: headerTextColor,
                  },
                ]}>
                {this.props.moduleLable}
              </Text>
            </View>
            <TouchableOpacity
              // disabled={this.props.isTimesheets ? true : false}
              onPress={this.onAddButtonPress.bind(this)}>
              <View
                style={{
                  minWidth: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {this.getSaveButton()}
              </View>
            </TouchableOpacity>

            {this.getCopyView()}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProp = ({event, recordViewer}) => {
  const {isPortrait, width, height} = event;
  const {contactAddress, organisationAddress} = recordViewer;
  return {isPortrait, width, height, contactAddress, organisationAddress};
};

export default connect(mapStateToProp)(Header);
