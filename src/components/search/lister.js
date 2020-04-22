import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import StatusView from './statusView';
import { commonStyles } from '../../styles/common';
import { fetchRecord, viewRecordAction } from '../../actions';
import { searchRecordListRendererHelper } from '../../helper';

class Lister extends Component {
    constructor(props) {
        super(props);
        this.onEndReachedCalledDuringMomentum = true;
        this.state = {
            loading: false,
            data: [],
            selectedIndex: -1,
            pageToTake: 0,
            statusText: 'Click search button to search',
            statusTextColor: '#000000',
            navigation: this.props.navigation,
            //recordId: `${this.props.moduleId}x${this.props.recordId}`
        };
    }

    componentWillReceiveProps(newprops) {
        this.props = newprops;
        this.setState({
            data: this.props.data,
            statusText: this.props.statusText,
            statusTextColor: this.props.statusTextColor
        });
    }

    onRecordSelect(id, index) {
        this.setState({ selectedIndex: index });
        this.props.dispatch(viewRecordAction(id, this));
    }


    getRecords() {
        // console.log(this.props.moduleId);
        this.setState({ loading: true, data: [], selectedIndex: -1, statusText: 'Fetching Record', statusTextColor: '#000000' });
        this.props.dispatch(fetchRecord(this));
    }

    renderLoading() {
        return (
            <View style={{ width: '100%', height: 50, alignItems: 'center', marginTop: 20 }}>
                <ActivityIndicator color={'#000000'} />
            </View>
        );
    }

    renderRecordList() {
        return (
            <View style={{ flex: 1, width: '100%', marginTop: 20 }}>
                {searchRecordListRendererHelper(this)}
            </View>
        );
    }

    render() {
        return (
            <View style={commonStyles.recordListerBackground} >
                {
                    (this.state.loading) ?
                        this.renderLoading() :
                        this.renderRecordList()
                }
                <StatusView text={this.state.statusText} textColor={this.state.statusTextColor} />
            </View>
        );
    }
}

const mapStateToProps = ({ event }) => {
    const { isPortrait, width, height } = event;

    return { isPortrait, width, height };
};

export default connect(mapStateToProps)(Lister);

