import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import SafeAreaView from 'react-native-safe-area-view';

import SplashComponent from '../components/splashComponent';
import LoginForm from '../components/loginForm';
import {loginUser, loginUserforMslogin} from '../actions/';
import {LOGINDETAILSKEY, LOADER, LOGINFORM, INTRO} from '../variables/strings';
import IntroSlide from '../components/introSlide';
import DeviceInfo from 'react-native-device-info';
import {API_DebugApp} from '../helper/api';
import Popover from 'react-native-popover-view';
import store from '../store';

class Splash extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      componentToLoad: null,
      buildNumber: '',
      versionNumber: '',
      visible: false,
      user_name: '',
      session_id: '',
    };
  }

  componentDidMount() {
    this.getUserCredential();
    let build = DeviceInfo.getBuildNumber();
    let version = DeviceInfo.getVersion();
    this.setState({versionNumber: version});
    this.setState({buildNumber: build});
  }

  getIntroSliders() {
    let introSliders = [];
    let pages = [
      {
        key: 'first',
        subtitle: 'GOOGLE & MICROSOFT SUPPORTED',
        title: 'Integrates with your Email and Calendar',
        image: require('../../assets/images/swipe_1.png'),
        bullets: [
          'Integrates with all popular emails and calendars',
          'Add events (and customers!) to your calendar',
          'Send emails from your email address inside Simply',
        ],
      },
      {
        key: 'second',
        subtitle: 'DASHBOARDS FOR EACH CUSTOMER',
        title: 'Get full customer overview',
        image: require('../../assets/images/swipe_2.png'),
        bullets: [
          'Check who had the last dialogue – and what it was about',
          'See related Events, Calls, Emails, Documents, etc.',
          'Actionable: What is next step on this customer',
        ],
      },
      {
        key: 'third',
        subtitle: 'VISUALISE YOUR SALES PROCESS',
        title: 'CRM made visual',
        image: require('../../assets/images/swipe_3.png'),
        bullets: [
          'Dashboards',
          'GANTT charts for projects',
          'Visual Pipeline (KANBAN) for sales & processes',
        ],
      },
    ];
    for (const page of pages) {
      introSliders.push({
        key: page.key,
        content: () => (
          <IntroSlide
            subtitle={page.subtitle}
            title={page.title}
            image={page.image}
            bullets={page.bullets}
          />
        ),
      });
    }
    return introSliders;
  }

  async didShowIntro() {
    try {
      const wasShown = await AsyncStorage.getItem(INTRO);
      if (wasShown !== 'true') return false;
    } catch (e) {
      console.log(e);
    }
    return true;
  }

  async getUserCredential() {
    try {
      const loginDetails = JSON.parse(
        await AsyncStorage.getItem(LOGINDETAILSKEY),
      );

      if (loginDetails !== null) {
        if (loginDetails?.token !== null) {
          this.props.loginUserforMslogin(
            loginDetails.username,
            loginDetails?.token,
            loginDetails.password,
            loginDetails.url,
            this.props.navigation,
            this,
          );
        } else {
          this.props.loginUser(
            loginDetails.username,
            loginDetails.password,
            loginDetails?.token,
            loginDetails.url,
            this.props.navigation,
            this,
          );
        }
        this.setState({componentToLoad: LOADER});
      } else {
        const wasIntroShown = await this.didShowIntro();

        if (wasIntroShown) {
          this.setState({componentToLoad: LOGINFORM});
        } else {
          this.setState({componentToLoad: INTRO});
        }
      }
    } catch (error) {
      this.setState({componentToLoad: LOGINFORM});
    }
  }

  debugApp = async () => {
    try {
      await API_DebugApp();
    } catch (error) {
      console.log('err', error);
    }
  };

  renderItem = ({item}) => {
    return <View style={{paddingBottom: 40}}>{item.content()}</View>;
  };

  onIntroDone = () => {
    AsyncStorage.setItem(INTRO, 'true');
    this.setState({componentToLoad: LOGINFORM});
  };

  renderSplashLoader() {
    return (
      <SplashComponent>
        <ActivityIndicator color={'white'} />
        <View style={{marginTop: 20}}>
          <Text style={{color: '#339DDF'}}>V {this.state.versionNumber}</Text>
        </View>

        <Popover
          isVisible={this.state.visible}
          verticalOffset={
            Platform.OS === 'android' ? -StatusBar.currentHeight : 0
          }
          onRequestClose={() => this.setState({visible: false})}
          from={
            <TouchableOpacity
              onPress={async () => {
                this.debugApp();
                this.setState({visible: true});

                const loginDetails = JSON.parse(
                  await AsyncStorage.getItem(LOGINDETAILSKEY),
                );

                this.setState({
                  user_name: loginDetails?.username,
                  session_id: loginDetails?.session,
                });
              }}
              style={{
                position: 'absolute',
                zIndex: 1,
                alignSelf: 'center',
                bottom: 30,
                padding: 10,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: '#339DDF',
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Send Debug
              </Text>
            </TouchableOpacity>
          }>
          <View>
            <Text>{this.state.user_name}</Text>
            <Text>{this.state.session_id}</Text>
          </View>
        </Popover>
      </SplashComponent>
    );
  }

  renderSplashLoginForm() {
    return (
      <View style={{flex: 1}}>
        <LoginForm navigation={this.props.navigation} />
      </View>
    );
  }

  renderIntro() {
    return (
      <View style={{flex: 1, backgroundColor: '#F8FAFD'}}>
        <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
          <AppIntroSlider
            renderItem={this.renderItem}
            slides={this.getIntroSliders()}
            onDone={this.onIntroDone}
            dotStyle={{backgroundColor: 'rgba(0, 0, 0, .1)'}}
            activeDotStyle={{backgroundColor: 'rgba(0, 0, 0, .2)'}}
            buttonTextStyle={{
              color: '#1583EC',
              fontFamily: 'Poppins-Regular',
            }}
          />
        </SafeAreaView>
      </View>
    );
  }

  renderView() {
    let view;
    switch (this.state.componentToLoad) {
      case LOADER:
        view = this.renderSplashLoader();
        break;
      case INTRO:
        view = this.renderIntro();
        break;
      case LOGINFORM:
        view = this.renderSplashLoginForm();
        break;
      default:
        view = <View style={{flex: 1}} />;
        break;
    }
    return view;
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F8FAFD'}}>
        {this.renderView()}
      </View>
    );
  }
}

export default connect(undefined, {loginUser, loginUserforMslogin})(Splash);
