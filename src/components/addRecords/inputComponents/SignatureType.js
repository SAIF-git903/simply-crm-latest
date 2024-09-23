import React, {useRef} from 'react';
import {View, Button} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

const Signature = () => {
  const ref = useRef();

  // Handle the signature when it's submitted
  const handleSignature = (signature) => {
    console.log(signature); // Base64 string of the signature image
  };

  return (
    <View style={{flex: 0.55}}>
      <SignatureScreen
        ref={ref}
        onOK={handleSignature}
        penColor="blue"
        backgroundColor="#f0f0f0"
        descriptionText="Please sign below"
        clearText="Erase"
        confirmText="Done"
        webStyle={`
    .m-signature-pad {
      box-shadow: none; 
      border: none;
    }
    .m-signature-pad--body {
      border: 1px solid #eaeaea;
    }
  `}
      />
    </View>
  );
};

export default Signature;
