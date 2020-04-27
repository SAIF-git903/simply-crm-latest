import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import { fontStyles } from '../../../styles/common';

class DateType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickDate: null,
            saveValue: this.props.obj.default,
            fieldName: this.props.obj.name
        };
    }
    onDatePress = () => {
        let pickedDate = this.state.pickDate;
        const dob = this.props.obj.name;

        if (!pickedDate || pickedDate == null) {
            pickedDate = new Date();
            this.setState({
                pickDate: pickedDate
            });
        }
        if (dob === 'birthday') {
            //To open the dialog
            this.refs.dateDialog.open({
                date: pickedDate,
                maxDate: new Date() //To restirct future date
            });
        } else {
            //To open the dialog
            this.refs.dateDialog.open({
                date: pickedDate,
            });
        }
    }

    onDatePicked = (date) => {
        //Here you will get the selected date
        const formatDate = this.props.obj.type.format.toUpperCase();
        this.setState({
            pickDate: date,
            saveValue: moment(date).format('YYYY-MM-DD')
        });
    }
    render() {
        const mandatory = this.props.obj.mandatory;
        const amp = '&amp;';

        const validLable = (this.props.obj.lable.indexOf(amp) !== -1) ? this.props.obj.lable.replace('&amp;', '&') : this.props.obj.lable;

        return (
            <View style={styles.inputHolder}>
                <View style={{ flex: .5, justifyContent: 'flex-start' }}>
                    <Text style={[styles.label, fontStyles.fieldLabel]}>{validLable}</Text>
                    {
                        (mandatory) ?
                            <View style={styles.mandatory}>
                                <Text style={[fontStyles.fieldLabel, { color: 'red', fontSize: 16 }]}>*</Text>
                            </View>
                            :
                            // undefined
                            <View style={styles.mandatory} />
                    }
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={this.onDatePress.bind(this)} >
                        <View style={styles.textbox}>
                            <Text style={[styles.text, fontStyles.fieldValue]}>{this.state.saveValue}</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <DatePickerDialog ref="dateDialog" okLabel="ok" cancelLabel="cancel" onDatePicked={this.onDatePicked.bind(this)} />
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        inputHolder: {
            flex: 1,
            flexDirection: 'row',
            marginVertical: 10,
            marginRight: 2
        },
        label: {
            fontSize: 16,
            padding: 10,
            paddingLeft: 20
        },
        mandatory: {
            position: 'absolute',
            marginTop: 10,
            marginLeft: 5,
            width: 10,
            height: 25,
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        textbox: {
            paddingLeft: 5,
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

export default DateType;
