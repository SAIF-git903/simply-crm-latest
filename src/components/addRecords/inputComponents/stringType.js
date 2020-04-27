import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { DRAWER_SECTION_HEADER_BACKGROUND_COLOR } from '../../../variables/themeColors';
import store from '../../../store';
import { copyAddress } from '../../../helper';
// import { connect } from 'react-redux';
// import { saveData } from '../../../actions';
import { fontStyles } from '../../../styles/common';



class StringType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveValue: this.props.obj.default,
            fieldName: this.props.obj.name
        };
    }

    onTextInputChange(text) {
        //console.log(text);
        this.setState({ ...this.state, saveValue: text });
    }

    render() {
        const mandatory = this.props.obj.mandatory;
        const type = this.props.obj.type.name;
        const amp = '&amp;';

        const validLable = (this.props.obj.lable.indexOf(amp) !== -1) ? this.props.obj.lable.replace('&amp;', '&') : this.props.obj.lable;

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
                    {

                        (type === 'email') ?
                            <TextInput
                                placeholder={validLable}
                                autoCorrect={false}
                                autoCapitalize='none'
                                style={[styles.label, fontStyles.fieldValue, { paddingLeft: 0 }]}
                                keyboardType='email-address'
                                value={this.state.saveValue}
                                onChangeText={this.onTextInputChange.bind(this)}
                                placeholderTextColor={'#C5C5C5'}
                            />
                            :
                            <TextInput
                                placeholder={validLable}
                                autoCorrect={false}
                                autoCapitalize='none'
                                style={[styles.label, fontStyles.fieldValue, { paddingLeft: 0 }]}
                                value={this.state.saveValue}
                                onChangeText={this.onTextInputChange.bind(this)}
                                placeholderTextColor={'#C5C5C5'}
                            />
                    }
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        inputHolder: {
            flex: 1,
            flexDirection: 'row',
            marginTop: 10,
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
    }
);

export default StringType;
