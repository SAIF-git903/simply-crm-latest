import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, Text } from 'react-native';
import ActionButton from 'react-native-action-button';
import { NavigationActions } from 'react-navigation';
import StatusView from './statusView';
import { commonStyles } from '../../styles/common';
import { fetchRecord, viewRecordAction, refreshRecord, getNextPageRecord } from '../../actions';
import { recordListRendererHelper } from '../../helper';

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
            navigation: this.props.navigation 
        };
    }

    componentWillMount() {
        this.getRecords();
    }

    componentWillReceiveProps(newprops) {
        this.props = newprops;
        this.getRecords();
    }

    onRecordSelect(id, index) {
        this.setState({ selectedIndex: index });
        this.props.dispatch(viewRecordAction(id, this));
    }

    onEndReached() {
        console.log(this.onEndReachedCalledDuringMomentum);
        console.log(this.state.nextPage);
        //if (!this.onEndReachedCalledDuringMomentum) {
            if (this.state.nextPage) {
                this.setState({ pageToTake: this.state.pageToTake + 1 }, () => this.props.dispatch(getNextPageRecord(this)));
            }
        //}
    }
    onAddButtonPress() {
        const { navigate } = this.props.navigation;
        navigate('AddRecordScreen');   
    }

    getRecords() {
        this.setState({ loading: true, data: [], selectedIndex: -1, statusText: 'Fetching Record', statusTextColor: '#000000' });
        this.props.dispatch(fetchRecord(this));
        if (this.props.saved === 'saved') {
            this.refreshData();
        }
    }

    refreshData() {
        this.setState({ isFlatListRefreshing: true, selectedIndex: -1, statusText: 'Refreshing', statusTextColor: '#000000' });
        this.props.dispatch(refreshRecord(this));
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
            <View style={{ width: '100%', height: 50, alignItems: 'center', marginTop: 20 }}>
                <ActivityIndicator color={'#000000'} />
            </View>
        );
    }

    renderRecordList() {
        return (
            <View style={{ flex: 1, width: '100%', marginTop: 20 }}>
                {recordListRendererHelper(this)}
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
                <ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => { this.onAddButtonPress(); }} />
            </View>
        );
    }
}

const mapStateToProps = ({ event, recordViewer }) => {
    const { isPortrait, width, height } = event;
    const { saved } = recordViewer;
    return { isPortrait, width, height, saved };
};

export default connect(mapStateToProps)(Lister);

