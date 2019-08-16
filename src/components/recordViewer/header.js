import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../styles/common';
import { HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
HEADER_IMAGE_SELECTED_COLOR } from '../../variables/themeColors';

class Header extends Component {
    componentDidMount() {
        //console.log('Mounting header');
    }

    onBackButtonPress() {
        //console.log(this.props.navigation);
        //console.log(this.props.navigation.goBack);
        this.props.navigation.goBack(null);
    }

    renderBackButton() {
        if (this.props.width > 600) {
            //This is tablet
            if (this.props.isPortrait) {
                return (
                    <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                        <Image 
                        source={{ uri: 'leftarrow' }}
                        style={{ 
                            width: 30,
                            resizeMode: 'contain',  
                            tintColor: HEADER_IMAGE_COLOR,
                            height: 40 }}
                        />
                    </TouchableOpacity>
                );
            }
            return undefined;
        } else {
            //This is phone
            return (
                <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                    <Image 
                    source={{ uri: 'leftarrow' }}
                    style={{ 
                        width: 30,
                        resizeMode: 'contain',  
                        tintColor: HEADER_IMAGE_COLOR,
                        height: 40 }}
                    />
                </TouchableOpacity>
            );
        }
    }

    render() {
        return (
            <View style={commonStyles.headerBackground}>
                {
                    this.renderBackButton()
                }
                <Text style={styles.headerTextStyle}>Record Details</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerTextStyle: {
        color: HEADER_TEXT_COLOR,
        flex: 1,
        fontSize: 15,
        textAlign: 'center'
    }
});

const mapStateToProp = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProp)(Header);

