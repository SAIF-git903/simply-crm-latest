import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableWithoutFeedback, } from 'react-native';
import { fontStyles } from '../../../styles/common';

class BooleanType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false,
            saveValue: '0',
            fieldName: this.props.obj.name
        };
    }
    toggle() {
        this.setState(
            { checked: !this.state.checked },
            () => this.changeSaveValue(),
        );
    }

    changeSaveValue() {
        (this.state.checked) ? this.setState({ saveValue: '1' }) : this.setState({ saveValue: '0' });
    }

    render() {
        const mandatory = this.props.obj.mandatory;
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
                <View style={{ flex: .5, justifyContent: 'center' }}>
                    <Text style={[styles.label, fontStyles.fieldLabel]}>{this.props.obj.lable}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>

                    <TouchableWithoutFeedback onPress={this.toggle.bind(this)}>
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                borderColor: '#ddd',
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {
                                (this.state.checked || this.state.saveValue === '1') ?
                                    <Image
                                        source={{ uri: 'tick' }}
                                        style={{
                                            width: 35,
                                            resizeMode: 'contain',
                                            height: 25,
                                            tintColor: 'green'
                                        }}
                                    />
                                    :
                                    null
                            }
                        </View>
                    </TouchableWithoutFeedback>

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
            marginVertical: 10,
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

export default BooleanType;
