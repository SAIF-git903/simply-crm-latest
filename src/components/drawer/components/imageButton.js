import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { View, Alert, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { DRAWER_MENU_BUTTON_IMAGE_SELECTED_COLOR, DRAWER_MENU_BUTTON_IMAGE_COLOR,
    DRAWER_MENU_BORDER_COLOR } from '../../../variables/themeColors';    
import { drawerButtonPress } from '../../../actions';    
import { LOGOUT, REBRAND, SMACKCODERS_SUPPORT } from '../../../variables/constants';
import { removeAllDatabase } from '../../../helper';

class ImageButton extends Component {
    onButtonPress() {
        if (this.props.type === LOGOUT) {
            Alert.alert('Logout !', 'Are you sure all your offline data will be deleted?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Ok', onPress: this.logout.bind(this) },
            ],
            { cancelable: true }
            );
        } else if (this.props.type === REBRAND) {
            Linking.openURL('https://www.smackcoders.com/vtiger-mobile-branding.html').catch(err => console.error('An error occured', err));
        } else if (this.props.type === SMACKCODERS_SUPPORT) {
            Linking.openURL('https://www.smackcoders.com/contact-us.html').catch(err => console.error('An error occured', err));
        } else {
            this.props.dispatch(drawerButtonPress(this.props.type));
        }
    }

    logout() {
        removeAllDatabase(this.navigateToSplash.bind(this));
    }

    navigateToSplash() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'SplashScreen' })
            ]
          });
          this.props.rootNavigation.dispatch(resetAction);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
                <View 
                style={{ 
                    width: 40, 
                    flex: 1,
                    paddingTop: 4,
                    borderColor: DRAWER_MENU_BORDER_COLOR,
                    justifyContent: 'center' }}
                >
                    <Image 
                    source={{ uri: this.props.type }} 
                    style={(this.props.selectedButton === this.props.type) ? 
                    styles.imageStyleSelected : 
                    styles.imageStyle} 
                    />
                </View>
            </ TouchableOpacity>
        );  
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        height: 35,
        width: 35,
        tintColor: DRAWER_MENU_BUTTON_IMAGE_COLOR
    },
    imageStyleSelected: {
        width: 35,
        height: 35,
        tintColor: DRAWER_MENU_BUTTON_IMAGE_SELECTED_COLOR
    }
});

const mapStateToProps = ({ drawer }) => {
    const { selectedButton } = drawer;
    return { selectedButton };    
};

export default connect(mapStateToProps)(ImageButton);
