import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
      
class EmptyDrawerButton extends Component {
    render() {
       return (
            <View 
            style={{ width: (this.props.width > 600) ? 60 : 75 }}
            />
       );
    }
}

const mapStateToProps = ({ event }) => {
    const { width } = event;
    return { width };    
};

export default connect(mapStateToProps)(EmptyDrawerButton);
