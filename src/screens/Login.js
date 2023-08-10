import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import SafeAreaView from 'react-native-safe-area-view';

import SplashComponent from '../components/splashComponent';
import LoginForm from '../components/loginForm';
import {loginUser} from '../actions/';
import {LOGINDETAILSKEY, LOADER, LOGINFORM, INTRO} from '../variables/strings';
import IntroSlide from '../components/introSlide';

class Splash extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {componentToLoad: null};
  }

  componentDidMount() {
    this.getUserCredential();
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
        this.props.loginUser(
          loginDetails.username,
          loginDetails.password,
          loginDetails.url,
          this.props.navigation,
          this,
        );
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

export default connect(undefined, {loginUser})(Splash);
