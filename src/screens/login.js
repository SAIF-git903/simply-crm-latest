import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, ActivityIndicator, StatusBar, View } from 'react-native';
import SplashComponent from '../components/splashComponent';
import LoginForm from '../components/loginForm';
import { loginUser } from '../actions/';
import { LOGINDETAILSKEY, LOADER, LOGINFORM } from '../variables/strings';

class Splash extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = { componentToLoad: LOADER };
    }

    componentDidMount() {
        this.getUserCredential();
    }

    async getUserCredential() {
        try {
            const loginDetails = JSON.parse(await AsyncStorage.getItem(LOGINDETAILSKEY));
            if (loginDetails !== null) {
                this.props.loginUser(loginDetails.username, loginDetails.password, 
                    loginDetails.url, this.props.navigation, this);
                this.setState({ componentToLoad: LOADER });
            } else {
                this.setState({ componentToLoad: LOGINFORM });
                
            }
        } catch (error) {
            this.setState({ componentToLoad: LOGINFORM });
        }
    }

    renderSplashLoader() {
        return (
            <SplashComponent>
                <StatusBar
                backgroundColor="rgba(0, 0, 0, 0.20)"
                translucent
                barStyle="light-content"
                />
                <ActivityIndicator color={'white'} />
            </SplashComponent>
        );
    }

    renderSplashLoginForm() {
        return (
            <View>
                <StatusBar
                backgroundColor="rgba(0, 0, 0, 0.20)"
                translucent
                barStyle="light-content"
                />
                <LoginForm navigation={this.props.navigation} />
            </View>
        );
    }

    render() {
        switch (this.state.componentToLoad) {
            case LOADER:
                return this.renderSplashLoader();
            case LOGINFORM:
                return this.renderSplashLoginForm();
            default:
                return this.renderSplashLoader();
        }
   }
}

export default connect(undefined, { loginUser })(Splash);
