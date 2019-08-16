import React, { Component } from 'react';
import { View } from 'react-native';
import Header from './Header';
import Viewer from './Viewer';

class UpdateWidget extends Component {
    
    render() {
        return (
           
                <View style={styles.container} >
                    <Header /> 
                    <Viewer navigation={this.props.navigation} />
                </View>
           
        );
    }

}
const styles = {
  
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        backgroundColor: '#ffffff',
        shadowRadius: 2,
        elevation: 2,  
        margin: 5,
        flex: 1
           
    },
};

export default UpdateWidget;
