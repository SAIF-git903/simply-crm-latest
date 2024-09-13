import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {SinglePickerMaterialDialog} from 'react-native-material-dialog';
import {connect} from 'react-redux';
import {fontStyles, commonStyles} from '../../../styles/common';
import {getUserName, getAddressDetails, getPriceDetails} from '../../../helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOGINDETAILSKEY} from '../../../variables/strings';

class ReferenceType extends Component {
  constructor(props) {
    super(props);
    let val = this.props.obj.defaultValue
      ? this.props.obj.defaultValue.value
      : this.props.obj.default;
    val =
      this.props.obj.currentValue !== undefined
        ? this.props.obj.currentValue
        : val;
    let refVal = this.props.obj.defaultValue
      ? this.props.obj.defaultValue.label
      : '';
    refVal = this.props.obj.currentReferenceValue
      ? this.props.obj.currentReferenceValue
      : refVal;
    this.state = {
      dialogueVisible: false,
      dialogueSelectedValue: undefined,
      referenceValue: refVal,
      formId: 0,
      saveValue: val,
      fieldName: this.props.obj.name,
      selectedRefModule: '',
      reference: true,
    };
  }

  componentDidMount() {
    this.getDetails();
  }

  getDetails = async () => {
    try {
      const loginDetails = JSON.parse(
        await AsyncStorage.getItem(LOGINDETAILSKEY),
      );

      if (this.state.fieldName === 'assigned_user_id') {
        this.setState({referenceValue: loginDetails?.username});
      }
      if (this.state.fieldName === 'created_user_id') {
        this.setState({referenceValue: loginDetails?.username});
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  UNSAFE_componentWillMount() {
    this.setState(
      {
        formId: this.props.formId,
        // referenceValue: (this.props.obj.defaultValue) ? this.props.obj.defaultValue.label : this.props.label
        //referenceValue: label
      },
      () => {
        this.assignUserId();
      },
    );
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.props = newProps;

    if (this.state.formId === this.props.uniqueId) {
      this.setState(
        {
          referenceValue: this.props.label,
          saveValue: this.props.recordId,
          uniqueId: this.props.uniqueId,
        },
        () => {
          if (this.props.moduleName === 'Invoice') {
            if (
              this.state.selectedRefModule === 'Contacts' ||
              this.state.selectedRefModule === 'Accounts'
            ) {
              this.assignAddress();
            }
            if (
              this.state.selectedRefModule === 'Products' ||
              this.state.selectedRefModule === 'Services'
            ) {
              this.assignPriceDetails();
            }
          }
        },
      );
    }
  }

  onReferencePress(type) {
    if (type.name === 'owner') {
      this.props.navigation.navigate('Reference Screen', {
        selectedModule: 'Users',
        uniqueId: this.state.formId,
        moduleLable: this.props.validLabel,
      });
    } else {
      if (type.refersTo.length < 1) {
        Alert.alert('Empty', 'No references');
      } else {
        if (type.refersTo.length > 1) {
          this.setState({dialogueVisible: true});
        } else {
          this.setState(
            {
              selectedRefModule: type.refersTo[0],
            },
            () => {
              this.props.navigation.navigate('Reference Screen', {
                selectedModule: type.refersTo[0],
                uniqueId: this.state.formId,
                moduleLable: this.props.validLabel,
              });
            },
          );
        }
      }
    }
  }

  assignUserId() {
    //TODO disable for edit ??
    if (this.props.obj.name === 'assigned_user_id') {
      //I comment this because I think it is not in use
      // getUserName(this);
    }
  }

  assignAddress() {
    //TODO disable for edit ??
    getAddressDetails(this, this.props.dispatch);
  }

  assignPriceDetails() {
    //TODO disable for edit ??
    getPriceDetails(this);
  }

  render() {
    const type = this.props.obj.type;
    const items = [];
    if (type.name !== 'owner') {
      const refersTo = type.refersTo;
      refersTo.map((row, index) => {
        items.push({label: row, value: index});
      });
    }

    return (
      <View style={commonStyles.inputHolder}>
        {this.state.fieldName === 'created_user_id' ? null : (
          <>
            <View style={{paddingBottom: 10}}>{this.props.fieldLabelView}</View>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={this.onReferencePress.bind(this, type)}>
                <View style={commonStyles.textbox}>
                  <Text
                    numberOfLines={1}
                    style={[commonStyles.text, fontStyles.fieldValue]}>
                    {this.state.referenceValue}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <SinglePickerMaterialDialog
              title={'Choose one'}
              items={items}
              visible={this.state.dialogueVisible}
              selectedItem={this.state.dialogueSelectedValue}
              onCancel={() => {
                this.setState({dialogueVisible: false});
              }}
              onOk={(result) => {
                if (result.selectedItem === undefined) {
                  this.setState({dialogueVisible: false});
                } else {
                  this.setState(
                    {
                      dialogueSelectedValue: result.selectedItem,
                      selectedRefModule: result.selectedItem.label,
                      dialogueVisible: false,
                    },
                    () => {
                      this.props.navigation.navigate('Reference Screen', {
                        selectedModule: result.selectedItem.label,
                        uniqueId: this.state.formId,
                        moduleLable: this.props.validLabel,
                      });
                    },
                  );
                }
              }}
              scrolled
            />
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({recordViewer}) => {
  const {label, recordId, uniqueId} = recordViewer;
  return {label, recordId, uniqueId};
};

export default connect(mapStateToProps, null, null, {forwardRef: true})(
  ReferenceType,
);
