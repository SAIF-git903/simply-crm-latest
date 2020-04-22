import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { fontStyles } from '../../../styles/common';

class MultiPickListType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: [],
            saveValue: this.props.obj.default,
            fieldName: this.props.obj.name
        };
    }
    render() {
        //console.log(this.props.obj.type.picklistValues);
        const mandatory = this.props.obj.mandatory;
        const items = [];
        const options = this.props.obj.type.picklistValues;

        options.map((item) => {
            items.push({ id: item.label, name: item.value });
        });

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
                    <MultiSelect
                        items={items}
                        uniqueKey="id"
                        onSelectedItemsChange={
                            (selectedItems) => {
                                this.setState({
                                    selectedValues: selectedItems,
                                    saveValue: selectedItems.join('|##|')
                                });
                            }}
                        selectedItems={this.state.selectedValues}
                        selectText="Pick Items"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                    />
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

export default MultiPickListType;
