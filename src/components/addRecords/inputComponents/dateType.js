import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import { fontStyles, commonStyles } from '../../../styles/common';

class DateType extends Component {
    constructor(props) {
        super(props);
// console.log('--component data--');
// console.log(this.props.obj.type.format);
// console.log(this.props.obj.currentValue);
        const formatDate = this.props.obj.type.format.toUpperCase();
        let val = (this.props.obj.currentValue !== undefined) ? this.props.obj.currentValue : this.props.obj.default;
        this.state = {
            pickDate: null,
            saveValue: (val) ? moment(val).format(formatDate) : '',
            fieldName: this.props.obj.name,
            formatDate: formatDate
        };
    }

    onDatePress = () => {
        let pickedDate = this.state.pickDate;
        const dob = this.props.obj.name;

        if (!pickedDate) {
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
        this.setState({
            pickDate: date,
            saveValue: moment(date).format(this.state.formatDate)
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
