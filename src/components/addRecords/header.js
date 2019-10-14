import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { commonStyles } from '../../styles/common';
import { HEADER_TEXT_COLOR, HEADER_IMAGE_COLOR,
HEADER_IMAGE_SELECTED_COLOR } from '../../variables/themeColors';
import { addRecordHelper } from '../../helper';
import { saveSuccess } from '../../actions';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false,
                        dialogueVisible: false,
                        copyFrom: 'Contacts'  
                    };
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
    renderLoading() {
        return (
            <View>
                <ActivityIndicator color={'white'} />
            </View>
        );
    }
    renderSaveButton() {
        return (
            
            <Image 
            source={{ uri: 'save' }}
            style={{ 
                width: 25,
                resizeMode: 'contain',  
                tintColor: HEADER_IMAGE_COLOR,
                height: 25 }}
            />
        );
    }

    render() {
        const copyOptions = [];
        copyOptions.push({ label: 'Contacts', value: 0 });
        copyOptions.push({ label: 'Organisation', value: 1 });
        return (
            <View style={commonStyles.headerBackground}>
                {
                    this.renderBackButton()
                }
                <Text style={styles.headerTextStyle}>{this.props.moduleLable}</Text>
                { //Invoice copy option
                (this.props.moduleName === 'Invoice') ? 
                  
                    <View style={{ width: 30, height: 30 }}>
                        <TouchableOpacity onPress={this.isCopyDialogueVisible.bind(this)}>
                            <Image 
                            source={{ uri: 'copy' }}
                            style={{ 
                                width: 25,
                                resizeMode: 'contain',  
                                tintColor: HEADER_IMAGE_COLOR,
                                height: 25 }}
                            />
                        </TouchableOpacity> 
                    </View> 
                :
                    undefined 
                }
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
                this.setState({ dialogueSelectedValue: result.selectedItem, dialogueVisible: false, copyFrom: result.selectedItem.label }, () => { this.onShowCopyOption(); });
            }}
            scrolled={false}    
            />
               
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

