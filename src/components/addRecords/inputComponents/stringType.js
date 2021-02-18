import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { fontStyles, commonStyles } from '../../../styles/common';

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
        let errorMsg = null;

        switch (this.props.obj.type.name) {
            case 'email':
                errorMsg = (this.validateEmail(text)) ? null : 'Invalid e-mail address';
                break;
            case 'url':
                errorMsg = (this.validateUrl(text)) ? null : 'Invalid website address';
                break;
            default:
                break;
        }

        this.setState({
            ...this.state,
            saveValue: text,
            error: (text.length !== 0) ? errorMsg : null,
            showError: false
        });
    }

    validateEmail(text) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text);
    }

    validateUrl(text) {
        const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return regexp.test(text);
    }

    doRender() {
        let keyboardType;
        if (this.props.obj.type.name === 'email') {
            keyboardType = 'email-address';
        } else {
            keyboardType = 'default';
        }
        return (
            <View>
                {this.getErrorView()}
                <TextInput
                    autoGrow={true}
                    placeholder={this.props.validLable}
                    autoCorrect={false}
                    autoCapitalize='none'
                    style={[
                        commonStyles.label,
                        fontStyles.fieldValue,
                        {
                            paddingLeft: 0,
                            color: (this.state.showError) ? 'red' : fontStyles.fieldValue.color,
                        }
                    ]}
                    keyboardType={keyboardType}
                    value={this.state.saveValue}
                    onChangeText={this.onTextInputChange.bind(this)}
                    placeholderTextColor={'#C5C5C5'}
                />
            </View>
        );
    }

    getErrorView() {
        let view = null;
        if (this.state.showError) {
            view = (
                <Text style={[
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
            );
        }
        return view;
    }

    render() {
        return (
            <View style={commonStyles.inputHolder}>
                {this.props.fieldLabelView}
                <View style={{ flex: 1 }}>
                    {this.doRender()}
                </View>
            </View>
        );
    }
}

export default StringType;
