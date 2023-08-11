import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RECORD_COLOR, RECORD_SELECTED_COLOR } from '../../../variables/themeColors';
import {commonStyles, fontStyles} from '../../../styles/common';

class ReferenceRecordItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    renderLabel(label, index) {
        if (!label || label.length === 0) return null;

        return (
            <Text
                key={index+2}
                numberOfLines={1}
                style={fontStyles.dashboardRecordLabel}
            >
                {label}
            </Text>
        );
    }

    renderLabels(labels) {
        return labels.map(this.renderLabel);
    }

    renderLoading() {
        return (
            <View
                style={[styles.backgroundStyle, {
                    borderTopWidth: (this.props.index === 0) ? 1 : 0,
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: (this.props.selectedIndex === this.props.index) ? RECORD_SELECTED_COLOR : RECORD_COLOR
                }]}
            >
                <Text style={fontStyles.fieldValue}>Loading.....</Text>
                <ActivityIndicator />
            </View>
        );
    }

    renderLine() {
        let recordName = this.props.recordName;
        let no_tittle_style = {};
        if (recordName === '') {
            recordName = '*empty title*';
            no_tittle_style = commonStyles.no_tittle;
        }
        return (
            <TouchableOpacity
           
                onPress={() => {
                    this.props.onRecordSelect(this.props.id, recordName, this.props.index);
                }}
            >
                <View
                    style={[styles.backgroundStyle, {
                        borderTopWidth: (this.props.index === 0) ? 1 : 0,
                        backgroundColor: (this.props.selectedIndex === this.props.index) ? RECORD_SELECTED_COLOR : RECORD_COLOR
                    }]}
                >
                    <Text
                        key={1}
                        numberOfLines={1}
                        style={[fontStyles.dashboardRecordLabelBig, no_tittle_style]}
                        //calendar, comment, faq, pbx, priceBooks, projectMilestone, projectTask, purchaseOrder, quotes, serviceContracts, SMSnotifier, tickets style
                        // style={{ fontWeight: 'bold', marginLeft: 10, paddingRight: 10 }}
                        //document style
                        //style={{ fontWeight: 'bold', marginLeft: 10, paddingRight: 10, color: 'black' }}
                    >
                        {recordName}
                    </Text>
                    {(this.props.labels) ? this.renderLabels(this.props.labels) : null}
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            (this.state.loading) ? this.renderLoading() : this.renderLine()
        );
    }
}

export default connect(null)(ReferenceRecordItem);

const styles = StyleSheet.create({
    //TODO combine this and more with basic recordItem
    backgroundStyle: {
        flex: 1,
        borderColor: '#f2f3f8',
        borderBottomWidth: 1,
        padding: 15
    }
    //asset, calendar, comment, document, faq, pbx, priceBooks, projectMilestone, projectTask, purchaseOrder, quotes, serviceContracts, SMSnotifier, tickets styles
    // backgroundStyle: {
    //     flex: 1,
    //     height: 45,
    //     borderColor: '#d3d3d3',
    //     paddingLeft: 5,
    //     justifyContent: 'space-around',
    //     paddingRight: 5,
    //     borderBottomWidth: 1
    // }
});
