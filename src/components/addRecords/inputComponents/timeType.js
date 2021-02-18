import React, { Component } from 'react';
import {View} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { fontStyles, commonStyles } from '../../../styles/common';

class TimeType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveValue: '',
            fieldName: this.props.obj.name
        };
    }

    render() {
        return (
            <View style={commonStyles.inputHolder}>
                {this.props.fieldLabelView}
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

export default TimeType;
