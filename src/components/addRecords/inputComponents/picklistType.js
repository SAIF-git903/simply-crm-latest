import React, {Component} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
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
      saveValue: this.props.obj.default ? this.props.obj.default.trim() : null,
      fieldName: this.props.obj.name,
      visible: false,
    };
  }

  newarray = () => {
    let newVal = this.props?.obj?.type?.picklistValues?.map((item) => ({
      ...item,
      color: this.props?.colorsType[item?.value] || null, // Assign the color, or null if not found
    }));
    return newVal;
  };

  isLightColor = (hexColor) => {
    // Convert hex color to RGB object
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex?.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return {r, g, b};
    };

    // Calculate luminance
    const rgb = hexToRgb(hexColor);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    // You can adjust the threshold based on your preference
    return luminance > 0.5; // If luminance is greater than 0.5, consider it a light color
  };

  render() {
    // let options = this.props.obj.type.picklistValues;

    return (
      <View style={commonStyles.inputHolder}>
        {/* {this.state.fieldName === 'duration_minutes'
          ? null
          : this.props.fieldLabelView} */}
        {this.props.fieldLabelView}
        {/* {this.state.fieldName === 'duration_minutes' ? null : ( */}
        {/* {this.props.obj.name === 'cf_test_drop_down' ? null : ( */}
        {/* )} */}
        <View style={{flex: 1}}>
          {/* <Picker
            mode="dropdown"
            selectedValue={this.state.saveValue}
            onValueChange={(itemValue) => {
              this.setState({saveValue: itemValue});
            }}>
            <Picker.Item label={'Select an option'} value={0} />

            {this.newarray()?.map((item, index) => {
              return (
                <Picker.Item
                  label={item.label}
                  value={item.value}
                  key={index}
                  color={item.color}
                />
              );
            })}
          </Picker> */}

          {this.state.visible ? (
            <ScrollView
              style={{height: 100}}
              showsVerticalScrollIndicator={false}>
              {this.newarray()?.map((item, index) => {
                const textColor = this.isLightColor(item?.color)
                  ? 'black'
                  : 'white';
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      borderRadius: 3,
                      backgroundColor: item?.color,
                      marginVertical: 1,
                    }}
                    onPress={() => {
                      this.setState({visible: false});
                      this.setState({saveValue: item?.value});
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        fontSize: 18,
                        paddingVertical: 5,
                        color: item.color ? textColor : '#000',
                      }}>
                      {item?.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(100, 100, 100, 0.2)',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                this.setState({visible: true});
              }}>
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 18}}>
                {this.state.saveValue
                  ? this.state.saveValue
                  : 'Select an option'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* )} */}
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
