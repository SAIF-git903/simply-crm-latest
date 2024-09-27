import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Platform,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import {
  renderDrawerView,
  removeAllDatabase,
  renderDrawerContent,
} from '../helper';
import {
  DRAWER_BACKGROUND,
  HEADER_COLOR,
  DRAWER_INNER_BACKGROUND,
  DRAWER_SECTION_HEADER_TEXT_COLOR,
  DRAWER_SECTION_HEADER_IMAGE_COLOR,
} from '../variables/themeColors';
import {fontStyles} from '../styles/common';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      drawerViews: [],
      drawerLoadComplete: false,
      signOut: [],
      buildNumber: '',
      versionNumber: '',
    };
  }

  componentDidMount() {
    let build = DeviceInfo.getBuildNumber();
    let version = DeviceInfo.getVersion();
    this.setState({versionNumber: version});
    this.setState({buildNumber: build});
    if (!this.state.drawerLoadComplete) {
      this.setState({loading: true});
      renderDrawerView(this.props.loginDetails, this);
    }
  }

  onSignOutPress() {
    Alert.alert(
      'Logout !',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Ok', onPress: this.logout.bind(this)},
      ],
      {cancelable: true},
    );
  }

  signOut() {
    return (
      <TouchableOpacity
        style={styles.singOutWrapper}
        onPress={this.onSignOutPress.bind(this)}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={styles.signOut}>
            <View style={styles.imageStyle}>
              <Icon
                name="power-off"
                size={20}
                color={DRAWER_SECTION_HEADER_IMAGE_COLOR}
              />
            </View>
            <Text style={[styles.textStyle, fontStyles.drawerMenuButtonText]}>
              Sign Out
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingRight: 20,
            }}>
            <Text style={{color: '#d3d3d3'}}>
              V {this.state.versionNumber} ({this.state.buildNumber})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  logout = async () => {
    try {
      await AsyncStorage.removeItem('fields');
      await AsyncStorage.removeItem('UID');
    } catch (error) {
      console.log('err', error);
    }
    removeAllDatabase(this.navigateToSplash.bind(this));
  };

  navigateToSplash() {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }

  renderContent() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo_new_white.png')}
            resizeMode={'contain'}
            style={{flex: 1, width: '50%', height: '100%'}}
          />
        </View>
        {this.state.loading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView style={{backgroundColor: DRAWER_BACKGROUND}}>
            {renderDrawerContent(this.props.loginDetails)}
            <View
              style={{
                width: '100%',
                minHeight: '100%',
                backgroundColor: DRAWER_BACKGROUND,
              }}
            />
          </ScrollView>
        )}
        {this.signOut()}
      </View>
    );
  }

  renderSafeContent() {
    return (
      <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
        {this.renderContent()}
      </SafeAreaView>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: DRAWER_BACKGROUND,
        }}>
        {/* <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" /> */}
        <StatusBar backgroundColor={HEADER_COLOR} barStyle="dark-content" />

        {Platform.OS === 'ios'
          ? this.renderSafeContent()
          : this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  singOutWrapper: {
    height: 50,
    width: '100%',
    backgroundColor: DRAWER_INNER_BACKGROUND,
  },
  signOut: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    marginBottom: 10,
  },
  slide: {
    height: 50,
  },
  textStyle: {
    fontSize: 16,
    color: DRAWER_SECTION_HEADER_TEXT_COLOR,
    paddingLeft: 5,
  },
  imageStyle: {
    height: 20,
    width: 20,
    marginRight: 10,
    marginLeft: 15,
  },
  header: {
    minHeight: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#868d98',
  },
});

const mapStateToProps = ({auth}) => {
  const {loginDetails} = auth;
  return {loginDetails};
};

export default connect(mapStateToProps)(DrawerContent);
