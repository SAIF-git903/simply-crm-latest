import React from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Button = props => (
  <TouchableOpacity {...props}>{props.children}</TouchableOpacity>
);

export default function IconTabBar(props) {
  const {
    activeTextColor,
    inactiveTextColor,
    textStyle,
    tabs,
    activeTab,
    goToPage,
    containerWidth,
    scrollValue,
    tabIcons,
  } = props;

  function renderTab(name, page, isTabActive, onPressHandler) {
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontFamily = isTabActive ? 'Poppins-Medium' : 'Poppins-Regular';

    return (
      <Button
        style={{flex: 1}}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}>
        <View style={[styles.tab, props.tabStyle]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 10,
            }}>
            {renderIcon(tabIcons[page], isTabActive)}
            <Text style={[{color: textColor, fontFamily}]}>{name}</Text>
          </View>
        </View>
      </Button>
    );
  }

  function renderTabs() {
    return tabs.map((name, index) => {
      const isTabActive = activeTab === index;
      return renderTab(name, index, isTabActive, goToPage);
    });
  }

  function renderIcon(icon, isTabActive) {
    if (!icon) return null;
    const iconColor = isTabActive ? activeTextColor : inactiveTextColor;
    return (
      <Icon
        name={icon}
        size={18}
        color={iconColor}
        style={{paddingRight: 5, marginTop: -2}}
      />
    );
  }

  const numberOfTabs = tabs.length;
  const tabUnderlineStyle = {
    position: 'absolute',
    width: containerWidth / numberOfTabs,
    height: 4,
    backgroundColor: 'navy',
    bottom: 0,
  };

  const translateX = scrollValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth / numberOfTabs],
  });

  return (
    <View
      style={[
        styles.tabs,
        {
          backgroundColor: 'white',
        },
        props.style,
      ]}>
      {renderTabs()}
      <Animated.View
        style={[
          tabUnderlineStyle,
          {
            transform: [{translateX}],
          },
          props.underlineStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});
