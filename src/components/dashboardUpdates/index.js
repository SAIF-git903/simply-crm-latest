import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';

import Header from './Header';
import Viewer from './Viewer';
import {drawerButtonPress} from '../../actions/index';

import Icon from 'react-native-vector-icons/FontAwesome5';

import {fontStyles} from '../../styles/common';

const IconButton = ({icon, title, style, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        style,
        {
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 60,
        },
      ]}>
      <Icon name={icon} size={36} color={'#797f8b'} />
      <Text style={[fontStyles.iconButtonLabel, {paddingTop: 10}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

class UpdateWidget extends Component {
  render() {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 30,
            paddingBottom: 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}>
          <View style={styles.iconButtonContainer}>
            {/* buttons */}
            <IconButton
              icon={'building'}
              title={'Organizations'}
              onPress={() => {
                this.props.dispatch(
                  drawerButtonPress('Accounts', 'Organizations', 11),
                );

                navigation.navigate('Records', {
                  moduleName: 'Accounts',
                  moduleLable: 'Organizations',
                  moduleId: 11,
                });
              }}
            />
          </View>
          <View style={styles.iconButtonContainer}>
            <IconButton
              icon={'user'}
              title={'Contacts'}
              onPress={() => {
                this.props.dispatch(
                  drawerButtonPress('Contacts', 'Contacts', 12),
                );

                navigation.navigate('Records', {
                  moduleName: 'Contacts',
                  moduleLable: 'Contacts',
                  moduleId: 12,
                });
              }}
            />
          </View>
          <View style={styles.iconButtonContainer}>
            <IconButton
              icon={'calendar-alt'}
              title={'Calendar'}
              onPress={() => {
                this.props.dispatch(
                  drawerButtonPress('Calendar', 'Calendar', 9),
                );

                navigation.navigate('Calendar', {
                  moduleName: 'Calendar',
                  moduleLable: 'Calendar',
                  moduleId: 9,
                });
              }}
            />
          </View>
          {/* 
                    <IconButton
                        icon={'tasks'}
                        title={'Tasks'}
                    /> */}
        </View>
        <View style={{padding: 10, paddingBottom: 0}}>
          <Header modules={this.props.loginDetails.modules} />
        </View>
        <View style={{flex: 1, padding: 10}}>
          <Viewer navigation={navigation} />
        </View>
      </View>
    );
  }
}
const styles = {
  container: {
    flex: 1,
  },
  iconButtonContainer: {
    paddingHorizontal: 15,
  },
};

const mapStateToProps = ({auth}) => {
  const {loginDetails} = auth;
  return {loginDetails};
};

export default connect(mapStateToProps)(UpdateWidget);
