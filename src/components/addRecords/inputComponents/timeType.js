import React, {Component} from 'react';
import {Button, Image, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fontStyles, commonStyles} from '../../../styles/common';
import moment from 'moment';

class TimeType extends Component {
  constructor(props) {
    super(props);
    // Format the currentValue if it exists
    let initialValue = '';
    if (this.props.obj.currentValue !== undefined && this.props.obj.currentValue !== null && this.props.obj.currentValue !== '') {
      // Handle different time formats (HH:mm, HH:mm:ss, hh:mm A, etc.)
      try {
        if (typeof this.props.obj.currentValue === 'string') {
          // Try to parse and format the time
          const timeStr = this.props.obj.currentValue.trim();
          if (timeStr.match(/^\d{1,2}:\d{2}(:\d{2})?(\s?[AP]M)?$/i)) {
            // If it's already a time string, use it directly or convert to HH:mm
            initialValue = moment(timeStr, ['HH:mm:ss', 'HH:mm', 'hh:mm A', 'h:mm A']).format('HH:mm');
          } else {
            initialValue = this.props.obj.currentValue;
          }
        } else {
          initialValue = this.props.obj.currentValue;
        }
      } catch (e) {
        initialValue = this.props.obj.currentValue;
      }
    }
    this.state = {
      saveValue: initialValue,
      fieldName: this.props.obj.name,
      visible: false,
    };
  }

  componentDidUpdate(prevProps) {
    // Update state if currentValue changes
    if (prevProps.obj.currentValue !== this.props.obj.currentValue) {
      let newValue = '';
      if (this.props.obj.currentValue !== undefined && this.props.obj.currentValue !== null && this.props.obj.currentValue !== '') {
        try {
          if (typeof this.props.obj.currentValue === 'string') {
            const timeStr = this.props.obj.currentValue.trim();
            if (timeStr.match(/^\d{1,2}:\d{2}(:\d{2})?(\s?[AP]M)?$/i)) {
              newValue = moment(timeStr, ['HH:mm:ss', 'HH:mm', 'hh:mm A', 'h:mm A']).format('HH:mm');
            } else {
              newValue = this.props.obj.currentValue;
            }
          } else {
            newValue = this.props.obj.currentValue;
          }
        } catch (e) {
          newValue = this.props.obj.currentValue;
        }
      }
      this.setState({saveValue: newValue});
    }
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
                {this.props.obj.name === 'time_in' ||
                this.props.obj.name === 'time_out' ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
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
                    }}
                    onPress={() => this.setState({visible: true})}>
                    <Text style={{paddingLeft: 10, fontSize: 17}}>
                      {this.state.saveValue ? this.state.saveValue : ''}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.5}
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
                    }}
                    onPress={() => this.setState({visible: true})}>
                    <Text style={{paddingLeft: 10, fontSize: 17}}>
                      {this.state.saveValue ? this.state.saveValue : ''}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* <View
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
                </View> */}
                <TouchableOpacity
                  activeOpacity={0.7}
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
                date={
                  this.state.saveValue
                    ? (() => {
                        try {
                          // Try to parse the time string
                          const parsed = moment(this.state.saveValue, ['HH:mm:ss', 'HH:mm', 'hh:mm A', 'h:mm A']);
                          return parsed.isValid() ? parsed.toDate() : new Date();
                        } catch (e) {
                          return new Date();
                        }
                      })()
                    : new Date()
                }
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
