import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, ActivityIndicator, Text, TouchableOpacity,
    StyleSheet
} from 'react-native';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../../../variables/themeColors';

import { fontStyles } from '../../../../styles/common';

class AccountsRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

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
        if (!this.state.loading) {
            return (

                <TouchableOpacity
                    onPress={() => { this.props.onRecordSelect(this.props.item.id, this.props.item.accountsLable, this.props.index); }}
                >
                    <View
                        style={[styles.backgroundStyle, {
                            borderTopWidth: (this.props.index === 0) ? 1 : 0,
                            backgroundColor:
                                (this.props.selectedIndex === this.props.index) ?
                                    RECORD_SELECTED_COLOR : RECORD_COLOR
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={fontStyles.dashboardRecordLabelBig}
                        >
                            {this.props.item.accountsLable}
                        </Text>
                        {this.renderLabel(this.props.item.website)}
                        {this.renderLabel(this.props.item.phone)}
                        {this.renderLabel(this.props.item.email)}
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
                            RECORD_SELECTED_COLOR : RECORD_COLOR
                }]}
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
        borderColor: '#f2f3f8',
        borderBottomWidth: 1,
        padding: 15
    }
});

export default connect(null)(AccountsRecord);
