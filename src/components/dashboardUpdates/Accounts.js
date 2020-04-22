import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity,
    StyleSheet
} from 'react-native';
import { fontStyles } from '../../styles/common';

class Accounts extends Component {
    renderLabel(label) {
        if (!label || label.length === 0) return null;

        return <Text
            numberOfLines={1}
            style={fontStyles.dashboardRecordLabel}
        >
            {label}
        </Text>
    }

    render() {
        console.log(this.props.item)
        return (
            <TouchableOpacity
                onPress={() => { this.props.onRecordSelect(this.props.item.id, this.props.index); }}
            >
                <View
                    style={[styles.backgroundStyle, {
                        borderTopWidth: (this.props.index === 0) ? 1 : 0,
                    }]}
                >
                    <Text
                        numberOfLines={1}
                        style={fontStyles.dashboardRecordLabelBig}
                    >
                        {this.props.item.accountname}
                    </Text>
                    {this.renderLabel(this.props.item.website)}
                    {this.renderLabel(this.props.item.phone)}
                    {this.renderLabel(this.props.item.email)}
                </View>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        borderColor: '#f2f3f8',
        borderBottomWidth: 1,
        padding: 15
    }
});

export default Accounts;
