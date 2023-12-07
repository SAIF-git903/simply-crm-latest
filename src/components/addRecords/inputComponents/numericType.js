import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import {fontStyles, commonStyles} from '../../../styles/common';

class NumericType extends Component {
  constructor(props) {
    super(props);
    let val =
      this.props.obj.currentValue !== undefined
        ? this.props.obj.currentValue
        : this.props.obj.default;
    this.state = {
      saveValue:
        this.props.obj.type.name === 'double' ? Number(val).toFixed(2) : val,
      fieldName: this.props.obj.name,
    };
  }

  onTextInputChange(text) {
    this.setState({...this.state, saveValue: text});
  }

  render() {
    return (
      <View style={commonStyles.inputHolder}>
        {this.state.fieldName === 'duration_hours'
          ? null
          : this.props.fieldLabelView}
        {this.state.fieldName === 'duration_hours' ? null : (
          <View style={{flex: 1}}>
            <TextInput
              autoGrow={true}
              placeholderTextColor={'#C5C5C5'}
              placeholder={this.props.validLabel}
              autoCorrect={false}
              autoCapitalize="none"
              style={[
                commonStyles.label,
                fontStyles.fieldValue,
                {paddingLeft: 0},
              ]}
              keyboardType="numeric"
              value={this.state.saveValue}
              onChangeText={this.onTextInputChange.bind(this)}
            />
          </View>
        )}
      </View>
    );
  }
}

export default NumericType;
