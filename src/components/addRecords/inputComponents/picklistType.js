import React, { Component } from 'react';
import { View, StyleSheet, Text, Picker, } from 'react-native';
import { fontStyles } from '../../../styles/common';

class PickListType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveValue: (this.props.obj.lable === 'Company country') ? '' : this.props.obj.type.defaultValue,
            fieldName: this.props.obj.name
        };
    }
    render() {
        const mandatory = this.props.obj.mandatory;
        let options = [];
        options = this.props.obj.type.picklistValues;

        const amp = '&amp';

        const validLable = (this.props.obj.lable.indexOf(amp) !== -1) ? this.props.obj.lable.replace('&amp;', '&') : this.props.obj.lable;

        // console.log(validLable);
        // if (validLable === 'Company country') {
        //     this.setState({ saveValue: '' });
        // }
        // console.log(this.state.saveValue);
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
                    <Text style={[styles.label, fontStyles.fieldLabel]}>{validLable}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.saveValue}
                        onValueChange={(itemValue) => {
                            if (itemValue !== 0) {
                                this.setState({ saveValue: itemValue });
                            }
                        }
                        }
                    >
                        <Picker.Item label='Please Select' value={0} />
                        {options.map((item, index) => {
                            return (<Picker.Item label={item.label} value={item.value} key={index} />);
                        })}
                    </Picker>
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

export default PickListType;
