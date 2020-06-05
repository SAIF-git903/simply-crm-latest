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
            searching: false,
            searchText: null,
            loading: true,
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

    UNSAFE_componentWillMount() {
        this.getRecords();
    }

    UNSAFE_componentWillReceiveProps(newprops) {
        this.setState({ loading: true, searching: false, searchText: null, searchLabel: null })
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
        // console.log(this.onEndReachedCalledDuringMomentum);
        // console.log(this.state.nextPage);
        //if (!this.onEndReachedCalledDuringMomentum) {
        if (this.state.nextPage) {
            this.setState({ pageToTake: this.state.pageToTake + 1 }, () => this.props.dispatch(getNextPageRecord(this)));
        }
        //}
    }

    // onAddButtonPress() {
    //     const { navigate } = this.props.navigation;
    //     navigate('AddRecordScreen');
    // }

    getRecords() {
        this.setState({ loading: true, data: [], selectedIndex: -1, statusText: 'Fetching Record', statusTextColor: '#000000' });
        this.props.dispatch(fetchRecord(this, this.props.moduleName));
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

    renderSearching() {
        return (
            <View style={{ width: '100%', height: 50, alignItems: 'center', marginTop: 20 }}>
                <Text style={[fontStyles.fieldLabel, { paddingBottom: 10, fontSize: 14 }]}>Searching...</Text>
                <ActivityIndicator color={'#000000'} />
            </View>
        );
    }

    renderRecordList() {
        return (
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
                        disabled={this.state.searching}
                        moduleName={this.props.moduleName}
                        resetSearch={() => { }}
                        onDataReceived={({ data, searchText }) => {
                            if (data.length !== 0) {
                                let searchLabel = searchText.length !== 0 ? `Displaying ${data.length} result(s) for "${searchText}"` : null
                                this.setState({ data, searchText, searching: true, searchLabel })
                            } else {
                                let searchLabel = `No results found for "${searchText}"`
                                this.setState({ searching: true, searchText: null, data: [], searchLabel })
                            }
                        }}
                        didFinishSearch={() => this.setState({ searching: false })}
                    />
                </View>
                <View style={{
                    flex: 1
                }}>
                    {
                        this.state.searching
                            ?
                            this.renderSearching()
                            :
                            <View style={{ flex: 1 }}>
                                {this.state.searchLabel ?
                                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                                        <Text style={fontStyles.fieldLabel}>{this.state.searchLabel}</Text>
                                        <Text
                                            onPress={() => {
                                                this.setState({ searchLabel: null, searching: false, loading: true, searchText: null }, () => {
                                                    setTimeout(() => {
                                                        this.getRecords()
                                                    }, 500);
                                                })
                                            }}
                                            style={[fontStyles.fieldLabel, { fontSize: 14, paddingTop: 5, color: '#007aff' }]}
                                        >
                                            Go Back
                                            </Text>

                                    </View>
                                    :
                                    null
                                }

                                {recordListRendererHelper(this)}
                            </View>
                    }
                </View>
            </View>
        );
    }

    renderSearch() {
        return <Text>Search</Text>
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

const mapStateToProps = ({ event, recordViewer, drawer }) => {
    const { isPortrait, width, height } = event;
    const { saved } = recordViewer;
    const { moduleId } = drawer;
    return { isPortrait, width, height, saved, moduleId };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(Lister);

