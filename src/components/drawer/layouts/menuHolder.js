import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {drawerButtonPress} from '../../../actions';
import {
  DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR,
  DRAWER_INNER_BACKGROUND,
  DRAWER_INNER_BORDER_COLOR,
  DRAWER_SECTION_HEADER_TEXT_COLOR,
  DRAWER_SECTION_HEADER_IMAGE_COLOR,
} from '../../../variables/themeColors';
import {fontStyles} from '../../../styles/common';

export default function MenuHolder(props) {
  const {module} = props;

  // Ephemeral state
  const [iconName, setIconName] = useState('file-invoice-dollar');

  // Redux state
  const dispatch = useDispatch();
  const selectedButton = useSelector((state) => state.drawer.selectedButton);

  const navigation = useNavigation();

  useEffect(() => {
    assignIcons();
  });

  function assignIcons() {
    switch (module.name) {
      case 'Accounts':
        setIconName('building');
        break;
      case 'Sales':
        setIconName('luggage-cart');
        break;
      case 'Contacts':
        setIconName('user');
        break;
      case 'Tools':
        setIconName('wrench');
        break;
      case 'Products':
        setIconName('shopping-cart');
        break;
      case 'Invoice':
        setIconName('file-invoice-dollar');
        break;
      case 'Potentials':
        setIconName('search-dollar');
        break;
      case 'Emails':
        setIconName('envelope');
        break;
      case 'Reports':
        setIconName('chart-bar');
        break;
      case 'Documents':
        setIconName('file-alt');
        break;
      case 'Calendar':
        setIconName('calendar-alt');
        break;
      case 'Vendors':
        setIconName('shield-alt');
        break;
      case 'Services':
        setIconName('box-open');
        break;
      case 'Quotes':
        setIconName('quote-right');
        break;
      case 'SalesOrder':
        setIconName('file-invoice');
        break;
      case 'Leads':
        setIconName('user-check');
        break;
      case 'Faq':
        setIconName('hands-helping');
        break;
      case 'HelpDesk':
        setIconName('ticket-alt');
        break;
      case 'ServiceContracts':
        setIconName('file-signature');
        break;
      case 'Assets':
        setIconName('briefcase');
        break;
      case 'ProjectMilestone':
        setIconName('clipboard-check');
        break;
      case 'ProjectTask':
        setIconName('tasks');
        break;
      case 'Project':
        setIconName('project-diagram');
        break;
      default:
    }
  }

  function onButtonPress() {
    dispatch(drawerButtonPress(module.name, module.label, module.id));

    navigation.navigate(module.name === 'Calendar' ? 'Calendar' : 'Records', {
      moduleName: module.name,
      moduleLable: module.label,
      moduleId: module.id,
    });
  }

  return (
    <TouchableOpacity onPress={onButtonPress}>
      <View style={styles.holder}>
        <View style={styles.image}>
          <Icon
            name={iconName}
            size={20}
            color={
              selectedButton !== module.name
                ? DRAWER_SECTION_HEADER_IMAGE_COLOR
                : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR
            }
          />
        </View>
        <Text
          style={[
            styles.text,
            fontStyles.drawerMenuButtonText,
            {
              color:
                selectedButton !== module.name
                  ? DRAWER_SECTION_HEADER_TEXT_COLOR
                  : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR,
            },
          ]}>
          {module.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  holder: {
    backgroundColor: DRAWER_INNER_BACKGROUND,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: DRAWER_INNER_BORDER_COLOR,
  },
  image: {
    marginLeft: 40,
    marginRight: -12,
    width: 46,
    height: 20,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
});
