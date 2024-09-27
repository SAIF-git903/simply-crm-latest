import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppRegistry, Platform, UIManager} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {name as appName} from './app.json';
import Router from './src/router';
import store from './src/store';

console.disableYellowBox = true;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => App);
