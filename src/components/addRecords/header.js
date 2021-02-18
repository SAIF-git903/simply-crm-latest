import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { commonStyles, fontStyles } from '../../styles/common';
import { saveSuccess } from '../../actions';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dialogueVisible: false,
            copyFrom: 'Contacts',
            recordId: this.props.recordId
        };
    }

    onBackButtonPress() {
        this.props.dispatch(saveSuccess('not saved'));
        this.props.navigation.goBack(null);
    }

    onAddButtonPress() {
        this.props.callViewer(this);
    }

    onShowCopyOption() {
        this.props.showCopyOptions(this);
    }

    renderBackButton() {
        if (this.props.width > 600 && !this.props.isPortrait) {
            //TODO dont know why
            //when this is Landscape tablet
            return null;
        }

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

    getSaveButton() {
        let view;
        if (this.state.loading) {
            view = (
                <View>
                    <ActivityIndicator color={'white'} />
                </View>
            );
        } else {
            view = (
                <Icon
                    style={{ alignSelf: 'flex-end' }}
                    name='save'
                    solid
                    size={28}
                    color='white'
                />
            );
        }
        return view;
    }

    getCopyView() {
        let view = null;
        if (!this.props.recordId) {
            const copyOptions = [];
            copyOptions.push({ label: 'Contacts', value: 0 });
            copyOptions.push({ label: 'Organisation', value: 1 });
            view = (
                <SinglePickerMaterialDialog
                    title={'Copy Billing & Shipping Address From'}
                    items={copyOptions}
                    visible={this.state.dialogueVisible}
                    selectedItem={this.state.dialogueSelectedValue}
                    onCancel={() => this.setState({ dialogueVisible: false })}
                    onOk={(result) => {
                        this.setState({
                            dialogueSelectedValue: result.selectedItem,
                            dialogueVisible: false,
                            copyFrom: result.selectedItem.label
                        }, () => {
                            this.onShowCopyOption();
                        });
                    }}
                    scrolled={false}
                />
            );
        }
        return view;
    }

    render() {
        return (
            <View style={commonStyles.headerBackground}>
                <SafeAreaView
                    forceInset={{ top: 'always', bottom: 'never' }}
                >
                    <View style={commonStyles.headerContentStyle}>
                        <View style={{ width: 40 }}>
                            {this.renderBackButton()}
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[fontStyles.navbarTitle, { textAlign: 'center' }]}>
                                {this.props.moduleLable}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={this.onAddButtonPress.bind(this)}>
                            <View
                                style={{
                                    minWidth: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {this.getSaveButton()}
                            </View>
                        </TouchableOpacity>

                        {this.getCopyView()}
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
