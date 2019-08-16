import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { commonStyles } from './../styles/common';
import { HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
HEADER_IMAGE_SELECTED_COLOR } from './../variables/themeColors';

class DashboardHeader extends Component {
    componentDidMount() {
        //console.log('Mounting header');
    }

    onMenuButtonPress() {
        const { state } = this.props.navigation;
        if (state.routeName === 'DrawerOpen') {
          this.props.navigation.navigate('DrawerClose');      
        } else {
          this.props.navigation.navigate('DrawerOpen');
        }
      }

    renderMenuButton() {
        if (this.props.width > 600) {
            //This is tablet
            return undefined;
        } else {
            //This is phone
            return (
                <TouchableOpacity onPress={this.onMenuButtonPress.bind(this)}>
                    <Image 
                    source={{ uri: 'menu' }}
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
                    this.renderMenuButton()
                }
                <Text style={styles.headerTextStyle}>{this.props.moduleLable}</Text>
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

export default connect(mapStateToProp)(DashboardHeader);
