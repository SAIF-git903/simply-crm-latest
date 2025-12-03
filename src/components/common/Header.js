import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DrawerActions} from '@react-navigation/native';
import SafeAreaView from 'react-native-safe-area-view';

import {fontStyles} from '../../styles/common';
import {headerIconColor, headerTextColor} from '../../variables/themeColors';

export default function Header(props) {
  const [visible, setVisible] = useState(false);

  const {title, showBackButton, customRightButton, showDetailButton, onPress} =
    props;

  const navigation = useNavigation();

  function onMenuButtonPress() {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }

  function renderMenuButton() {
    return (
      <TouchableOpacity onPress={onMenuButtonPress}>
          <Icon name="bars" size={25} color={headerIconColor} />
        {/* <Ionicons name="menu-outline" size={30} color={headerIconColor} /> */}
      </TouchableOpacity>
    );
  }

  function renderBackButton() {
    return (
      <TouchableOpacity
        onPress={() => navigation.pop()}
        style={{
          width: 28,
        }}>
        {/* <Icon name="arrow-left" size={28} color={headerIconColor} /> */}
         <MaterialIcons name="arrow-back" size={30} color={headerIconColor} /> 
         {/* <Ionicons name="menu-outline" size={30} color={headerIconColor} /> */}
      </TouchableOpacity>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={styles.wrapper}>
        <SafeAreaView forceInset={{top: 'always', bottom: 'never'}}>
          <View style={styles.contentContainer}>
            <View style={{minWidth: 28}}>
              {showBackButton ? renderBackButton() : renderMenuButton()}
            </View>

            <View style={{flex: 1}}>
              <Text
                style={[
                  fontStyles.navbarTitle,
                  {
                    color: headerTextColor,
                  },
                ]}>
                {title}
              </Text>
            </View>

            <View style={{minWidth: 28}}>
              {customRightButton ? customRightButton : null}
            </View>
            {showDetailButton && (
              <TouchableOpacity onPress={onPress}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={30}
                  color={headerIconColor}
                />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'stretch',
    // backgroundColor: '#364150',
    backgroundColor: '#FFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#d3d2d8',
  },
  contentContainer: {
    padding: 10,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 15,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
