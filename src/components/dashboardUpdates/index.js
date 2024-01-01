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
    const findModule = (moduleName, moduleList) => {
      return moduleList.find((module) => module?.name === moduleName) || null;
    };

    const modules = this.props?.loginDetails?.modules;

    const organizationModule = findModule('Accounts', modules);
    const contactModule = findModule('Contacts', modules);
    const calendarModule = findModule('Calendar', modules);

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
          {organizationModule && (
            <View style={styles.iconButtonContainer}>
              {/* buttons */}
              <IconButton
                icon={'building'}
                title={organizationModule?.label}
                onPress={() => {
                  this.props.dispatch(
                    drawerButtonPress(
                      organizationModule?.name,
                      organizationModule?.label,
                      organizationModule?.id,
                    ),
                  );

                  navigation.navigate('Records', {
                    moduleName: organizationModule?.name,
                    moduleLable: organizationModule?.label,
                    moduleId: organizationModule?.id,
                  });
                }}
              />
            </View>
          )}
          {contactModule && (
            <View style={styles.iconButtonContainer}>
              <IconButton
                icon={'user'}
                title={contactModule?.label}
                onPress={() => {
                  this.props.dispatch(
                    drawerButtonPress(
                      contactModule?.name,
                      contactModule?.label,
                      contactModule?.id,
                    ),
                  );

                  navigation.navigate('Records', {
                    moduleName: contactModule?.name,
                    moduleLable: contactModule?.label,
                    moduleId: contactModule?.id,
                  });
                }}
              />
            </View>
          )}
          {calendarModule && (
            <View style={styles.iconButtonContainer}>
              <IconButton
                icon={'calendar-alt'}
                title={calendarModule?.label}
                onPress={() => {
                  this.props.dispatch(
                    drawerButtonPress(
                      calendarModule?.name,
                      calendarModule?.label,
                      calendarModule?.id,
                    ),
                  );

                  navigation.navigate(calendarModule?.name, {
                    moduleName: calendarModule?.name,
                    moduleLable: calendarModule?.label,
                    moduleId: calendarModule?.id,
                  });
                }}
              />
            </View>
          )}
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
