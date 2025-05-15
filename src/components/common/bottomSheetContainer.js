import {Dimensions, StyleSheet} from 'react-native';
import {
  DRAWER_BORDER_COLOR,
  generalBgColor,
  headerIconColor,
} from '../../variables/themeColors';

export const bottomStyles = StyleSheet.create({
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // backgroundColor: '#FFF',
    backgroundColor: generalBgColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  serachBoxContainer: {
    flex: 1,
    paddingVertical: 8,
    fontFamily: 'Poppins-Regular',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#dfdfdf',
    marginTop: 12,
    marginBottom: 16,
    height: 45,
    paddingHorizontal: 10,
  },
  sectionListContainer: {
    height: Dimensions.get('screen').height * 0.71,
    borderColor: DRAWER_BORDER_COLOR,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  headertxt: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: headerIconColor,
  },
});
