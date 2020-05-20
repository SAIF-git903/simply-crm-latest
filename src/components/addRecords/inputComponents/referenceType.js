import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { connect } from 'react-redux';
import { COPY_CONTACT_ADDRESS } from '../../../actions/types';
import { getUserName, getAddressDetails, getPriceDetails } from '../../../helper';
import { fontStyles } from '../../../styles/common';

const mapStateToProps = ({ recordViewer }) => {
    const { label, recordId, uniqueId } = recordViewer;
    return { label, recordId, uniqueId };
};

class ReferenceType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogueVisible: false,
            dialogueSelectedValue: undefined,
            referenceValue: this.props.defaultValue ? this.props.defaultValue.label : '',
            formId: 0,
            saveValue: this.props.defaultValue ? this.props.defaultValue.value : this.props.obj.default,
            fieldName: this.props.obj.name,
            selectedRefModule: ''
        };
    }

    componentWillMount() {
        this.setState({
            formId: this.props.formId,
            referenceValue: this.props.defaultValue ? this.props.defaultValue.label : this.props.label
            //referenceValue: label
        });
        this.assignUserId();
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;

        if (this.state.formId === this.props.uniqueId) {
            this.setState({
                referenceValue: this.props.label,
                saveValue: this.props.recordId,
                uniqueId: this.props.uniqueId
            }, () => {
                if (this.props.moduleName === 'Invoice') {
                    if (this.state.selectedRefModule === 'Contacts' || this.state.selectedRefModule === 'Accounts') {
                        this.assignAddress();
                    }
                    if (this.state.selectedRefModule === 'Products' || this.state.selectedRefModule === 'Services') {
                        this.assignPriceDetails();
                    }
                }
            });
        }
    }

    onReferencePress(type) {
        if (type.name === 'owner') {
            const { navigate } = this.props.navigate;
            navigate('ReferenceScreen', { selectedModule: 'Users', uniqueId: this.state.formId });
        } else {
            if (type.refersTo.length < 1) {
                Alert.alert('Empty', 'No references');
            } else {
                if (type.refersTo.length > 1) {
                    this.setState({ dialogueVisible: true });
                } else {
                    const { navigate } = this.props.navigate;
                    this.setState({ selectedRefModule: type.refersTo[0] });
                    navigate('ReferenceScreen', { selectedModule: type.refersTo[0], uniqueId: this.state.formId });
                }
            }
        }
    }

    assignUserId() {
        if (this.props.obj.name === 'assigned_user_id') {
            getUserName(this);
        }
    }

    assignAddress() {
        getAddressDetails(this, this.props.dispatch);
    }

    assignPriceDetails() {
        getPriceDetails(this);
    }

    render() {
        const mandatory = this.props.obj.mandatory;
        const type = this.props.obj.type;
        const { navigate } = this.props.navigate;
        const items = [];
        if (type.name !== 'owner') {
            const refersTo = type.refersTo;
            refersTo.map((row, index) => {
                items.push({ label: row, value: index });
            });
        }
        const amp = '&amp;';

        const validLable = (this.props.obj.lable.indexOf(amp) !== -1) ? this.props.obj.lable.replace('&amp;', '&') : this.props.obj.lable;

        // if (this.props.obj.name === 'assigned_user_id') {
        //     this.se
        // }
        return (
            <View style={styles.inputHolder}>
                <View style={{ flex: .5, justifyContent: 'flex-start' }}>
                    <Text style={[styles.label, fontStyles.fieldLabel]}>{validLable}</Text>
                    {
                        (mandatory) ?
                            <View style={styles.mandatory}>
                                <Text style={[fontStyles.fieldLabel, { color: 'red', fontSize: 16 }]}>*</Text>
                            </View>
                            :
                            // undefined
                            <View style={styles.mandatory} />
                    }
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={this.onReferencePress.bind(this, type)} >
                        <View style={styles.textbox}>
                            <Text numberOfLines={1} style={[styles.text, fontStyles.fieldValue]}>{this.state.referenceValue}</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                <SinglePickerMaterialDialog
                    title={'Choose one'}
                    items={items}
                    visible={this.state.dialogueVisible}
                    selectedItem={this.state.dialogueSelectedValue}
                    onCancel={() => this.setState({ dialogueVisible: false })}
                    onOk={(result) => {
                        //console.log(result);
                        if (result.selectedItem === undefined) {
                            //console.log('undefined');
                            this.setState({ dialogueVisible: false });
                        } else {
                            navigate('ReferenceScreen', { selectedModule: result.selectedItem.label, uniqueId: this.state.formId });
                            this.setState({ dialogueSelectedValue: result.selectedItem, selectedRefModule: result.selectedItem.label });
                            this.setState({ dialogueVisible: false });
                        }
                    }}
                    scrolled
                />

            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        inputHolder: {
            flex: 1,
            flexDirection: 'row',
            marginVertical: 10,
            marginRight: 2
        },
        label: {
            fontSize: 16,
            padding: 10,
            paddingLeft: 20
        },
        mandatory: {
            position: 'absolute',
            marginTop: 10,
            marginLeft: 5,
            width: 10,
            height: 25,
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        textbox: {
            //paddingTop: 9,
            borderColor: '#ABABAB',
            borderWidth: 0.5,
            padding: 0,
            paddingLeft: 5,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            height: 42,
            justifyContent: 'center'
        },
        text: {
            fontSize: 14,
            marginLeft: 5,
            borderWidth: 0,
            color: '#121212',
        },
    }
);


export default connect(mapStateToProps, null, null, { withRef: true })(ReferenceType);
// export default connect(mapStateToProps, null, null, { withRef: true })(ReferenceType);
//export default ReferenceType;
