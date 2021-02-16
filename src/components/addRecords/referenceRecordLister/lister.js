import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, Text } from 'react-native';
import { commonStyles } from '../../../styles/common';
import { fetchRefRecord, refreshRefRecord, getNextRefPageRecord, markReferenceLabel } from '../../../actions';

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
            pageToTake: 1,
            statusText: '',
            statusTextColor: '#000000',
        };
    }

    UNSAFE_componentWillMount() {
        this.getRecords();
    }

    onRecordSelect(id, lable, index) {
        let recordId = id;
        if (this.props.moduleName === 'Users') {
            recordId = `19x${id}`;
        }
        this.setState({
            selectedIndex: index
        },() => {
            this.props.navigation.goBack();
            this.props.dispatch(markReferenceLabel(recordId, lable, this.props.uniqueId));
        });
    }

    onEndReached() {
        if (!this.onEndReachedCalledDuringMomentum) {
            if (this.state.nextPage) {
                this.setState({
                    pageToTake: this.state.pageToTake + 1
                }, () => {
                    this.props.dispatch(getNextRefPageRecord(this));
                });
            }
        }
    }

    getRecords() {
        this.setState({
            loading: true,
            isFlatListRefreshing: false,
            nextPage: false,
            data: [],
            selectedIndex: -1,
            statusText: 'Fetching Record',
            statusTextColor: '#000000'
        }, () => {
            this.props.dispatch(fetchRefRecord(this));
        });
    }

    refreshData() {
        this.setState({
            loading: false,
            isFlatListRefreshing: true,
            nextPage: false,
            // data: [],
            selectedIndex: -1,
            statusText: 'Refreshing',
            statusTextColor: '#000000'
        }, () => {
            this.props.dispatch(refreshRefRecord(this));
        });
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

    doRender() {
        let view;
        if (this.state.loading) {
            view = (
                <View style={{ width: '100%', height: 50, alignItems: 'center', paddingTop: 10 }}>
                    <ActivityIndicator color={'#000000'} />
                </View>
            );
        } else {
            view = (
                <View style={{ flex: 1, width: '100%' }}>
                    {recordListRendererHelper(this, false, true)}
                </View>
            );
        }
        return view;
    }

    render() {
        return (
            <View style={commonStyles.recordListerBackground} >
                {this.doRender()}
            </View>
        );
    }
}

const mapStateToProps = ({ event }) => {
    const { isPortrait, width, height } = event;
    return { isPortrait, width, height };
};

export default connect(mapStateToProps)(Lister);
