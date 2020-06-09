import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import store from '../../store';
import StatusView from './statusView';
import { commonStyles } from '../../styles/common';
import { viewRecordRendererActions, refreshRecordData } from '../../actions';

class Viewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isScrollViewRefreshing: false,
            data: [],
            statusText: '',
            statusTextColor: '#000000',
        };
    }

    UNSAFE_componentWillMount() {
        this.getRecords();
    }

    getRecords() {
        this.setState({ loading: true, data: [], statusText: '', statusTextColor: '#000000', recordId: this.props.recordId });
        this.props.dispatch(viewRecordRendererActions(this));
    }

    refreshData() {
        this.setState({ isScrollViewRefreshing: true, statusText: 'Refreshing', statusTextColor: '#000000' });
        this.props.dispatch(refreshRecordData(this));
    }

    renderLoading() {
        return (
            <View style={{ width: '100%', height: 50, alignItems: 'center', marginTop: 30 }}>
                <ActivityIndicator color={'#000000'} />
            </View>
        );
    }

    renderRecordView() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isScrollViewRefreshing}
                        onRefresh={this.refreshData.bind(this)}
                    />
                }
                onRefresh={this.refreshData.bind(this)}
                refreshing={this.state.isFlatListRefreshing}
            >
                {this.state.data}
            </ScrollView>
        );
    }

    render() {
        return (
            <View style={[commonStyles.recordViewerBackground, {
                backgroundColor: '#f2f3f8',
                paddingBottom: 10
            }]} >
                {
                    (this.state.loading) ?
                        this.renderLoading() :
                        this.renderRecordView()
                }
                {/* <StatusView text={this.state.statusText} textColor={this.state.statusTextColor} /> */}
            </View>
        );
    }
}
// const mapStateToProps = ({ drawer }) => {
//     const { moduleId } = drawer;
//     return { moduleId };
// };
export default connect(null)(Viewer);

