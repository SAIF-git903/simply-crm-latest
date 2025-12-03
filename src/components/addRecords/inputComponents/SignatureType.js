import React, {Component, createRef} from 'react';
import {Button, Image, Text, View} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import {commonStyles} from '../../../styles/common';
import {headerIconColor} from '../../../variables/themeColors';
import {isScroll} from '../../../actions';
import store from '../../../store';

class Signature extends Component {
  constructor(props) {
    super(props);
    this.signatureRef = createRef(null);

    // Declare state
    this.state = {
      saveValue:
        this.props.obj.currentValue !== undefined
          ? this.props.obj.currentValue
          : this.props.obj.default,
      fieldName: this.props.obj.name,
      hasSigned: false,
      screensEnabled: true,
    };
  }

  // Handle the signature when it's submitted
  handleSignature = (signature) => {
    console.log(signature); // Base64 string of the signature image

    // Update state with signature data
    this.setState({
      saveValue: signature,
      hasSigned: true,
    });
  };

  handleClear = () => {
    this.signatureRef.current.clearSignature();
    this.setState({
      saveValue: '',
      hasSigned: false,
    });
  };

  handleConfirm = () => {
    this.signatureRef.current.readSignature();
  };

  render() {
    const imgWidth = '100%';
    const imgHeight = 256;
    return (
      <View
        style={[
          commonStyles.inputHolder,
          {width: imgWidth, height: this.state.saveValue ? 400 : imgHeight},
        ]}>
        <View>{this.props.fieldLabelView}</View>
        <View>
          {this.state.saveValue ? (
            <Image
              resizeMode={'contain'}
              style={{width: 100, height: 100}}
              source={{uri: this.state.saveValue}}
            />
          ) : null}
        </View>
        <SignatureScreen
          ref={this.signatureRef}
          onOK={this.handleSignature}
          backgroundColor="#f0f1f5"
          penColor={headerIconColor}
          webStyle={`
              .m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}
          `}
          onBegin={() => store.dispatch(isScroll(false))} // Disable scroll on signature interaction
          onEnd={() => store.dispatch(isScroll(true))} // Re-enable scroll when signature ends
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Button title="Clear" onPress={this.handleClear} />
          <Button title="Confirm" onPress={this.handleConfirm} />
        </View>

        {/* Optionally display a message if a signature is made */}
        {this.state.hasSigned && (
          <View style={{marginTop: 10}}>
            <Text style={{fontFamily: 'Poppins-SemiBold'}}>
              Signature captured!
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default Signature;
