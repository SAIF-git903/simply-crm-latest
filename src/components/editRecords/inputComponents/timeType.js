import React, { Component } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import DatePicker from 'react-native-datepicker';

class TimeType extends Component {
  constructor(props) {
    super(props);
    this.state = { saveValue: '',
                   fieldName: this.props.obj.name
                 };
  }

  render() {
    const mandatory = this.props.obj.mandatory;
    return (
        <View style={styles.inputHolder}>
        {
            (mandatory) ? 
            <View style={styles.mandatory}>
                <Text style={{ color: 'red', fontSize: 16 }}>*</Text>
            </View>
            :
            undefined
        } 
        
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.label}>{this.props.obj.lable}</Text>
            </View>
            <View style={{ flex: 1 }}>
            <DatePicker
                style={{ width: 200 }}
                date={this.state.saveValue}
                mode="time"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minuteInterval={10}
                placeholder=" "
                customStyles={{
                                dateText: {
                                    alignSelf: 'flex-start',
                                    color: '#121212',
                                },
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
                                    justifyContent: 'center'

                                }
                            }}
                onDateChange={(time) => { this.setState({ saveValue: time }); }}
            />
            </View>  
        </View>
    );
  }
}
const styles = StyleSheet.create(
    {
        inputHolder: {
            flex: 1, 
            flexDirection: 'row', 
            marginTop: 10, 
            marginRight: 2
        },
        label: {
            fontSize: 16,
            padding: 10
        },
        mandatory: {
            width: 10, 
            height: 25, 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginTop: 5,
        },
        textbox: {
            //paddingTop: 9,
            borderColor: '#ABABAB',
            borderWidth: 0.5,
            padding: 0,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            height: 38,
            justifyContent: 'center'
          },
        text: {
            fontSize: 14,
            marginLeft: 5,
            borderWidth: 0,
            color: '#121212',
        },
    }
);

export default TimeType;
