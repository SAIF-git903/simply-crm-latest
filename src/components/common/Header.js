import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {DrawerActions} from '@react-navigation/native';
import SafeAreaView from 'react-native-safe-area-view';

import {fontStyles} from '../../styles/common';

export default function Header(props) {
  const {title, showBackButton, customRightButton} = props;

  const navigation = useNavigation();

  function onMenuButtonPress() {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }

  function renderMenuButton() {
    return (
      <TouchableOpacity onPress={onMenuButtonPress}>
        <Icon name="bars" size={28} color="white" />
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
        <Icon name="angle-left" size={28} color="white" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView forceInset={{top: 'always', bottom: 'never'}}>
        <View style={styles.contentContainer}>
          <View style={{minWidth: 28}}>
            {showBackButton ? renderBackButton() : renderMenuButton()}
          </View>

          <View style={{flex: 1}}>
            <Text style={fontStyles.navbarTitle}>{title}</Text>
          </View>

          <View style={{minWidth: 28}}>
            {customRightButton ? customRightButton : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'stretch',
    backgroundColor: '#364150',
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
