import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import DatePicker from 'react-native-date-picker';

import moment from 'moment';
import {fontStyles, commonStyles} from '../../../styles/common';

let newEndTime = null;

class DateType extends Component {
  constructor(props) {
    super(props);
    // console.log('--component data--');
    // console.log(this.props.obj.type.format);
    // console.log(this.props.obj.currentValue);
    const formatDate = this.props.obj?.type?.format?.toUpperCase();
    const formatedDate = 'YYYY-MM-DD';
    // let val =
    //   this.props.obj.currentValue !== undefined
    //     ? this.props.obj.currentValue
    //     : this.props.obj.default;
    this.state = {
      pickDate: null,
      saveValue: this.props.submodule === 'Events' ? new Date() : null,
      fieldName: this.props.obj.name,
      formatDate: formatDate !== undefined ? formatedDate : formatedDate,
      visible: false,
      modal: false,
      endDate: null,
    };
  }

  componentDidMount() {
    if (this.props.submodule === 'Events') {
      if (this.state.fieldName === 'time_start') {
        const roundedTime = this.roundTimeToNextHour();
        this.setState({saveValue: roundedTime});
      }

      if (this.state.fieldName === 'time_end') {
        const roundedTime = this.roundTimeToNextHour();
        roundedTime.setHours(roundedTime.getHours() + 1);
        this.setState({saveValue: roundedTime});
      }
    }

    if (this.props.submodule === 'Tasks') {
      if (this.state.fieldName === 'date_start') {
        this.setState({saveValue: new Date()});
      }

      if (this.state.fieldName === 'due_date') {
        this.setState({saveValue: new Date()});
      }
    }

    if (this.state.fieldName === 'closingdate') {
      this.setState({saveValue: this?.props?.obj?.currentValue});
    }

    if (
      this.state.fieldName === 'timesheetdate' &&
      this.props?.moduleName === 'Timesheets'
    ) {
      this.setState({
        saveValue: moment(new Date()).format(this.state.formatDate),
      });
    }
  }

  roundTimeToNextHour() {
    const currentTime = new Date(); // Get the current time
    const nextHourTime = new Date(currentTime); // Create a new Date object as a copy

    // Calculate the next whole hour
    nextHourTime.setMinutes(0); // Reset the minutes to 0
    nextHourTime.setHours(nextHourTime.getHours() + 1); // Add 1 hour

    return nextHourTime;
  }

  onDatePress = () => {
    this.setState({visible: true});
    // let pickedDate = this.state.pickDate;
    // const dob = this.props.obj.name;

    // if (!pickedDate) {
    //   pickedDate = new Date();
    //   this.setState({
    //     pickDate: pickedDate,
    //   });
    // }
    // if (dob === 'birthday') {
    //   //To open the dialog
    //   this.setState({
    //     date: pickedDate,
    //     maxDate: new Date(), //To restrict future date
    //   });
    // } else {
    //   this.setState({visible: true});
    //   this.setState({
    //     date: pickedDate,
    //   });
    // }
  };

  // onDatePicked = (date) => {
  //   //Here you will get the selected date
  //   this.setState({
  //     pickDate: date,
  //     saveValue: moment(date).format(this.state.formatDate),
  //   });
  // };

  roundTimeToNearestDuration = (currentTime) => {
    const date = new Date(currentTime);
    const minutes = date.getMinutes();

    let dynamicDuration;

    if (minutes == 0) {
      dynamicDuration = 60;
    } else if (minutes < 5) {
      dynamicDuration = 5;
    } else if (minutes < 15) {
      dynamicDuration = 15;
    } else if (minutes < 30) {
      dynamicDuration = 30;
    } else if (minutes < 45) {
      dynamicDuration = 45;
    } else {
      dynamicDuration = 60;
    }

    const remainder = minutes % dynamicDuration;
    if (remainder > 0) {
      // If there is a remainder, round up to the next multiple of the dynamic duration
      const roundedMinutes = minutes + (dynamicDuration - remainder);
      date.setMinutes(roundedMinutes);
      date.setSeconds(0);
    }

    const endTime1 = this.addMinutesToDate(date, dynamicDuration);
    this.setState({endDate: endTime1});
    return {date};
  };

  addMinutesToDate = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000); // 1 minute = 60000 milliseconds
  };

  render() {
    return (
      <View style={commonStyles.inputHolder}>
        {this.state.fieldName === 'duration_hours' ||
        this.state.fieldName === 'time_end' ? null : this.state.fieldName ===
          'time_start' ? (
          <View
            style={{
              height: '100%',
              width: '34%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: '50%',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  paddingHorizontal: 7,
                }}>
                {this.props.obj.mandatory === true ? `*` : null}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#707070',
                  fontSize: 14,
                }}>
                Time Start
              </Text>
            </View>
            <View
              style={{
                height: '50%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  paddingHorizontal: 7,
                }}>
                {this.props.obj.mandatory === true ? `*` : null}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#707070',
                  fontSize: 14,
                }}>
                End Time
              </Text>
            </View>
          </View>
        ) : (
          this.props.fieldLabelView
        )}
        {this.state.fieldName === 'duration_hours' ||
        this.state.fieldName === 'time_end' ? null : this.state.fieldName ===
          'time_start' ? (
          <View style={{flex: 1}}>
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
                    {this.state.saveValue &&
                      moment(this.state.saveValue).format('HH:mm')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{height: 35, width: 35}}
                  onPress={() => this.setState({modal: true})}>
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
                open={this.state.modal}
                mode="time"
                date={
                  this.state.saveValue !== null
                    ? this.state.saveValue
                    : new Date()
                }
                onConfirm={(date) => {
                  let newDate = this.roundTimeToNearestDuration(date);
                  if (this.state.fieldName === 'time_start') {
                    this.setState({saveValue: newDate.date});
                  } else if (this.state.fieldName === 'time_end') {
                    this.setState({saveValue: newDate.date});
                  } else {
                    this.setState({saveValue: date});
                  }
                  this.setState({modal: false});
                }}
                onCancel={() => {
                  this.setState({modal: false});
                }}
              />
            </View>
            <View style={{flex: 1, marginTop: 25}}>
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
                      {this.state.endDate !== null
                        ? moment(this.state.endDate).format('HH:mm')
                        : this.state.saveValue
                        ? moment(this.state.saveValue)
                            .add(1, 'hours')
                            .format('HH:mm')
                        : null}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={this.onDatePress.bind(this)}>
              <View style={commonStyles.textbox}>
                <Text style={[commonStyles.text, fontStyles.fieldValue]}>
                  {this.state.saveValue
                    ? moment(this?.state?.saveValue).format(
                        this?.state?.formatDate,
                      )
                    : this?.props?.obj?.currentValue}
                </Text>
              </View>
            </TouchableOpacity>
            <DatePicker
              ref="dateDialog"
              modal
              open={this.state.visible}
              mode="date"
              // date={
              //   this.state.saveValue !== null
              //     ? this.state.saveValue
              //     : new Date()
              // }
              date={new Date()}
              onConfirm={(date) => {
                this.setState({visible: false});
                this.setState({
                  saveValue: moment(date).format(this?.state?.formatDate),
                });
              }}
              onCancel={() => {
                this.setState({visible: false});
              }}
            />
          </View>
        )}
        {/* <DatePickerDialog
          ref="dateDialog"
          okLabel="ok"
          cancelLabel="cancel"
          onDatePicked={this.onDatePicked.bind(this)}
        /> */}
      </View>
    );
  }
}

export default DateType;
