import React, {Component} from 'react';
import {View, TouchableOpacity, Text, ImageBackground} from 'react-native';
import {connect} from 'react-redux';

import Header from './Header';
import Viewer from './Viewer';
import {drawerButtonPress} from '../../actions/index';

import Icon from 'react-native-vector-icons/FontAwesome5';

import {fontStyles} from '../../styles/common';
import {DynamicIcon} from '../common/DynamicIcon';
import {headerIconColor} from '../../variables/themeColors';

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
  render() {
    const {navigation} = this.props;

    // const findModule = (moduleName, moduleList) => {
    //   return moduleList.find((module) => module?.name === moduleName) || null;
    // };

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

    // const organizationModule = findModule('Accounts', modules);
    // const contactModule = findModule('Contacts', modules);
    // const calendarModule = findModule('Calendar', modules);

    return (
      <View style={styles.container}>
        <View
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
                iconName = val?.icon;
                break;
            }

            return (
              <>
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
                      icon={iconName}
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
              </>
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
          {/* 
                    <IconButton
                        icon={'tasks'}
                        title={'Tasks'}
                    /> */}
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

const mapStateToProps = ({auth}) => {
  const {loginDetails} = auth;
  return {loginDetails};
};

export default connect(mapStateToProps)(UpdateWidget);
