import React, {Component} from 'react';
import {View, Text, Linking, Platform} from 'react-native';
import {fontStyles} from '../../styles/common';
import {API_trackCall} from '../../helper/api';

export default class Field extends Component {
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

  render() {
    // let txt =
    //   'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
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
          padding: 10,
        }}>
        <View style={{width: '40%'}}>
          <Text style={fontStyles.fieldLabel} numberOfLines={2}>
            {this.props.label}:
          </Text>
        </View>
        <View style={{width: '60%'}}>
          {this.props.modal ? (
            this.props.modal
          ) : (
            <Text
              onPress={() => this.onPressAction()}
              style={
                this.props.isLocation
                  ? fontStyles.fieldValueLocation
                  : [
                      fontStyles.fieldValue,
                      {
                        textAlign:
                          this.props.label === 'Organization Name'
                            ? this.props.value.length < 74
                              ? 'center'
                              : 'left'
                            : 'left',
                      },
                    ]
              }
              selectable={true}
              numberOfLines={3}>
              {this.props.value}
            </Text>
          )}
        </View>
      </View>
    );
  }
}
