import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {View, TouchableOpacity, Text} from 'react-native';
import {drawerButtonPress} from '../../../actions';
import {
  DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR,
  DRAWER_SECTION_HEADER_TEXT_COLOR,
  DRAWER_SECTION_HEADER_IMAGE_COLOR,
  headerIconColor,
  menuActive,
} from '../../../variables/themeColors';
import {HOME, CALENDAR} from '../../../variables/constants';
import {fontStyles} from '../../../styles/common';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {DynamicIcon} from '../../common/DynamicIcon';

export default function ImageButton({icon, type, label, module, navigation: propNavigation}) {
  const {selectedButton} = useSelector((state) => state.drawer);
  const dispatch = useDispatch();
  const hookNavigation = useNavigation();
  // Use navigation prop if provided (from drawerContent), otherwise use hook
  const navigation = propNavigation || hookNavigation;
  
  console.log('ImageButton render:', {icon, type, label});

  function onButtonPress() {
    // Use the navigation prop (drawer navigator) if provided, otherwise try to get it
    let drawerNavigation = navigation;
    
    // If we got navigation from prop, it's already the drawer navigator
    // Otherwise, try to get the drawer navigator
    if (!propNavigation) {
      try {
        // In drawerContent, useNavigation() should return the drawer navigator
        // But if not, try getParent
        const parent = navigation.getParent();
        if (parent) {
          drawerNavigation = parent;
        }
      } catch (e) {
        // If getParent fails, use current navigation
      }
    }
    
    switch (type) {
      case HOME:
        dispatch(drawerButtonPress(type));
        // Close drawer and navigate to Dashboard
        if (drawerNavigation.closeDrawer) {
          drawerNavigation.closeDrawer();
        }
        drawerNavigation.navigate('Dashboard');
        break;
      case CALENDAR:
        dispatch(drawerButtonPress(module.name, module.label, module.id));
        if (drawerNavigation.closeDrawer) {
          drawerNavigation.closeDrawer();
        }
        drawerNavigation.navigate('Calendar', {
          moduleName: module.name,
          moduleLable: module.label,
          moduleId: module.id,
        });
        break;
      default:
        dispatch(drawerButtonPress(module.name, module.label, module.id));
        if (drawerNavigation.closeDrawer) {
          drawerNavigation.closeDrawer();
        }
        drawerNavigation.navigate('Records', {
          moduleName: module.name,
          moduleLable: module.label,
          moduleId: module.id,
        });
        break;
    }
  }

  return (
    <TouchableOpacity style={{flex: 1}} onPress={() => onButtonPress()}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={{paddingLeft: 15, width: 46}}>
          <DynamicIcon
            iconName={label==="Calendar"?'calendar':label==="Tasks"?"tasks":label==="Sales"?'dollar-sign':label==="Projects"?'diagram-project':icon}
            size={20}
            // color={
            //   selectedButton !== type
            //     ? DRAWER_SECTION_HEADER_TEXT_COLOR
            //     : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR
            // }
            color={
              selectedButton !== type
                ? DRAWER_SECTION_HEADER_TEXT_COLOR
                : menuActive
            }
          />
          {/* <Icon
            name={icon}
            size={20}
            color={
              selectedButton !== type
                ? DRAWER_SECTION_HEADER_TEXT_COLOR
                : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR
            }
          /> */}
        </View>
        <Text
          style={[
            fontStyles.drawerMenuButtonText,
            {
              color:
                selectedButton === type
                  ? menuActive
                  : DRAWER_SECTION_HEADER_IMAGE_COLOR,
              // color:
              //   selectedButton === type
              //     ? DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR
              //     : DRAWER_SECTION_HEADER_IMAGE_COLOR,
            },
          ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
