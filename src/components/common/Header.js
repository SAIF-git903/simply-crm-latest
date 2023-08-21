import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {DrawerActions} from '@react-navigation/native';
import SafeAreaView from 'react-native-safe-area-view';

import {fontStyles} from '../../styles/common';

export default function Header(props) {
  const [visible, setVisible] = useState(false);
  let data = [
    {lbl: 'Comments'},
    {lbl: 'Deals'},
    {lbl: 'Tasks'},
    {lbl: 'Projects'},
  ];

  const {title, showBackButton, customRightButton, showDetailButton} = props;

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
    <>
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
            {showDetailButton && (
              <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Entypo name="dots-two-vertical" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>
      {visible && (
        <View
          style={{
            backgroundColor: '#fff',
            // borderRadius: 5,
            position: 'absolute',
            top: '10%',
            zIndex: 1,
            right: 10,
            borderRadius: 5,
            width: '50%',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <View
            style={{
              paddingLeft: 20,
              paddingVertical: 15,
              borderBottomColor: '#000',
              borderBottomWidth: 0.5,
            }}>
            <Text style={{color: '#757575', fontSize: 18}}>
              Related records:
            </Text>
          </View>
          <FlatList
            data={data}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{borderBottomWidth: 0.5}}
                  onPress={() => setVisible(false)}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      paddingLeft: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 10,
                    }}>
                    {item.lbl}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </>
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
