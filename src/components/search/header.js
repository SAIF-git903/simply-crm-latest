import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../styles/common';
import { tabletSearchBackPress } from '../../actions';
import {
    HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
    HEADER_IMAGE_SELECTED_COLOR
} from '../../variables/themeColors';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        };
    }

    onBackButtonPress() {
        this.props.onBack();
    }

    onTabletBackButtonPress() {
        this.props.tabletSearchBackPress();
    }

    onSearchButtonPress() {
        this.props.onSearch();
    }

    searchTextChange(text) {
        this.setState({
            searchText: text
        });
        this.props.searchTextChange(text);
    }

    renderBackButton() {
        if (this.props.width < 600) {
            //This is Phone
            return (
                <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                    <Image
                        source={{ uri: 'leftarrow' }}
                        style={{
                            width: 30,
                            resizeMode: 'contain',
                            tintColor: HEADER_IMAGE_COLOR,
                            height: 40
                        }}
                    />
                </TouchableOpacity>
            );
        } else if (!this.props.isPortrait) {
            //This is Tablet landscape
            return (
                <TouchableOpacity onPress={this.onTabletBackButtonPress.bind(this)}>
                    <Image
                        source={{ uri: 'leftarrow' }}
                        style={{
                            width: 30,
                            resizeMode: 'contain',
                            tintColor: HEADER_IMAGE_COLOR,
                            height: 40
                        }}
                    />
                </TouchableOpacity>
            );
        } else {
            //This is tablet portrait
            return (
                <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                    <Image
                        source={{ uri: 'leftarrow' }}
                        style={{
                            width: 30,
                            resizeMode: 'contain',
                            tintColor: HEADER_IMAGE_COLOR,
                            height: 40
                        }}
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
                <TextInput
                    autoGrow={true}
                    clearButtonMode='always'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder='Enter search keyword here'
                    placeholderTextColor='#d3d3d3'
                    value={this.state.searchText}
                    onChangeText={this.searchTextChange.bind(this)}
                    style={styles.headerTextStyle}
                />
                <TouchableOpacity onPress={this.onSearchButtonPress.bind(this)}>
                    <Image
                        source={{ uri: 'search' }}
                        style={{
                            width: 27,
                            resizeMode: 'contain',
                            tintColor: HEADER_IMAGE_COLOR,
                            height: 27
                        }}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerTextStyle: {
        color: HEADER_TEXT_COLOR,
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15,
    }
});

const mapStateToProp = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProp, { tabletSearchBackPress })(Header);

