import React, { Component } from 'react';
import {View, TextInput} from 'react-native';
import { fontStyles, commonStyles } from '../../../styles/common';

class NumericType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveValue: (this.props.obj.type.name === 'double') ? Number(this.props.obj.default).toFixed(2) : this.props.obj.default,
            fieldName: this.props.obj.name
        };
    }

    onTextInputChange(text) {
        this.setState({ ...this.state, saveValue: text });
    }

    render() {
        return (
            <View style={commonStyles.inputHolder}>
                {this.props.fieldLabelView}
                <View style={{ flex: 1 }}>
                    <TextInput
                        autoGrow={true}
                        placeholderTextColor={'#C5C5C5'}
                        placeholder={this.props.validLable}
                        autoCorrect={false}
                        autoCapitalize='none'
                        style={[commonStyles.label, fontStyles.fieldValue, { paddingLeft: 0 }]}
                        keyboardType='numeric'
                        value={this.state.saveValue}
                        onChangeText={this.onTextInputChange.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

export default NumericType;
