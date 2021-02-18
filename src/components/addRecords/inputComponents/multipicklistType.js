import React, { Component } from 'react';
import {View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {commonStyles} from '../../../styles/common';

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
        const items = [];
        const options = this.props.obj.type.picklistValues;
        options.map((item) => {
            items.push({
                id: item.label,
                name: item.label,
                // name: item.value
            });
        });

        return (
            <View style={commonStyles.inputHolder}>
                {this.props.fieldLabelView}
                <View style={{ flex: 1 }}>
                    <MultiSelect
                        fontFamily={'Poppins-Regular'}
                        altFontFamily={'Poppins-Regular'}
                        itemFontFamily={'Poppins-Regular'}
                        items={items}
                        uniqueKey="id"
                        onSelectedItemsChange={(selectedItems) => {
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

export default MultiPickListType;
