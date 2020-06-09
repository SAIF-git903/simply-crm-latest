import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { fontStyles } from '../../../styles/common';

class MultiPickListType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: [],
            fieldName: this.props.obj.name,
            saveValue: this.props.obj.default
        };
    }

    render() {
        console.log('type')
        console.log(this.props)
        const mandatory = this.props.obj.mandatory;
        const items = [];
        const options = this.props.obj.type.picklistValues;
        options.map((item) => {
            items.push({ id: item.label, name: item.value });
        });
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
                    <MultiSelect
                        items={items}
                        uniqueKey="id"
                        onSelectedItemsChange={
                            (selectedItems) => {
                                this.setState({
                                    selectedValues: selectedItems,
                                    saveValue: selectedItems.join(' |##| ')
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

export default MultiPickListType;
