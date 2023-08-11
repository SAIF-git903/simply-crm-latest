import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fontStyles} from '../../styles/common';

class Contacts extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onRecordSelect(this.props.item.id, this.props.index);
        }}>
        <View
          style={[
            styles.backgroundStyle,
            {
              borderTopWidth: this.props.index === 0 ? 1 : 0,
            },
          ]}>
          <Text numberOfLines={1} style={fontStyles.dashboardRecordLabelBig}>
            {this.props.item.contactsLable}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    borderColor: '#f2f3f8',
    borderBottomWidth: 1,
    padding: 15,
  },
});

export default connect(null)(Contacts);
