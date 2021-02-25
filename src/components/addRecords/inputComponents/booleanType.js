import React, { Component } from 'react';
import {View, TouchableWithoutFeedback, Text,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import { commonStyles } from '../../../styles/common';

class BooleanType extends Component {
    constructor(props) {
        super(props);
        let checked = (this.props.obj.currentValue !== undefined && this.props.obj.currentValue === '1') ? true : false;
        this.state = {
            checked: checked,
            saveValue: (checked) ? '1' : '0',
            fieldName: this.props.obj.name
        };
    }

    toggle() {
        this.setState({
            checked: !this.state.checked,
            saveValue: (this.state.checked) ? '0' : '1',
        });
    }

    getCheckView() {
        let view = null;
        if (this.state.checked) {
            view = (
                <Icon
                    name={'check'}
                    size={22}
                    color={'green'}
                />
            );
        }
        return view;
    }

    render() {
        return (
            <View style={commonStyles.inputHolder}>
                {this.props.fieldLabelView}
                <TouchableWithoutFeedback onPress={this.toggle.bind(this)}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                borderColor: '#ddd',
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {this.getCheckView()}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

export default BooleanType;
