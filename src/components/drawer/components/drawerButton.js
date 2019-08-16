import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { drawerButtonPress } from '../../../actions';
import { DRAWER_MODULE_BUTTON_BACKGROUND, DRAWER_MODULE_BUTTON_BORDER_BACKGROUND,
    DRAWER_MODULE_BUTTON_SELECTED_BORDER_BACKGROUND, DRAWER_MODULE_BUTTON_SELECTED_BACKGROUND,
    DRAWER_MODULE_BUTTON_TEXT_COLOR, DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR 
} from '../../../variables/themeColors';
      
class DrawerButton extends Component {
    onButtonPress() {
        this.props.dispatch(drawerButtonPress(this.props.module.name, 
            this.props.module.label, this.props.module.id));
    }

    render() {
       return (
        <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
            <View 
            style={(this.props.selectedButton === this.props.module.name) ? 
            [styles.drawerButtonStyleSelected, { width: (this.props.width > 600) ? 60 : 75 }] : 
            [styles.drawerButtonStyle, { width: (this.props.width > 600) ? 60 : 75 }]}
            >
                <View style={styles.drawerButtonImageHolderStyle}>
                    <Image 
                    resizeMode="contain"
                    style={(this.props.selectedButton === this.props.module.name) ? 
                    { position: 'absolute', top: 10, bottom: 10, right: 10, left: 10, tintColor: DRAWER_MODULE_BUTTON_SELECTED_BORDER_BACKGROUND } : 
                    { position: 'absolute', top: 10, bottom: 10, right: 10, left: 10, tintColor: DRAWER_MODULE_BUTTON_BORDER_BACKGROUND }}
                    source={{ uri: (this.props.custom) ? 'custom' : this.props.module.name.toLowerCase() }} 
                    />
                </View>
                <Text 
                numberOfLines={1} 
                style={(this.props.selectedButton === this.props.module.name) ? 
                styles.drawerButtonTextStyleSelected : styles.drawerButtonTextStyle}
                >
                {this.props.module.label}
                </Text> 
            </View>
        </ TouchableOpacity>
       );
    }
}

const styles = StyleSheet.create({
    drawerButtonStyle: {
        flex: 1,
        borderColor: DRAWER_MODULE_BUTTON_BORDER_BACKGROUND,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: DRAWER_MODULE_BUTTON_BACKGROUND,
        padding: 3,
    },
    drawerButtonStyleSelected: {
        flex: 1,
        borderColor: DRAWER_MODULE_BUTTON_SELECTED_BORDER_BACKGROUND,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: DRAWER_MODULE_BUTTON_SELECTED_BACKGROUND,
        padding: 3,
    },
    drawerButtonImageHolderStyle: {
        padding: 10,
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerButtonTextStyle: {
        fontSize: 10,
        flex: 1,
        textAlign: 'center',
        color: DRAWER_MODULE_BUTTON_TEXT_COLOR
    },
    drawerButtonTextStyleSelected: {
        fontSize: 10,
        flex: 1,
        textAlign: 'center',
        color: DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR
    }
});

const mapStateToProps = ({ drawer, event }) => {
    const { selectedButton } = drawer;
    const { width } = event;
    return { selectedButton, width };    
};

export default connect(mapStateToProps)(DrawerButton);
