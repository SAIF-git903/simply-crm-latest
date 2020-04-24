import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, Text } from 'react-native';
import StatusView from './statusView';
import { commonStyles } from '../../../styles/common';
import { fetchRefRecord, refreshRefRecord, getNextRefPageRecord, markReferenceLabel } from '../../../actions';
import { recordRefListRendererHelper } from '../../../helper';

class Lister extends Component {
    constructor(props) {
        super(props);
        this.onEndReachedCalledDuringMomentum = true;
        this.state = {
            loading: false,
            isFlatListRefreshing: false,
            data: [],
            selectedIndex: -1,
            nextPage: false,
            pageToTake: 0,
            statusText: '',
            statusTextColor: '#000000',
        };
    }

    componentWillMount() {
        this.getRecords();
        // this.getModuleId();
    }

    componentWillReceiveProps(newprops) {
        this.props = newprops;
        this.getRecords();
    }

    onRecordSelect(id, lable, index) {
        console.log(id);
        let recordId = id;
        if (this.props.moduleName === 'Users') {
            recordId = `19x${id}`;
        }
        this.setState({ selectedIndex: index });
        this.props.navigation.goBack(null);
        this.props.dispatch(markReferenceLabel(recordId, lable, this.props.uniqueId));
    }

    onEndReached() {
        // if (!this.onEndReachedCalledDuringMomentum) {
        if (this.state.nextPage) {
            this.setState({ pageToTake: this.state.pageToTake + 1 }, () => this.props.dispatch(getNextRefPageRecord(this)));
        }
        // }
    }

    // getModuleId() {

    // }

    getRecords() {
        this.setState({ loading: true, data: [], selectedIndex: -1, statusText: 'Fetching Record', statusTextColor: '#000000' });
        this.props.dispatch(fetchRefRecord(this));
    }

    refreshData() {
        this.setState({ isFlatListRefreshing: true, selectedIndex: -1, statusText: 'Refreshing', statusTextColor: '#000000' });
        this.props.dispatch(refreshRefRecord(this));
    }

    renderFooter() {
        if (this.state.nextPage) {
            return (
                <View
                    style={{ width: '100%', justifyContent: 'space-around', alignItems: 'center', height: 50, flexDirection: 'row' }}
                >
                    <Text>Getting next page</Text>
                    <ActivityIndicator />
                </View>
            );
        }
    }

    renderLoading() {
        return (
            <View style={{ width: '100%', height: 50, alignItems: 'center', paddingTop: 10 }}>
                <ActivityIndicator color={'#000000'} />
            </View>
        );
    }

    renderRecordList() {
        return (
            <View style={{ flex: 1, width: '100%' }}>
                {recordRefListRendererHelper(this)}
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
            </View>
        );
    }
}

const mapStateToProps = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProps)(Lister);

