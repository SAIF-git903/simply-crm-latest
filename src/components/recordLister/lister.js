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
            loading: true,
            isFlatListRefreshing: false,
            data: [],
            selectedIndex: -1,
            nextPage: false,
            pageToTake: 1,
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
            data: [],
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
            isFlatListRefreshing: true,
            selectedIndex: -1,
            pageToTake: 1,
            statusText: 'Refreshing',
            Color: '#000000'
        }, () => {
            this.props.dispatch(refreshRecord(this, this.props.moduleName));
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
                        resetSearch={this.state.isFlatListRefreshing}
                        disabled={this.state.searching}
                        moduleName={this.props.moduleName}
                        onDataReceived={({ data, searchText }) => {
                            if (data.length !== 0) {
                                let searchLabel = searchText.length !== 0 ? `Displaying ${data.length} result(s) for "${searchText}"` : null;
                                this.setState({ data, searching: true, searchLabel });
                            } else {
                                let searchLabel = `No results found for "${searchText}"`;
                                this.setState({ searching: true, data: [], searchLabel });
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
                                {
                                    this.state.searchLabel
                                        ?
                                        <View style={{ paddingTop: 10, alignItems: 'center' }}>
                                            <Text style={fontStyles.fieldLabel}>
                                                {this.state.searchLabel}
                                            </Text>
                                            <Text
                                                onPress={() => {
                                                    this.getRecords();
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

