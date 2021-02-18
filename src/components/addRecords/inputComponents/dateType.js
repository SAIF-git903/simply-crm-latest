import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import { fontStyles, commonStyles } from '../../../styles/common';

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
                maxDate: new Date() //To restrict future date
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
            saveValue: moment(date).format(formatDate)
        });
    }

    render() {
        return (
            <View style={commonStyles.inputHolder}>
                {this.props.fieldLabelView}
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={this.onDatePress.bind(this)} >
                        <View style={commonStyles.textbox}>
                            <Text style={[commonStyles.text, fontStyles.fieldValue]}>{this.state.saveValue}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <DatePickerDialog
                    ref="dateDialog"
                    okLabel="ok"
                    cancelLabel="cancel"
                    onDatePicked={this.onDatePicked.bind(this)}
                />
            </View>
        );
    }
}

export default DateType;
