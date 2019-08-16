import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { commonStyles } from '../styles/common';

export default class HomeHeader extends Component {
  render() {
    return (
      <View style={commonStyles.headerBackground}>
        <View style={styles.textHolderStyle}>
          <Text style={styles.headerTextStyle}> {this.props.name}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerTextStyle: {
    color: 'white',
    fontSize: 17
  },
  textHolderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
