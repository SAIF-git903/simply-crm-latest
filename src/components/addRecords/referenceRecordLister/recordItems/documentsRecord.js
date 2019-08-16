import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, Image, Alert, Text, TouchableOpacity, 
    StyleSheet } from 'react-native';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../../../variables/themeColors';

class DocumentRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    render() {
        const swipeOutButtons = [{
            component: (
            <View 
            style={{ 
                flex: 1, 
                justifyContent: 'center',
                alignItems: 'center', 
                borderColor: '#d3d3d3',
                borderBottomWidth: 1,
                borderTopWidth: 1,
                backgroundColor: 'red' }} 
            >
                <Image resizeMode={'contain'} source={{ uri: 'delete' }} style={{ width: 30, height: 30 }} />
            </View>
        ),
        onPress: this.onDeletePress.bind(this)
        }];

        if (!this.state.loading) {
            return (
                <TouchableOpacity 
                onPress={() => { this.props.onRecordSelect(this.props.item.id, this.props.item.documentLable, this.props.index); }}
                >
                <View 
                style={[styles.backgroundStyle, { 
                    borderTopWidth: (this.props.index === 0) ? 1 : 0,
                    backgroundColor: 
                    (this.props.selectedIndex === this.props.index) ? 
                    RECORD_SELECTED_COLOR : RECORD_COLOR }]}
                >
                    <Text numberOfLines={1} style={{ fontWeight: 'bold', marginLeft: 10, paddingRight: 10 }}>
                        {this.props.item.documentLable}
                    </Text>
                </View>
                </TouchableOpacity>
            );
        } 

        return (
            <View 
            style={[styles.backgroundStyle, { 
                borderTopWidth: (this.props.index === 0) ? 1 : 0,
                justifyContent: 'space-around',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 
                (this.props.selectedIndex === this.props.index) ? 
                RECORD_SELECTED_COLOR : RECORD_COLOR }]}
            >
                <Text>Deleting.....</Text>
                <ActivityIndicator />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        height: 45,
        borderColor: '#d3d3d3',
        paddingLeft: 5,
        justifyContent: 'space-around',
        paddingRight: 5,
        borderBottomWidth: 1
    }
});

export default connect(null)(DocumentRecord);
