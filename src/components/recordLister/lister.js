import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, Text } from 'react-native';
import SearchBox from '../common/searchBox';
import { commonStyles, fontStyles } from '../../styles/common';
import { fetchRecord, viewRecordAction, refreshRecord, getNextPageRecord } from '../../actions';
import { recordListRendererHelper } from '../../helper';

class Lister extends Component {
    constructor(props) {
        super(props);
        this.onEndReachedCalledDuringMomentum = true;
        this.state = {
            //label when search is active
            searchLabel: null,

            //progressbars
            searching: false,//onSearch
            loading: false,//onGetRecords and onRefresh
            isFlatListRefreshing: false,//onGetNextPage

            nextPage: false,//is the next page of the list of records available

            //request params
            data: [],//current records on page
            pageToTake: 1,//current page
            searchText: '',//text for search

            selectedIndex: -1,
            statusText: '',
            statusTextColor: '#000000',
            navigation: this.props.navigation
        };
    }

    componentDidMount() {
        this.getRecords();
    }

    UNSAFE_componentWillReceiveProps(newprops) {
        this.setState({ loading: true, searching: false, searchLabel: null });
        this.props = newprops;
        if (this.props.saved !== 'not_saved') {
            this.getRecords();
        }
    }

    onRecordSelect(id, index) {
        this.setState({ selectedIndex: index });
        this.props.dispatch(viewRecordAction(id, this));
    }

    onEndReached() {
        if (!this.onEndReachedCalledDuringMomentum) {
            if (this.state.nextPage) {
                this.setState({
                    pageToTake: this.state.pageToTake + 1
                }, () => {
                    this.props.dispatch(getNextPageRecord(this, this.props.moduleName));
                });
            }
        }
    }

    // onAddButtonPress() {
    //     const { navigate } = this.props.navigation;
    //     navigate('AddRecordScreen');
    // }

    getRecords() {
        this.setState({
            searchLabel: null,
            searching: false,
            loading: true,
            isFlatListRefreshing: false,
            nextPage: false,
            data: [],
            pageToTake: 1,
            searchText: '',
            selectedIndex: -1,
            statusText: 'Fetching Record',
            statusTextColor: '#000000'
        }, () => {
            this.props.dispatch(fetchRecord(this, this.props.moduleName));
            if (this.props.saved === 'saved') {
                this.refreshData();
            }
        });
    }

    refreshData() {
        this.setState({
            searchLabel: null,
            searching: false,
            loading: false,
            isFlatListRefreshing: true,
            nextPage: false,
            // data: [],
            pageToTake: 1,
            selectedIndex: -1,
            statusText: 'Refreshing',
            Color: '#000000'
        }, () => {
            this.props.dispatch(refreshRecord(this, this.props.moduleName));
        });
    }

    doSearch(searchText) {
        this.setState({
            searchLabel: null,
            searching: true,
            loading: false,
            isFlatListRefreshing: false,
            nextPage: false,
            // data: [],
            pageToTake: 1,
            selectedIndex: -1,
            statusText: 'Searching .....',
            Color: '#000000'
        }, () => {
            this.props.dispatch(fetchRecord(this, this.props.moduleName));
        });
    }

    doRender() {
        let view;
        if (this.state.loading) {
            view = (
                <View style={{ width: '100%', height: 50, alignItems: 'center', marginTop: 20 }}>
                    <ActivityIndicator color={'#000000'} />
                </View>
            );
        } else {
            view = (
                <View style={{
                    flex: 1
                }}>
                    <View style={{
                        padding: 15,
                        paddingBottom: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 40
                    }}>
                        <SearchBox
                            searchText={this.state.searchText}
                            disabled={this.state.searching}
                            moduleName={this.props.moduleName}
                            onChangeText={(searchText) => this.setState({ searchText: searchText })}
                            doSearch={(searchText) => this.doSearch(searchText)}
                        />
                    </View>
                    <View style={{
                        flex: 1
                    }}>
                        {this.renderSearching()}
                    </View>
                </View>
            );
        }
        return view;
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

    renderSearching() {
        let view;
        if (this.state.searching) {
            view = (
                <View style={{ width: '100%', height: 50, alignItems: 'center', marginTop: 20 }}>
                    <Text style={[fontStyles.fieldLabel, { paddingBottom: 10, fontSize: 14 }]}>Searching...</Text>
                    <ActivityIndicator color={'#000000'} />
                </View>
            );
        } else {
            view = (
                <View style={{ flex: 1 }}>
                    {this.renderSearchLabel()}
                    {recordListRendererHelper(this)}
                </View>
            );
        }
        return view;
    }

    renderSearchLabel() {
        let view;
        if (this.state.searchLabel) {
            view = (
                <View style={{ paddingTop: 10, alignItems: 'center' }}>
                    <Text style={fontStyles.fieldLabel}>
                        {this.state.searchLabel}
                    </Text>
                    <Text
                        onPress={() => this.getRecords()}
                        style={[fontStyles.fieldLabel, { fontSize: 14, paddingTop: 5, color: '#007aff' }]}
                    >
                        Go Back
                    </Text>
                </View>
            );
        } else {
            view = null;
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

const mapStateToProps = ({ event, recordViewer, drawer }) => {
    const { isPortrait, width, height } = event;
    const { saved } = recordViewer;
    const { moduleId } = drawer;
    return { isPortrait, width, height, saved, moduleId };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(Lister);

