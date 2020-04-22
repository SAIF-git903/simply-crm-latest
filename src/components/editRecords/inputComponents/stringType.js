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
        return (
            <View style={styles.inputHolder}>
                {
                    (mandatory) ?
                        <View style={styles.mandatory}>
                            <Text style={[fontStyles.fieldLabel, { color: 'red', fontSize: 16 }]}>*</Text>
                        </View>
                        :
                        // undefined
                        <View style={styles.mandatory} />
                }
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.label, fontStyles.fieldLabel]}>{this.props.obj.lable}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {

                        (type === 'email') ?
                            <TextInput
                                placeholder={this.props.obj.lable}
                                autoCorrect={false}
                                autoCapitalize='none'
                                style={[styles.label, fontStyles.fieldValue]}
                                keyboardType='email-address'
                                value={this.state.saveValue}
                                onChangeText={this.onTextInputChange.bind(this)}
                                placeholderTextColor={'#C5C5C5'}
                            />
                            :
                            <TextInput
                                placeholder={this.props.obj.lable}
                                autoCorrect={false}
                                autoCapitalize='none'
                                style={[styles.label, fontStyles.fieldValue]}

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
            padding: 10
        },
        mandatory: {
            width: 10,
            height: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
        },
    }
);

export default StringType;
