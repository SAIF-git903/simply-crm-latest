import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { commonStyles } from '../../styles/common';
import {
    HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
    HEADER_IMAGE_SELECTED_COLOR
} from '../../variables/themeColors';
import { addRecordHelper } from '../../helper';
import { saveSuccess } from '../../actions';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dialogueVisible: false,
            copyFrom: 'Contacts'
        };
    }

    componentDidMount() {
        //console.log('Mounting header');
    }

    componentWillReceiveProps(newprops) {
        this.props = newprops;

        if (this.props.moduleName === 'Invoice') {
            if (this.props.contactAddress.length > 0 && this.props.organisationAddress.length === 0) {
                //copy contact
                this.setState({ copyFrom: 'Contacts', dialogueSelectedValue: { label: 'Contacts', value: 0, selected: true } }, () => { this.props.showCopyOptions(this); });
            } else if (this.props.contactAddress.length === 0 && this.props.organisationAddress.length > 0) {
                //copy organisation
                this.setState({ copyFrom: 'Organisation', dialogueSelectedValue: { label: 'Organisation', value: 1, selected: true } }, () => { this.props.showCopyOptions(this); });
            } else if (this.props.contactAddress.length > 0 && this.props.organisationAddress.length > 0) {
                //copy user choice
                this.setState({ dialogueVisible: true });
            }
        }
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
        if (this.props.width > 600) {
            //This is tablet
            if (this.props.isPortrait) {
                return (
                    <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                        <FontAwesomeIcon
                            icon={faAngleLeft}
                            color={'white'}
                            size={30}
                        />
                    </TouchableOpacity>
                );
            }
            return undefined;
        } else {
            //This is phone
            return (
                <TouchableOpacity onPress={this.onBackButtonPress.bind(this)}>
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        color={'white'}
                        size={30}
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

            <FontAwesomeIcon
                icon={faSave}
                color={'white'}
                size={30}
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
                    style={commonStyles.headerContentStyle}
                >
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

                </SafeAreaView>
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

const mapStateToProp = ({ event, recordViewer }) => {
    const { isPortrait, width, height } = event;
    const { contactAddress, organisationAddress } = recordViewer;
    return { isPortrait, width, height, contactAddress, organisationAddress };
};

export default connect(mapStateToProp)(Header);

