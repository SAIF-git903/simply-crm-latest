import React, {Component} from 'react';
import {connect} from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {commonStyles, fontStyles} from '../../styles/common';
import {viewSearchAction, updateSearchModule} from '../../actions';
import {HEADER_TEXT_COLOR, headerIconColor} from '../../variables/themeColors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Header extends Component {
  componentDidMount() {}

  onMenuButtonPress() {
    const {state} = this.props.navigation;
    if (state.routeName === 'DrawerOpen') {
      this.props.navigation.navigate('DrawerClose');
    } else {
      this.props.navigation.navigate('DrawerOpen');
    }
  }

  onSearchButtonPress() {
    this.props.navigation.navigate('AddRecordScreen');
  }

  renderMenuButton() {
    if (this.props.width > 600) {
      //This is tablet
      return undefined;
    } else {
      //This is phone
      return (
        <TouchableOpacity onPress={this.onMenuButtonPress.bind(this)}>
          {/* <Icon name="bars" size={28} color="white" /> */}
          <Ionicons name="menu-outline" size={30} color={headerIconColor} />
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={commonStyles.headerBackground}>
        <SafeAreaView forceInset={{top: 'always'}}>
          <View style={commonStyles.headerContentStyle}>
            {this.renderMenuButton()}
            <View style={{flex: 1}}>
              <Text style={fontStyles.navbarTitle}>
                {this.props.moduleLable}
              </Text>
            </View>
            <TouchableOpacity onPress={this.onSearchButtonPress.bind(this)}>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  width: 27,
                  height: 27,
                  borderRadius: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Icon name="plus" size={25} color={headerIconColor} /> */}
                <Ionicons
                  name="add-outline"
                  size={30}
                  color={headerIconColor}
                />
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProp = ({event, mgr}) => {
  const {isPortrait, width, height} = event;

  return {isPortrait, width, height};
};

export default connect(mapStateToProp, {viewSearchAction, updateSearchModule})(
  Header,
);
