import { StyleSheet, Platform } from 'react-native';
import { HEADER_COLOR } from '../variables/themeColors';

export const commonStyles = StyleSheet.create({
    headerBackground: {
        width: '100%',
        padding: 10,
        paddingVertical: 15,
        paddingTop: Platform.OS === 'ios' ? 10 : 15,
        alignItems: 'center',
        backgroundColor: HEADER_COLOR
    },
    headerContentStyle: {
        flexDirection: 'row',
        width: '100%'
    },
    recordListerBackground: {
        flex: 1,
        backgroundColor: '#f2f3f8',
    },
    recordViewerBackground: {
        flex: 1,
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
    },
    contentBackground: {
        flex: 1,
        backgroundColor: 'white'
    },
    loadingDetailsStyle: {
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
    inputHolder: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        marginRight: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        padding: 10,
        paddingLeft: 20
    },
    mandatory: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: 5,
        width: 10,
        height: 25,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    textbox: {
        //paddingTop: 9,
        borderColor: '#ABABAB',
        borderWidth: 0.5,
        padding: 0,
        paddingLeft: 5,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 42,
        // height: 38,
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
        marginLeft: 5,
        borderWidth: 0,
        color: '#121212',
    },
    no_tittle: {
        marginLeft: 10,
        paddingRight: 10,
        fontStyle: 'italic',
        color: 'gray'
    },
});

export const fontStyles = StyleSheet.create({
    navbarTitle: {
        fontFamily: 'Poppins-Medium',
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        flex: 1,
        marginTop: 3
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
    fieldValueLocation: {
        fontFamily: 'Poppins-Regular',
        color: '#00BBF2',
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
    },
    calendarTitle: {
        fontFamily: 'Poppins-Medium',
        color: 'black',
        fontSize: 18
    },
    calendarText: {
        fontFamily: 'Poppins-Regular',
        color: '#707070',
        fontSize: 14
    },
    calendarTextMedium: {
        fontFamily: 'Poppins-Medium',
        color: '#707070',
        fontSize: 14
    }
});
