import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';

import { drawerButtonPress } from '../../../actions';
import {
    DRAWER_MODULE_BUTTON_TEXT_COLOR, DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR,
    DRAWER_INNER_BACKGROUND, DRAWER_INNER_BORDER_COLOR, DRAWER_SECTION_HEADER_TEXT_COLOR, DRAWER_SECTION_HEADER_IMAGE_COLOR
} from '../../../variables/themeColors';

import { fontStyles } from '../../../styles/common';

class MenuHolder extends Component {

    constructor(props) {
        super(props);
        this.state = { iconName: 'luggage-cart' };
    }

    componentWillMount() {
        this.assignIcons();
    }
    onButtonPress() {
        this.props.dispatch(drawerButtonPress(this.props.module.name,
            this.props.module.label, this.props.module.id));
    }

    assignIcons() {
        switch (this.props.module.name) {
            case 'Accounts':
                this.setState({ iconName: 'building' });
                break;
            case 'Sales':
                this.setState({ iconName: 'luggage-cart' });
                break;
            case 'Contacts':
                this.setState({ iconName: 'user' });
                break;
            case 'Tools':
                this.setState({ iconName: 'wrench' });
                break;
            case 'Products':
                this.setState({ iconName: 'shopping-cart' });
                break;
            case 'Invoice':
                this.setState({ iconName: 'file-invoice-dollar' });
                break;
            case 'Potentials':
                this.setState({ iconName: 'search-dollar' });
                break;
            case 'Emails':
                this.setState({ iconName: 'envelope' });
                break;
            case 'Reports':
                this.setState({ iconName: 'chart-bar' });
                break;
            case 'Documents':
                this.setState({ iconName: 'file-alt' });
                break;
            case 'Calendar':
                this.setState({ iconName: 'calendar-alt' });
                break;
            case 'Vendors':
                this.setState({ iconName: 'shield' });
                break;
            case 'Services':
                this.setState({ iconName: 'box-open' });
                break;
            default:
        }
    }

    render() {
        // console.log(this.props.module.name.toLowerCase());
        return (
            <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
                <View style={[styles.holder]}>
                    <View style={styles.image}>
                        <Icon
                            name={this.state.iconName}
                            size={20}
                            color={(this.props.selectedButton !== this.props.module.name) ? DRAWER_SECTION_HEADER_IMAGE_COLOR : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR}
                        />
                    </View>

                    <Text style={[styles.text, fontStyles.drawerMenuButtonText, { color: (this.props.selectedButton !== this.props.module.name) ? DRAWER_SECTION_HEADER_TEXT_COLOR : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR }]}>{this.props.module.label}</Text>
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
        marginRight: -12,
        width: 46,
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
