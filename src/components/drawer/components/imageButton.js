import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Image } from 'react-native';
import { drawerButtonPress } from '../../../actions';
import {
    DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR, DRAWER_SECTION_HEADER_TEXT_COLOR,
    DRAWER_SECTION_HEADER_IMAGE_COLOR
} from '../../../variables/themeColors';
import { ACCOUNTS, CONTACTS, HOME } from '../../../variables/constants';
import { fontStyles } from '../../../styles/common';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';

class ImageButton extends Component {

    constructor(props) {
        super(props);
        // this.state = { iconName: faTachometerAlt };
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
                // this.setState({ iconName: faBuilding });
                break;

            case CONTACTS:
                // this.setState({ iconName: faUser });
                break;

            default:


        }
    }


    render() {
        // console.log(this.props.selectedButton, this.props.type);
        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this.onButtonPress.bind(this)}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',

                    }}
                >
                    <View
                        style={{ paddingLeft: 15, width: 46 }}
                    >
                        <Icon
                            name={this.props.icon}
                            size={20}
                            color={(this.props.selectedButton !== this.props.type) ? DRAWER_SECTION_HEADER_TEXT_COLOR : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR}
                        />
                    </View>
                    <Text style={[fontStyles.drawerMenuButtonText, { color: this.props.selectedButton === this.props.type ? DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR : DRAWER_SECTION_HEADER_IMAGE_COLOR }]}>{this.props.label}</Text>
                </View>
            </ TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    iconStyle: {
        marginRight: 10,
        marginLeft: 10
    },
});

const mapStateToProps = ({ drawer }) => {
    const { selectedButton } = drawer;
    return { selectedButton };
};

export default connect(mapStateToProps)(ImageButton);
