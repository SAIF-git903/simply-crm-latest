import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import SafeAreaView from 'react-native-safe-area-view';


import { commonStyles } from '../../styles/common';
import {
    HEADER_TEXT_COLOR
} from '../../variables/themeColors';
import { saveSuccess } from '../../actions';
import { fontStyles } from '../../styles/common'

import Icon from 'react-native-vector-icons/FontAwesome5Pro';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dialogueVisible: false,
            copyFrom: 'Contacts'
        };
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

    onShowCopyOption() {
        this.props.showCopyOptions(this);
    }
    isCopyDialogueVisible() {
        this.setState({ dialogueVisible: true });
    }
    renderBackButton() {
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
        const copyOptions = [];
        copyOptions.push({ label: 'Contacts', value: 0 });
        copyOptions.push({ label: 'Organisation', value: 1 });


        return (
            <View style={commonStyles.headerBackground}>
                <SafeAreaView
                    forceInset={{ top: 'always' }}
                >
                    <View
                        style={commonStyles.headerContentStyle}
                    >
                        <View style={{ width: 40 }}>
                            {
                                this.renderBackButton()
                            }
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[fontStyles.navbarTitle, { textAlign: 'center' }]}>{this.props.moduleLable}</Text>
                        </View>
                        <TouchableOpacity onPress={this.onAddButtonPress.bind(this)}>
                            <View
                                style={{
                                    minWidth: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {(this.state.loading) ? this.renderLoading() : this.renderSaveButton()}
                            </View>
                        </TouchableOpacity>


                        <SinglePickerMaterialDialog
                            title={'Copy Billing & Shipping Address From'}
                            items={copyOptions}
                            visible={this.state.dialogueVisible}
                            selectedItem={this.state.dialogueSelectedValue}
                            onCancel={() => this.setState({ dialogueVisible: false })}
                            onOk={(result) => {
                                // console.log(result.selectedItem);
                                this.setState({ dialogueSelectedValue: result.selectedItem, dialogueVisible: false, copyFrom: result.selectedItem.label }, () => { this.onShowCopyOption(); });
                            }}
                            scrolled={false}
                        />

                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

const mapStateToProp = ({ event, recordViewer }) => {
    const { isPortrait, width, height } = event;
    const { contactAddress, organisationAddress } = recordViewer;
    return { isPortrait, width, height, contactAddress, organisationAddress };
};

export default connect(mapStateToProp)(Header);

