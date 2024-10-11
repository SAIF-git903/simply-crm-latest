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

export default function ImageButton({icon, type, label, module}) {
  const {selectedButton} = useSelector((state) => state.drawer);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  function onButtonPress() {
    switch (type) {
      case HOME:
        dispatch(drawerButtonPress(type));
        navigation.navigate('Dashboard');
        break;
      case CALENDAR:
        dispatch(drawerButtonPress(module.name, module.label, module.id));
        navigation.navigate('Calendar', {
          moduleName: module.name,
          moduleLable: module.label,
          moduleId: module.id,
        });
        break;
      default:
        dispatch(drawerButtonPress(module.name, module.label, module.id));
        navigation.navigate('Records', {
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
            iconName={icon}
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
