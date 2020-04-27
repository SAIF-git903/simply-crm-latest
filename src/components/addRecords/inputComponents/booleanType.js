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
                            <View style={styles.mandatory} />
                    }
                </View>
                <TouchableWithoutFeedback onPress={this.toggle.bind(this)}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
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
                                (this.state.checked) ?
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
                    </View>
                </TouchableWithoutFeedback>

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
    }
);

export default BooleanType;
