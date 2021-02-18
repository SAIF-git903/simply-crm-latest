import React, { Component } from 'react';
import {View} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {commonStyles} from '../../../styles/common';

class PickListType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveValue: (this.props.obj.lable === 'Company country') ? '' : this.props.obj.type.defaultValue,
            fieldName: this.props.obj.name
        };
    }

    render() {
        let options = this.props.obj.type.picklistValues;

        return (
            <View style={commonStyles.inputHolder}>
                {this.props.fieldLabelView}
                <View style={{ flex: 1 }}>
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.saveValue}
                        onValueChange={(itemValue) => {
                            //disable save 'Please Select' value
                            // if (itemValue !== 0) {
                                this.setState({ saveValue: itemValue });
                            // }
                        }}
                    >
                        <Picker.Item label='Please Select' value={0} />
                        {options.map((item, index) => {
                            return (
                                <Picker.Item
                                    label={item.label}
                                    value={item.value}
                                    key={index}
                                />
                            );
                        })}
                    </Picker>
                </View>
            </View>
        );
    }
}

export default PickListType;
