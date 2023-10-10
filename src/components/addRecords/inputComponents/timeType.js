import React, {Component} from 'react';
import {Button, Image, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {fontStyles, commonStyles} from '../../../styles/common';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  componentDidMount() {
    this.getRemoveAllTime();
    const roundedTime = this.roundTimeUpToNextHour(new Date());
    let val = moment(new Date(roundedTime)).add(60, 'minutes');
    if (this.state.fieldName === 'time_start') {
      this.setState({saveValue: new Date(roundedTime)});
    } else if (this.state.fieldName === 'time_end') {
      this.setState({saveValue: new Date(val)});
    } else if (this.state.fieldName === 'duration_hours') {
      let hours = moment(new Date(val)).diff(roundedTime, 'hours');
      let minutes = moment(new Date(val)).diff(roundedTime, 'minutes');

      // Handle minute rollover
      if (minutes < 0) {
        minutes += 60;
        hours -= 1;
      }

      // Ensure hours and minutes are non-negative
      if (hours < 0) {
        hours = 0;
      }

      if (minutes < 0) {
        minutes = 0;
      }

      let new_date = `${hours}:${minutes}`;

      this.setState({saveValue: new_date});
      // dispatch(passValue(date));
    }
  }

  getRemoveAllTime = async () => {
    try {
      await AsyncStorage.removeItem('timestart');
      await AsyncStorage.removeItem('timeend');
    } catch (error) {
      console.log('err', error);
    }
  };

  setdatestart = async (timestart) => {
    try {
      await AsyncStorage.setItem('timestart', JSON.stringify(timestart));
      this.calculateDuration();
    } catch (error) {
      console.log('err', error);
    }
  };

  setdateend = async (timeend) => {
    try {
      await AsyncStorage.setItem('timeend', JSON.stringify(timeend));
      this.calculateDuration();
    } catch (error) {
      console.log('err', error);
    }
  };

  calculateDuration = async () => {
    try {
      let start_time = await AsyncStorage.getItem('timestart');
      let end_time = await AsyncStorage.getItem('timeend');

      let startNew = JSON.parse(start_time);
      let endNew = JSON.parse(end_time);

      const startMoment = moment(startNew);
      const endMoment = moment(endNew);

      if (endMoment.isBefore(startMoment)) {
        // setDuration('Invalid time range');
        return;
      } else {
        let hours = endMoment.diff(startMoment, 'hours');
        let minutes = endMoment.diff(startMoment, 'minutes');

        if (minutes < 0) {
          minutes += 60;
          hours -= 1;
        }

        if (hours < 0) {
          hours = 0;
        }

        if (minutes < 0) {
          minutes = 0;
        }

        let newminute = minutes % 60;
        let new_date = null;

        if (newminute > 10) {
          new_date = `${hours}:${newminute}`;
        } else {
          new_date = `${hours}:0${newminute}`;
        }

        console.log('newDate', new_date);
        if (this.state.fieldName === 'duration_hours') {
          this.setState({saveValue: new_date});
        }
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  roundTimeUpToNextHour = (inputTime) => {
    const inputMoment = moment(inputTime, 'HH:mm');
    const nextHourMoment = moment(inputMoment).startOf('hour').add(1, 'hour');

    if (inputMoment >= nextHourMoment) {
      // If the input time is already at or after the next hour, no rounding needed.
      return inputTime;
    } else {
      // Round up to the next hour.
      return nextHourMoment;
    }
  };

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
                    {this.state.saveValue
                      ? moment(this.state.saveValue).format('HH:mm')
                      : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{height: 35, width: 35}}
                  onPress={() => this.setState({visible: true})}>
                  <Image
                    source={require('../../../../assets/images/date_icon.png')}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      width: '100%',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <DatePicker
                modal
                open={this.state.visible}
                mode="time"
                date={this.state.saveValue ? this.state.saveValue : new Date()}
                onConfirm={(date) => {
                  if (this.state.fieldName === 'time_start') {
                    this.setState({saveValue: date});
                    this.setdatestart(date);
                    this.setState({visible: false});
                  } else if (this.state.fieldName === 'time_end') {
                    this.setState({saveValue: date});
                    this.setdateend(date);
                    this.setState({visible: false});
                  }
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

export default TimeType;
