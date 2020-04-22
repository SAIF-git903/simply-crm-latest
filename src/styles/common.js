import { StyleSheet, Platform } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { HEADER_COLOR } from '../variables/themeColors';

export const commonStyles = StyleSheet.create({
    headerBackground: {
        height: (Platform.OS === 'ios') ? (isIphoneX() ? 80 : 60) : 45,
        width: '100%',
        paddingTop: (Platform.OS === 'ios') ? (isIphoneX() ? 27 : 15) : 5,
        flexDirection: 'row',
        paddingRight: 10,
        position: 'absolute',
        paddingLeft: 10,
        alignItems: 'center',
        backgroundColor: HEADER_COLOR,
    },
    recordListerBackground: {
        flex: 1,
        backgroundColor: '#f2f3f8',
        marginTop: (Platform.OS === 'ios') ? (isIphoneX() ? 80 : 60) : 45,
    },
    recordViewerBackground: {
        flex: 1,
        marginTop: (Platform.OS === 'ios') ? (isIphoneX() ? 80 : 60) : 45,
        backgroundColor: 'white',
    },
    listModuleBackground: {
        width: '100%',
        height: '100%'
    },
    overlayBackground: {
        position: 'absolute',
        flex: 1,
        top: 5,
        right: 5,
        marginTop: (Platform.OS === 'ios') ? (isIphoneX() ? 80 : 60) : 45,
    },
    contentBackground: {
        flex: 1,
        marginTop: (Platform.OS === 'ios') ? (isIphoneX() ? 80 : 60) : 45,
        backgroundColor: 'white'
    },
    loadingDetailsStyle: {
        elevation: 3,
        width: '100%',
        height: 17,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        backgroundColor: 'white',
        position: 'absolute',
        shadowOpacity: 0.5,
        shadowOffset: { width: 5, height: 2 },
    },
    contentListBackground: {
        flex: 1,
        width: '100%',
        marginTop: 17
    },
    itemSeparatorStyle: {
        width: '100%',
        height: 1,
        backgroundColor: '#d3d3d3'
    },
});

export const fontStyles = StyleSheet.create({
    navbarTitle: {
        fontFamily: 'Poppins-Medium',
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        flex: 1
    },
    sectionTitle: {
        fontFamily: 'Poppins-Medium',
        color: '#707070',
        fontSize: 18
    },
    fieldLabel: {
        fontFamily: 'Poppins-Regular',
        color: '#707070',
        fontSize: 12
    },
    fieldValue: {
        fontFamily: 'Poppins-Regular',
        color: 'black',
        fontSize: 18
    },
    dashboardRecordLabel: {
        fontFamily: 'Poppins-Regular',
        color: '#707070',
        fontSize: 12
    },
    dashboardRecordLabelBig: {
        fontFamily: 'Poppins-Regular',
        color: 'black',
        fontSize: 18
    },
    iconButtonLabel: {
        fontFamily: 'Poppins-Medium',
        color: '#38414e',
        fontSize: 12
    },
    loginInputFieldLabel: {
        fontFamily: 'Poppins-Regular',
        color: 'white',
        fontSize: 18
    },
    forgotPasswordLabel: {
        fontFamily: 'Poppins-Regular',
        color: 'white',
        fontSize: 14
    },
    loginButtonLabel: {
        fontFamily: 'Poppins-Regular',
        color: 'black',
        fontSize: 16
    },
    signUpLabel: {
        fontFamily: 'Poppins-Regular',
        color: 'white',
        fontSize: 14
    },
    searchBoxLabel: {
        fontFamily: 'Poppins-Regular',
        color: '#707070',
        fontSize: 16
    },
    drawerMenuButtonText: {
        fontFamily: 'Poppins-Regular',
        color: '#AAB1B6',
        fontSize: 16
    }
});
