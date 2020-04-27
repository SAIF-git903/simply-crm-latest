import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { commonStyles } from '../../styles/common';
import {
    HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
    HEADER_IMAGE_SELECTED_COLOR
} from '../../variables/themeColors';
import { saveSuccess } from '../../actions';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false };
    }

    componentDidMount() {
        //console.log('Mounting header');
    }

    onBackButtonPress() {
        //console.log(this.props.navigation);
        //console.log(this.props.navigation.goBack);
        this.props.dispatch(saveSuccess('not saved'));
        this.props.navigation.goBack(null);
    }
    onAddButtonPress() {
        this.props.callViewer(this);
    }
    renderBackButton() {
        if (this.props.width > 600) {
            //This is tablet
            if (this.props.isPortrait) {
                return (
                    <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                        <Icon
                            name='angle-left'
                            size={28}
                            color='white'
                        />
                    </TouchableOpacity>
                );
            }
            return undefined;
        } else {
            //This is phone
            return (
                <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                    <Icon
                        name='angle-left'
                        size={28}
                        color='white'
                    />
                </TouchableOpacity>
            );
        }
    }
    renderLoading() {
        return (
            <View>
                <ActivityIndicator color={'white'} />
            </View>
        );
    }
    renderSaveButton() {
        return (
            <Icon
                style={{ alignSelf: 'flex-end' }}
                name='save'
                solid
                size={28}
                color='white'
            />
        );
    }

    render() {
        return (
            <View style={commonStyles.headerBackground}>
                <View style={commonStyles.headerContentStyle}>
                    {
                        this.renderBackButton()
                    }
                    <Text style={styles.headerTextStyle}>{this.props.moduleLable}</Text>
                    <TouchableOpacity onPress={this.onAddButtonPress.bind(this)}>
                        <View
                            style={{
                                width: 50,
                                height: 30,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {(this.state.loading) ? this.renderLoading() : this.renderSaveButton()}
                        </View>
                    </TouchableOpacity>
                </View>
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

