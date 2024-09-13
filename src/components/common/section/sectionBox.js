import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

export default function SectionBox({children, style}) {
  return (
    <View style={[styles.wrapper, style]}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
    paddingHorizontal: 15,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderRadius: 3,
    backgroundColor: 'white',
  },
});
