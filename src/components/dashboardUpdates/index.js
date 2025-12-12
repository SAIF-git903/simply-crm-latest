import React, {Component} from 'react';
import {View, TouchableOpacity, Text, ImageBackground} from 'react-native';
import {connect} from 'react-redux';

import Header from './Header';
import Viewer from './Viewer';
import {drawerButtonPress} from '../../actions/index';
import messaging from '@react-native-firebase/messaging';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {fontStyles} from '../../styles/common';
import {DynamicIcon} from '../common/DynamicIcon';
import {headerIconColor} from '../../variables/themeColors';
import store from '../../store';
import {API_saveRecord} from '../../helper/api';
import {getLocationAndSave} from '../common/Common';

const IconButton = ({icon, title, style, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        style,
        {
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 60,
        },
      ]}>
      {/* <Icon name={icon} size={36} color={'#797f8b'} /> */}
      <DynamicIcon iconName={icon} size={35} color={headerIconColor} />
      <Text style={[fontStyles.iconButtonLabel, {paddingTop: 10}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

class UpdateWidget extends Component {
  async componentDidMount() {
    const token = await messaging().getToken();
    console.log('token', token);
    if (token) {
      let body_data = {
        // ...updatedUserData,
        push_notification_tkn: token,
      };
      await API_saveRecord('Users', body_data, this.props.userData?.id);
    }
    getLocationAndSave();
  }

  // removeId = (userData) => {
  //   let newUserData = {...userData}; // Create a copy to avoid mutating the original object
  //   delete newUserData.id;
  //   return newUserData;
  // };

  render() {
    const {navigation} = this.props;

    // const findModule = (moduleName, moduleList) => {
    //   return moduleList.find((module) => module?.name === moduleName) || null;
    // };
    // let isArry = Array.isArray(this.props?.loginDetails?.menu);
    // let menu = isArry
    //   ? this.props?.loginDetails?.menu
    //   : Object.values(this.props?.loginDetails?.menu);

    const filterData = this.props?.loginDetails?.menu?.filter(
      (val) => val?.name !== 'Home',
    );

    const firstThree = filterData.slice(0, 3);
    const modules = this.props?.loginDetails?.modules;

    function capitalizeName(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)?.toLowerCase();
    }
    const modifyMenuWithModuleId = (menu, modules) => {
      return menu?.map((menuItem) => {
        // Find the corresponding module
        const correspondingModule = modules?.find(
          (module) =>
            module?.name?.toLowerCase() === menuItem?.name?.toLowerCase(),
        );
        // Merge if module is found
        const updatedMenuItem = {...menuItem, id: correspondingModule?.id};
        // Capitalize the name
        return {
          ...updatedMenuItem,
          // name: capitalizeName(updatedMenuItem?.name),
          name: updatedMenuItem?.name,
        };
      });
    };

    const modifiedMenu = modifyMenuWithModuleId(firstThree, modules);

    const newData = modifiedMenu?.filter((val) => val?.id !== undefined);

    // Debug logging
    console.log('Dashboard Icons Debug:', {
      filterData: filterData?.length,
      firstThree: firstThree?.length,
      modifiedMenu: modifiedMenu?.length,
      newData: newData?.length,
      newDataItems: newData,
    });

    // const organizationModule = findModule('Accounts', modules);
    // const contactModule = findModule('Contacts', modules);
    // const calendarModule = findModule('Calendar', modules);

    return (
      <View style={styles.container}>
        <View
          // key={}
          style={{
            flexDirection: 'row',
            paddingTop: newData?.length > 0 ? 30 : 0,
            paddingBottom: newData?.length > 0 ? 20 : 0,
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}>
          {newData?.map((val) => {
            let iconName;

            switch (val?.name) {
              case 'Accounts':
                iconName = val?.icon ? val?.icon : 'building';
                break;
              case 'Contacts':
                iconName = val?.icon ? val?.icon : 'user';
                break;
              case 'Calendar':
                iconName = val?.icon ? val?.icon : 'calendar';
                break;
              case 'Tasks':
                iconName = val?.icon ? val?.icon : 'list-check';
                break;
              case 'Project':
                iconName = val?.icon ? val?.icon : 'diagram-project';
                break;
              case 'ProjectTask':
                iconName = val?.icon ? val?.icon : 'list-check';
                break;
              case 'Potentials':
                iconName = val?.icon ? val?.icon : 'handshake';
                break;
              case 'Timesheets':
                iconName = val?.icon ? val?.icon : 'clock';
                break;
              case 'Vendors':
                iconName = val?.icon ? val?.icon : 'truck-field';
                break;
              case 'HelpDesk':
                iconName = val?.icon ? val?.icon : 'ticket';
                break;
              case 'Quotes':
                iconName = val?.icon ? val?.icon : 'file-lines';
                break;
              case 'SalesOrder':
                iconName = val?.icon ? val?.icon : 'file-invoice';
                break;
              case 'Invoice':
                iconName = val?.icon ? val?.icon : 'file-invoice-dollar';
                break;
              case 'Products':
                iconName = val?.icon ? val?.icon : 'cart-shopping';
                break;
              case 'Services':
                iconName = val?.icon ? val?.icon : 'hand-holding-dollar';
                break;
              case 'Leads':
                iconName = val?.icon ? val?.icon : 'user-check';
                break;
              default:
                iconName = val?.icon || 'circle';
                break;
            }

            return (
              <React.Fragment key={val?.id || val?.name}>
                {val?.name === 'Calendar' ? (
                  <View style={styles.iconButtonContainer}>
                    <IconButton
                      icon={'calendar'}
                      title={val?.label}
                      onPress={() => {
                        this.props.dispatch(
                          drawerButtonPress(val?.name, val?.label, val?.id),
                        );

                        navigation.navigate(val?.name, {
                          moduleName: val?.name,
                          moduleLable: val?.label,
                          moduleId: val?.id,
                        });
                      }}
                    />
                  </View>
                ) : (
                  
                  <View style={styles.iconButtonContainer}>
                    <IconButton
                      icon={val?.label==="Tasks"?'list-check':iconName}
                      title={val?.label}
                      onPress={() => {
                        this.props.dispatch(
                          drawerButtonPress(val?.name, val?.label, val?.id),
                        );

                        navigation.navigate('Records', {
                          moduleName: val?.name,
                          moduleLable: val?.label,
                          moduleId: val?.id,
                        });
                      }}
                    />
                  </View>
                )}
              </React.Fragment>
            );
          })}
          {/* {organizationModule && (
            <View style={styles.iconButtonContainer}>
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
          )} */}
        
                    {/* <IconButton
                        icon={'list-check'}
                        title={'Tasks'}
                    />  */}
        </View>
        <View style={{padding: 10, paddingBottom: 0}}>
          <Header modules={this.props.loginDetails.modules} menu={newData} />
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

const mapStateToProps = ({auth, UserReducer}) => {
  const {loginDetails} = auth;
  const {userData} = UserReducer;
  return {loginDetails, userData};
};

export default connect(mapStateToProps)(UpdateWidget);
