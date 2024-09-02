import React, {Component} from 'react';
import {View, Text, Linking, Platform, TouchableOpacity} from 'react-native';
import {fontStyles} from '../../styles/common';
import {API_trackCall} from '../../helper/api';
import IconButton from '../IconButton';
import {TextInput} from 'react-native-gesture-handler';

export default class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
    };
  }

  getColorForLeadSource(leadSource) {
    const {colorsType} = this.props;
    if (colorsType && colorsType[leadSource]) {
      return colorsType[leadSource];
    }
    return '';
  }

  onPressAction() {
    const {uiType, value} = this.props;
    switch (uiType) {
      case '11':
        Linking.openURL(`tel:${value}`).then(() => {
          API_trackCall(this.props.recordId);
        });
        break;

      case '13':
        Linking.openURL(`mailto:${value}`);
        break;

      case '17':
        let website = value;
        const isHttp = website.includes('http://');
        if (isHttp) {
          website = website.replace('http://', 'https://');
        }
        const isHttps = website.includes('https://');
        Linking.openURL(`${isHttps ? '' : 'https://'}${website}`);
        break;

      default:
        break;
    }
    //process location field for Calendar/Event module
    if (this.props.isLocation) {
      const query = value.replace(/ /g, '+');
      if (Platform.OS === 'ios') {
        //let encodedName = "address" + stringByAddingPercentEncodingWithAllowedCharacters(.URLQueryAllowedCharacterSet()) ?? "";
        Linking.openURL(`http://maps.apple.com/?q=${query}`);
      } else {
        Linking.openURL(`geo:0,0?q=${query}`);
      }
    }
  }

  updatePassword = () => {
    console.log('hi');
  };
  isLightColor = (hexColor) => {
    // Convert hex color to RGB object
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex?.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return {r, g, b};
    };

    // Calculate luminance
    const rgb = hexToRgb(hexColor);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    // You can adjust the threshold based on your preference
    return luminance > 0.5; // If luminance is greater than 0.5, consider it a light color
  };

  render() {
    const {showPassword} = this.state;
    const {label, uiType, value, isLocation} = this.props;
    const color = this.getColorForLeadSource(value);
    const textColor = this.isLightColor(color) ? 'black' : 'white';
    return (
      <View
        style={{
          width: '100%',
          // maxHeight: 70,
          // height: 70,
          flexDirection: 'row',
          borderBottomWidth: 0.5,
          borderColor: '#f2f3f8',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: uiType === '19' ? 0 : 10,
        }}>
        <View style={{width: '40%'}}>
          <Text style={fontStyles.fieldLabel} numberOfLines={2}>
            {this.props.label}:
          </Text>
        </View>
        <View
          style={{
            width: '60%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {this.props.modal ? (
            this.props.modal
          ) : (
            <View
              style={{
                backgroundColor: color,
                borderRadius: 3,
              }}>
              {uiType === '19' ? (
                <>
                  {this.props.value ? (
                    <TextInput
                      editable={false}
                      value={this.props.value ? this.props.value : 'N/A'}
                      multiline={true}
                      style={[
                        fontStyles.fieldValue,

                        {
                          color: color
                            ? textColor
                            : this.props.value
                            ? '#000'
                            : '#707070',
                        },
                      ]}
                    />
                  ) : (
                    <Text
                      style={[
                        fontStyles.fieldValue,
                        {
                          paddingVertical: 10,
                          color: '#707070',
                        },
                      ]}>
                      N/A
                    </Text>
                  )}
                </>
              ) : (
                <Text
                  onPress={() => this.onPressAction()}
                  style={
                    this.props.isLocation
                      ? fontStyles.fieldValueLocation
                      : [
                          fontStyles.fieldValue,
                          {
                            paddingHorizontal: 5,
                            color: color
                              ? textColor
                              : this.props.value
                              ? '#000'
                              : '#707070',
                          },
                        ]
                  }
                  selectable={true}
                  numberOfLines={3}>
                  {this.props.uiType === '179'
                    ? showPassword === true
                      ? this.props.value
                      : '*'.repeat(this.props.value?.length)
                    : this.props.value
                    ? this.props.value
                    : 'N/A'}
                </Text>
              )}
            </View>
          )}
          {this.props.uiType === '179' && (
            <View style={{marginRight: 10}}>
              <IconButton
                solid
                color={'#000'}
                icon={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                onPress={() => {
                  this.setState({showPassword: !showPassword}),
                    this.updatePassword();
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}
