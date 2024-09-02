import React, {Component} from 'react';
import {Button, Image, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fontStyles, commonStyles} from '../../../styles/common';
import moment from 'moment';

class TimeType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveValue:
        this.props.obj.currentValue !== undefined
          ? this.props.obj.currentValue
          : new Date() && '',
      fieldName: this.props.obj.name,
      visible: false,
    };
  }

  render() {
    return (
      <View style={commonStyles.inputHolder}>
        {this.state.fieldName === 'duration_hours'
          ? null
          : this.props.fieldLabelView}
        <View style={{flex: 1}}>
          {/* <DatePicker
            // style={{width: '100%'}}
            open={false}
            style={{width: 200}}
            date={this.state.saveValue}
            mode="time"
            format="HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            minuteInterval={10}
            placeholder=" "
            customStyles={{
              dateText: [
                fontStyles.fieldValue,
                {alignSelf: 'flex-start', paddingLeft: 10},
              ],
              dateInput: {
                //paddingTop: 9,
                borderColor: '#ABABAB',
                borderWidth: 0.5,
                padding: 0,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                height: 38,
                justifyContent: 'center',
              },
            }}
            onDateChange={time => {
              this.setState({saveValue: time});
            }}
          /> */}
          {this.state.fieldName === 'duration_hours' ? null : (
            <View style={{width: '100%'}}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    //paddingTop: 9,
                    borderColor: '#ABABAB',
                    borderWidth: 0.5,
                    padding: 0,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                    height: 38,
                    width: '80%',
                    justifyContent: 'center',
                  }}>
                  <Text style={{paddingLeft: 10, fontSize: 17}}>
                    {this.state.saveValue ? this.state.saveValue : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 35,
                  }}
                  onPress={() => this.setState({visible: true})}>
                  {this.props.obj.name === 'time_in' ||
                  this.props.obj.name === 'time_out' ? (
                    <View
                      style={{
                        height: '100%',
                        width: '100%',
                        alignItems: 'center',
                        paddingLeft: 10,
                        justifyContent: 'center',
                      }}>
                      <FontAwesome5 name="clock" size={25} solid />
                    </View>
                  ) : (
                    <Image
                      source={require('../../../../assets/images/date_icon.png')}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <DatePicker
                modal
                open={this.state.visible}
                mode="time"
                date={new Date()}
                onConfirm={(date) => {
                  this.setState({
                    saveValue: moment(new Date(date)).format('HH:mm'),
                  });

                  this.setState({visible: false});

                  // this.setState({saveValue: date});
                }}
                onCancel={() => {
                  this.setState({visible: false});
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

// const mapDispatchToProps = {
//   passValue,
// };

// export default connect(null, mapDispatchToProps)(TimeType);
export default TimeType;
