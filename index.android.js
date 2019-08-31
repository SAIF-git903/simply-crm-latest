/**
 * Vtiger
 * Copyright - Smackcoders technologies private ltd.
 * Developer - Prince J <princej@smackcoders.com> 
 */


import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import App from './src/app';
import store from './src/store';

class AppReduxConnected extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('simplycrm', () => AppReduxConnected);
