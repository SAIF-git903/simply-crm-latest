import React, { Component } from 'react';
import {View, TouchableWithoutFeedback, Text,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import { commonStyles } from '../../../styles/common';

class BooleanType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            saveValue: '0',
            fieldName: this.props.obj.name
        };
    }

    toggle() {
        this.setState({
            checked: !this.state.checked
        }, () => {
            this.changeSaveValue();
        });
    }

    changeSaveValue() {
        if (this.state.checked) {
            this.setState({ saveValue: '1' });
        } else {
            this.setState({ saveValue: '0' });
        }
    }

    getCheckView() {
        let view = null;
        if (
            this.state.checked
            // || this.state.saveValue === '1'
        ) {
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
