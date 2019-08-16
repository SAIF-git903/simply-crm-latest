import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, 
         TouchableWithoutFeedback, Picker, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import MultiSelect from 'react-native-multiple-select';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import moment from 'moment';


class InputForm extends Component {
    constructor(props) {
        super(props);
        this.state = { checked: false, 
                       pickerValue: this.props.obj.type.defaultValue,
                       pickDate: null,
                       multiPickerValue: [],
                       dialogueVisible: false,
                       dialogueSelectedValue: undefined,
                       referenceValue: '', 
                       formId: 0,
                       saveValue: '',
                     };
    }

    componentWillMount() {
        this.setState({ formId: this.props.formId, referenceValue: this.props.label });
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        if (this.state.formId === this.props.uniqueId) {
            this.setState({ referenceValue: this.props.label });
            //console.log(this.state.referenceValue);
        }
    }

    onTextInputChange(text) {
        this.setState({ ...this.state, saveValue: text });
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
          dateText: moment(date).format(formatDate)
        });
    }

    onReferencePress(refersTo) {
       
        if (refersTo.length > 1) {
            this.setState({ dialogueVisible: true });
        } else {
            const { navigate } = this.props.navigate;
            navigate('ReferenceScreen', { selectedModule: refersTo[0], uniqueId: this.state.formId });
        }
    }

    toggle() {
        this.setState({ checked: !this.state.checked });
    }
    
    renderStringType() {
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
                    <TextInput
                        placeholder={this.props.obj.lable}
                        autoCorrect={false}
                        autoCapitalize='none' 
                        style={styles.label}
                        value={this.state.saveValue}
                        onChangeText={this.onTextInputChange.bind(this)}
                    />
                </View>  
            </View>
        );
    }

    renderNumericType(type) {
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
                {
                    
                    (type === 'integer' || type === 'double' || type === 'currency' || type === 'phone') ?
                    <TextInput
                        placeholder={this.props.obj.lable}
                        autoCorrect={false}
                        autoCapitalize='none' 
                        style={styles.label}
                        
                        keyboardType='numeric'
                    />
                    :
                    <TextInput
                        placeholder={this.props.obj.lable}
                        autoCorrect={false}
                        autoCapitalize='none' 
                        style={styles.label}
                        keyboardType='email-address'
                    />
                }

                </View>  
            </View>
        );
    }
    renderBooleanType() {
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
                <View style={{ flex: 1, justifyContent: 'center' }}>
                
                <TouchableWithoutFeedback onPress={this.toggle.bind(this)}>
                    <View 
                        style={{ 
                            width: 25, 
                            height: 25, 
                            borderColor: '#ddd', 
                            borderWidth: 1, 
                            alignItems: 'center' 
                        }}
                    >
                        {
                            (this.state.checked) ?
                            <Icon name="check" size={20} color='green' />
                            :
                            null
                        }
                    </View>
                </TouchableWithoutFeedback>
               
                </View>
                
            </View>
        );       
    }
    renderPicklistType() {
        const mandatory = this.props.obj.mandatory;
        let options = [];
        options = this.props.obj.type.picklistValues;

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
                <Picker 
                    mode='dropdown'
                    selectedValue={this.state.pickerValue} 
                    onValueChange={(itemValue) => this.setState({ pickerValue: itemValue })}
                >
                    {options.map((item, index) => {
                        return (<Picker.Item label={item.label} value={item.value} key={index} />); 
                    })}
                </Picker>
                </View>
                
            </View>
        );       
    }
   
    renderMultiPicklistType() {
        const mandatory = this.props.obj.mandatory;
        let options = [];
        const items = [];
        options = this.props.obj.type.picklistValues;
        options.map((item) => {
            items.push({ id: item.label, name: item.value });
        });
       

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
                <MultiSelect
                    items={items}
                    uniqueKey="id"
                    onSelectedItemsChange={
                        (selectedItems) => { 
                            this.setState({ multiPickerValue: selectedItems 
                        }); 
                    }}
                    selectedItems={this.state.multiPickerValue}
                    selectText="Pick Items"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                />
                </View>
                
            </View>
        );       
    }

    renderDateType() {
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
                <TouchableOpacity onPress={this.onDatePress.bind(this)} >
                    <View style={styles.textbox}>
                        <Text style={styles.text}>{this.state.dateText}</Text>
                    </View>
                </TouchableOpacity>
               
                </View>  
                <DatePickerDialog ref="dateDialog" onDatePicked={this.onDatePicked.bind(this)} />
            </View>
        );
    }

    renderReferenceType() {
        const mandatory = this.props.obj.mandatory;
        
        const { navigate } = this.props.navigate;
        const items = [];
        const refersTo = this.props.obj.type.refersTo;
        refersTo.map((row, index) => {
            items.push({ label: row, value: index });
        });

        
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
                <TouchableOpacity onPress={this.onReferencePress.bind(this, refersTo)} >
                    <View style={styles.textbox}>
                        <Text style={styles.text}>{this.state.referenceValue}</Text>
                    </View>
                </TouchableOpacity>
                 
                </View>  
            
                <SinglePickerMaterialDialog
                title={'Choose one'}
                items={items}
                visible={this.state.dialogueVisible}
                selectedItem={this.state.dialogueSelectedValue}
                //selectedItem={this.state.dialogueSelectedValue}
                onCancel={() => this.setState({ dialogueVisible: false })}
                onOk={(result) => {
                    //console.log(result);
                    
                    
                    if (result.selectedItem === undefined) {
                        //console.log('undefined');
                        this.setState({ dialogueVisible: false });
                    } else {
                        navigate('ReferenceScreen', { selectedModule: result.selectedItem.label, uniqueId: this.state.formId });
                        this.setState({ dialogueSelectedValue: result.selectedItem });
                        this.setState({ dialogueVisible: false });
                    }
                }}
                scrolled    
                />
                                    
            </View>
        );
    }

    render() {
        const type = this.props.obj.type.name;
        
        switch (type) {
            case 'string':
            case 'text' :
            case 'url' :
                return this.renderStringType();
            case 'boolean':
                return this.renderBooleanType();
            case 'picklist':
                return this.renderPicklistType();
            case 'email':
            case 'phone':
            case 'currency':
            case 'integer':
            case 'double':
                return this.renderNumericType(type);
            case 'date':
                return this.renderDateType();
            case 'multipicklist':
                return this.renderMultiPicklistType();
            case 'reference':
                return this.renderReferenceType();
            default:
                return this.renderStringType();
        }
    }   
}

const styles = StyleSheet.create(
    {
        inputHolder: {
            flex: 1, 
            flexDirection: 'row', 
            marginTop: 10, 
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
            marginTop: 9,
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
const mapStateToProps = ({ recordViewer }) => {
    const { label, recordId, uniqueId } = recordViewer;
    return { label, recordId, uniqueId };
};

export default connect(mapStateToProps)(InputForm);
