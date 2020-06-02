import React, { Component } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { connect } from 'react-redux';
import { dashboardHelper } from '../../helper';
import {
    viewRecordAction,
    refreshWidgetRecord,
    getNextPageRecord,
    displayRecords
} from '../../actions';
import StatusView from './statusView';

class Viewer extends Component {
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

    UNSAFE_componentWillMount() {
        this.fetchRecord();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        //console.log('ReceiveProps');
        this.props = newProps;
        //console.log(this.props.moduleName);
        this.fetchRecord();
    }

    onEndReached() {
        if (!this.onEndReachedCalledDuringMomentum) {
            if (this.state.nextPage) {
                this.props.getNextPageRecord(this);
            }
        }
    }

    onRecordSelect(id, index) {
        this.setState({ selectedIndex: index });
        this.props.viewRecordAction(id, this);
    }

    fetchRecord() {
        this.setState({ loading: true, data: [], selectedIndex: -1, statusText: 'Fetching Record', statusTextColor: '#000000' });
        this.props.displayRecords(this);
    }

    refreshData() {
        this.setState({ isFlatListRefreshing: true, selectedIndex: -1, statusText: 'Refreshing', statusTextColor: '#000000' });
        this.props.refreshWidgetRecord(this);
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
        ////console.log(this.state.data);
        return (
            <View style={{
                width: '100%'
            }}>
                {dashboardHelper(this)}
            </View>

        );
    }

    render() {
        return (
            <View style={styles.subContainer}>
                {
                    (this.state.loading) ?
                        this.renderLoading() :
                        this.renderRecordList()
                }
            </View>
        );
    }
}
const styles = {
    subContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        position: 'relative',
        //alignItems: 'center',  
        flex: 1
    },
};

const mapStateToProps = ({ dashboardUpdate }) => {
    const { moduleName } = dashboardUpdate;
    return { moduleName };
};
export default connect(mapStateToProps, {
    displayRecords,
    viewRecordAction,
    refreshWidgetRecord,
    getNextPageRecord
})(Viewer);
