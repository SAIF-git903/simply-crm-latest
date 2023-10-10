import React, {Component} from 'react';
import {View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {commonStyles} from '../../../styles/common';
import {connect} from 'react-redux';

class PickListType extends Component {
  constructor(props) {
    super(props);

    let val = '';
    //   this.props.obj.lable === 'Company country'
    //     ? ''
    //     : this.props.obj.type.defaultValue;
    // val =
    //   this.props.obj.currentValue !== undefined
    //     ? this.props.obj.currentValue
    //     : val;

    this.state = {
      saveValue: null,
      fieldName: this.props.obj.name,
    };
  }

  render() {
    let options = this.props.obj.type.picklistValues;

    return (
      <View style={commonStyles.inputHolder}>
        {this.state.fieldName === 'duration_minutes'
          ? null
          : this.props.fieldLabelView}
        {this.state.fieldName === 'duration_minutes' ? null : (
          <View style={{flex: 1}}>
            <Picker
              mode="dropdown"
              selectedValue={this.state.saveValue}
              onValueChange={(itemValue) => {
                this.setState({saveValue: itemValue});
              }}>
              <Picker.Item label={'Select an option'} value={0} />
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
        )}
      </View>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     passedValue: state.durationreducer.passedValue,
//   };
// };

export default PickListType;
// export default connect(mapStateToProps)(PickListType);
