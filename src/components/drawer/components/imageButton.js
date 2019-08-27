import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBuilding, faUser, faTachometerAlt } from '@fortawesome/pro-regular-svg-icons';
import { drawerButtonPress } from '../../../actions'; 
import { DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR, DRAWER_SECTION_HEADER_TEXT_COLOR,
    DRAWER_SECTION_HEADER_IMAGE_COLOR
} from '../../../variables/themeColors';   
import { ACCOUNTS, CONTACTS, HOME } from '../../../variables/constants';

class ImageButton extends Component {
    
    constructor(props) {
        super(props);
        this.state = { iconName: faTachometerAlt };
    }

    componentWillMount() {
        this.assignIcons();
    }

    onButtonPress() {
        if (this.props.type === HOME) {
            this.props.dispatch(drawerButtonPress(this.props.type));
        } else {
            this.props.dispatch(drawerButtonPress(this.props.module.name, 
                this.props.module.label, this.props.module.id));
        }   
    }

    assignIcons() {
        switch (this.props.type) {
            case ACCOUNTS:
                this.setState({ iconName: faBuilding });
                break;
           
            case CONTACTS: 
                this.setState({ iconName: faUser });
                break;
           
            default:


        } 
    }


    render() {
        console.log(this.props.type);
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={this.onButtonPress.bind(this)}>
                <View 
                style={{ 
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    }}
                >
            
                    <View style={styles.imageStyle}>
                        <FontAwesomeIcon icon={this.state.iconName} size={23} color={(this.props.selectedButton !== this.props.type) ? DRAWER_SECTION_HEADER_TEXT_COLOR : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR} />
                    </View>
                    
                    
                    {/* <Image 
                    source={{ uri: this.props.type }} 
                    style={(this.props.selectedButton === this.props.type) ? 
                    styles.imageStyleSelected : 
                    styles.imageStyle} 
                    /> */}
                
                
                    <Text style={(this.props.selectedButton === this.props.type) ? styles.textSelectedStyle : styles.textStyle}>{this.props.label}</Text>
                </View>
            </ TouchableOpacity>

        );  
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        height: 25,
        width: 25,
        marginRight: 10,
        marginLeft: 10
    },
    
    textStyle: {
        color: DRAWER_SECTION_HEADER_IMAGE_COLOR,
        fontSize: 16,

    },
    textSelectedStyle: {
        color: DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR,
        fontSize: 16
    }
});

const mapStateToProps = ({ drawer }) => {
    const { selectedButton } = drawer;
    return { selectedButton };    
};

export default connect(mapStateToProps)(ImageButton);
