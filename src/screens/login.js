import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import SafeAreaView from 'react-native-safe-area-view';


import SplashComponent from '../components/splashComponent';
import LoginForm from '../components/loginForm';
import { loginUser } from '../actions/';
import { LOGINDETAILSKEY, LOADER, LOGINFORM, INTRO } from '../variables/strings';
import IntroSlide from '../components/introSlide';

const introSlides = [
    {
        key: 'first',
        content: () => <IntroSlide
            subtitle={'GOOGLE & MICROSOFT SUPPORTED'}
            title={'Integrates with your Email and Calendar'}
            image={require('../../assets/images/swipe_1.png')}
            bullets={[
                'Integrates with all popular emails and calendars',
                'Add events (and customers!) to your calendar',
                'Send emails from your email address inside Simply'
            ]}
        />
    },
    {
        key: 'second',
        content: () => <IntroSlide
            subtitle={'DASHBOARDS FOR EACH CUSTOMER'}
            title={'Get full customer overview'}
            image={require('../../assets/images/swipe_2.png')}
            bullets={[
                'Check who had the last dialogue – and what it was about',
                'See related Events, Calls, Emails, Documents, etc.',
                'Actionable: What is next step on this customer'
            ]}
        />
    },
    {
        key: 'third',
        content: () => <IntroSlide
            subtitle={'VISUALISE YOUR SALES PROCESS'}
            title={'CRM made visual'}
            image={require('../../assets/images/swipe_3.png')}
            bullets={[
                'Dashboards',
                'GANTT charts for projects',
                'Visual Pipeline (KANBAN) for sales & processes'
            ]}
        />
    },
];

class Splash extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = { componentToLoad: null };
    }

    componentDidMount() {
        this.getUserCredential();
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
            const loginDetails = JSON.parse(await AsyncStorage.getItem(LOGINDETAILSKEY));
            if (loginDetails !== null) {
                this.props.loginUser(loginDetails.username, loginDetails.password,
                    loginDetails.url, this.props.navigation, this);
                this.setState({ componentToLoad: LOADER });
            } else {
                const wasIntroShown = await this.didShowIntro();

                if (wasIntroShown) {
                    this.setState({ componentToLoad: LOGINFORM });
                } else {
                    this.setState({ componentToLoad: INTRO })
                }
            }
        } catch (error) {
            this.setState({ componentToLoad: LOGINFORM });
        }
    }

    renderItem = ({ item }) => {
        return (
            <View style={{ paddingBottom: 40 }}>
                {item.content()}
            </View>
        );
    }
    onIntroDone = () => {
        AsyncStorage.setItem(INTRO, 'true');
        this.setState({ componentToLoad: LOGINFORM });
    }

    renderSplashLoader() {
        return (
            <SplashComponent>
                <ActivityIndicator color={'white'} />
            </SplashComponent>
        );
    }

    renderSplashLoginForm() {
        return (
            <View style={{ flex: 1 }}>
                <LoginForm navigation={this.props.navigation} />
            </View>
        );
    }

    renderIntro() {
        return <View style={{ flex: 1, backgroundColor: '#F8FAFD', }}>
            <SafeAreaView
                forceInset={{ top: 'always' }}
                style={{ flex: 1 }}
            >
                <AppIntroSlider
                    renderItem={this.renderItem}
                    slides={introSlides}
                    onDone={this.onIntroDone}
                    dotStyle={{ backgroundColor: 'rgba(0, 0, 0, .1)' }}
                    activeDotStyle={{ backgroundColor: 'rgba(0, 0, 0, .2)' }}
                    buttonTextStyle={{
                        color: '#1583EC',
                        fontFamily: 'Poppins-Regular'
                    }}
                />
            </SafeAreaView>
        </View>
    }

    renderView() {
        switch (this.state.componentToLoad) {
            case LOADER:
                return this.renderSplashLoader();
            case INTRO:
                return this.renderIntro();
            case LOGINFORM:
                return this.renderSplashLoginForm();
            default:
                return <View style={{ flex: 1 }} />;
        }
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#F8FAFD' }}>
            {this.renderView()}
        </View>
    }
}

export default connect(undefined, { loginUser })(Splash);
