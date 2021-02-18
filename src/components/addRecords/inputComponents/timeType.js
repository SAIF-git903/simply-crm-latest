import React, { Component } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { fontStyles } from '../../../styles/common';

class TimeType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveValue: '',
            fieldName: this.props.obj.name
        };
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
                        (mandatory)
                            ?
                            <View style={styles.mandatory}>
                                <Text style={[fontStyles.fieldLabel, { color: 'red', fontSize: 16 }]}>*</Text>
                            </View>
                            :
                            // undefined
                            <View style={styles.mandatory} />
                    }
                </View>
                <View style={{ flex: 1 }}>
                    <DatePicker
                        style={{ width: '100%' }}
                        // style={{ width: 200 }}
                        date={this.state.saveValue}
                        mode="time"
                        format="HH:mm"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        minuteInterval={10}
                        placeholder=" "
                        customStyles={{
                            dateText: [fontStyles.fieldValue, { alignSelf: 'flex-start', paddingLeft: 10 }],
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
                        onDateChange={(time) => {
                            this.setState({ saveValue: time });
                        }}
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
            marginVertical: 10,
            // marginRight: 2
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
        // textbox: {
        //     //paddingTop: 9,
        //     borderColor: '#ABABAB',
        //     borderWidth: 0.5,
        //     padding: 0,
        //     borderTopLeftRadius: 4,
        //     borderTopRightRadius: 4,
        //     borderBottomLeftRadius: 4,
        //     borderBottomRightRadius: 4,
        //     height: 38,
        //     justifyContent: 'center'
        // },
        // text: {
        //     fontSize: 14,
        //     marginLeft: 5,
        //     borderWidth: 0,
        //     color: '#121212',
        // },
    }
);

export default TimeType;
