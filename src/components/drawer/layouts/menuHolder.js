import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faBuilding, faLuggageCart, faUser, faWrench, faShoppingCart, faFileInvoiceDollar, faSearchDollar, faEnvelope, faChartBar, faFileAlt, faCalendarAlt, faShield, faBoxOpen } from '@fortawesome/pro-regular-svg-icons';

import { drawerButtonPress } from '../../../actions';
import { DRAWER_MODULE_BUTTON_TEXT_COLOR, DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR,
    DRAWER_INNER_BACKGROUND, DRAWER_INNER_BORDER_COLOR, DRAWER_SECTION_HEADER_TEXT_COLOR, DRAWER_SECTION_HEADER_IMAGE_COLOR } from '../../../variables/themeColors';

class MenuHolder extends Component {

    // constructor(props) {
    //     super(props);
    //     // this.state = { iconName: faLuggageCart };
    // }

    componentWillMount() {
        // this.assignIcons();
    }
    onButtonPress() {
        this.props.dispatch(drawerButtonPress(this.props.module.name, 
            this.props.module.label, this.props.module.id));
    }

    assignIcons() {
        // switch (this.props.module.name) {
        //     case 'Accounts':
        //         this.setState({ iconName: faBuilding });
        //         break;
        //     case 'Sales':
        //         this.setState({ iconName: faLuggageCart });
        //         break;
        //     case 'Contacts': 
        //         this.setState({ iconName: faUser });
        //         break;
        //     case 'Tools':
        //         this.setState({ iconName: faWrench });
        //         break;
        //     case 'Products':
        //         this.setState({ iconName: faShoppingCart });
        //         break;
        //     case 'Invoice':
        //         this.setState({ iconName: faFileInvoiceDollar });
        //         break;
        //     case 'Potentials':
        //         this.setState({ iconName: faSearchDollar });
        //         break;
        //     case 'Emails':
        //         this.setState({ iconName: faEnvelope });
        //         break;
        //     case 'Reports':
        //         this.setState({ iconName: faChartBar });
        //         break;
        //     case 'Documents':
        //         this.setState({ iconName: faFileAlt });
        //         break;
        //     case 'Calendar':
        //         this.setState({ iconName: faCalendarAlt });
        //         break;
        //     case 'Vendors':
        //         this.setState({ iconName: faShield });
        //         break;
        //     case 'Services':
        //         this.setState({ iconName: faBoxOpen });
        //         break;
        //     default:


        // } 
    }

    render() {
        console.log(this.props.module.name.toLowerCase());
       return (
            <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
                <View style={[styles.holder]}>
                    {/* <View style={styles.image}>
                        <FontAwesomeIcon icon={this.state.iconName} size={23} color={(this.props.selectedButton !== this.props.module.name) ? DRAWER_SECTION_HEADER_IMAGE_COLOR : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR} />
                    </View> */}
                    
                    <Image 
                    source={{ uri: this.props.module.name.toLowerCase() }} 
                    style={[styles.image, { tintColor: (this.props.selectedButton !== this.props.module.name) ? DRAWER_SECTION_HEADER_IMAGE_COLOR : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR }]}
                     
                    />
                    <Text style={[styles.text, { color: (this.props.selectedButton !== this.props.module.name) ? DRAWER_SECTION_HEADER_TEXT_COLOR : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR }]}>{this.props.module.label}</Text>     
                </View>
            </TouchableOpacity>
       );
    }
}
const styles = StyleSheet.create({
    holder: {  
        backgroundColor: DRAWER_INNER_BACKGROUND,
        height: 50, 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: DRAWER_INNER_BORDER_COLOR,
       
    },
    image: {
        
        marginLeft: 40,
        marginRight: 10,
        width: 20,
        height: 20

    },
    text: {
        
            
        flex: 1,
        fontSize: 16
        
    },
  
});

const mapStateToProps = ({ drawer, event }) => {
    const { selectedButton } = drawer;
    const { width } = event;
    return { selectedButton, width };    
};

export default connect(mapStateToProps)(MenuHolder);
