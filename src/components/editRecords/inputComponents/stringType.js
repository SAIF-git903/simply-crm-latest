import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
// import { connect } from 'react-redux';
// import { saveData } from '../../../actions';
import { fontStyles } from '../../../styles/common';


class StringType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveValue: this.props.obj.default,
            fieldName: this.props.obj.name,
            error: null,
            showError: false
        };
    }


    onTextInputChange(text) {
        const type = this.props.obj.type.name;
        let errorMsg = null;

        switch (type) {
            case 'email':
                errorMsg = this.validateEmail(text) ? null : 'Invalid e-mail address';
                break;

            case 'url':
                errorMsg = this.validateUrl(text) ? null : 'Invalid website address';
                break;

            default:
                break;
        }

        this.setState({
            ...this.state,
            saveValue: text,
            error: text.length !== 0
                ? errorMsg
                : null,
            showError: false
        });
    }

    validateEmail(text) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)
    }

    validateUrl(text) {
        const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return regexp.test(text);
    }

    render() {
        const mandatory = this.props.obj.mandatory;
        const type = this.props.obj.type.name;
        return (
            <View style={styles.inputHolder}>
                <View style={{ flex: .5, justifyContent: 'flex-start' }}>
                    <Text style={[styles.label, fontStyles.fieldLabel]}>{this.props.obj.lable}</Text>
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
                            <View>
                                {
                                    this.state.showError
                                        ? <Text style={[
                                            fontStyles.fieldValue,
                                            {
                                                fontSize: 12,
                                                position: 'absolute',
                                                top: -4,
                                                color: 'red'
                                            }
                                        ]}>
                                            {this.state.error}
                                        </Text>
                                        : null
                                }
                                <TextInput
                                    autoGrow={true}
                                    placeholder={this.props.obj.lable}
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    style={[
                                        styles.label,
                                        fontStyles.fieldValue,
                                        {
                                            paddingLeft: 0,
                                            color: this.state.showError ? 'red' : fontStyles.fieldValue.color,
                                        }]}
                                    keyboardType='email-address'
                                    value={this.state.saveValue}
                                    onChangeText={this.onTextInputChange.bind(this)}
                                    placeholderTextColor={'#C5C5C5'}
                                />
                            </View>
                            :
                            <View>
                                {
                                    this.state.showError
                                        ? <Text style={[
                                            fontStyles.fieldValue,
                                            {
                                                fontSize: 12,
                                                position: 'absolute',
                                                top: -4,
                                                color: 'red'
                                            }
                                        ]}>
                                            {this.state.error}
                                        </Text>
                                        : null
                                }
                                <TextInput
                                    autoGrow={true}
                                    placeholder={this.props.obj.lable}
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    style={[
                                        styles.label,
                                        fontStyles.fieldValue,
                                        {
                                            paddingLeft: 0,
                                            color: this.state.showError ? 'red' : fontStyles.fieldValue.color,
                                        }]}
                                    value={this.state.saveValue}
                                    onChangeText={this.onTextInputChange.bind(this)}
                                    placeholderTextColor={'#C5C5C5'}
                                />
                            </View>
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
