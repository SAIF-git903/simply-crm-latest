import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { searchRecord } from '../../actions';
import { connect } from 'react-redux';
import Header from './header';
import Lister from './lister';

class Search extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.stopExecuting = false;
        this.state = {
            searchText: '',
            data: [],
            searchNo: 0,
            moduleName: this.props.searchModuleName,
            statusText: 'Click search button to search',
            statusTextColor: '#000000'
        };
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
    }
    
    componentWillUnmount() {
        this.setState({
            data: [],
            statusText: 'Searching .....',
            statusTextColor: '#000000',
            searchNo: this.state.searchNo + 1
        });
    }

    onSearch() {
        this.setState({
            data: [],
            statusText: 'Searching .....',
            statusTextColor: '#000000',
            searchNo: this.state.searchNo + 1
        }, () => {
            this.props.dispatch(searchRecord(this));
        });
    }

    onBack() {
        this.setState({
            data: [],
            statusText: 'Searching .....',
            statusTextColor: '#000000',
            searchNo: this.state.searchNo + 1
        });
        this.props.navigation.goBack(null);     
    }

    searchTextChange(text) {
        this.setState({
            searchText: text
        });
    }

    render() {
        return (
            <View style={styles.backgroundStyle}>
                <Header
                navigation={this.props.navigation}
                showBackButton
                searchTextChange={this.searchTextChange.bind(this)}
                onSearch={this.onSearch.bind(this)}
                onBack={this.onBack.bind(this)}
                /> 
                <Lister 
                    data={this.state.data}
                    statusText={this.state.statusText}
                    navigation={this.props.navigation}
                    statusTextColor={this.state.statusTextColor}
                    moduleName={this.state.moduleName}
                />          
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1,
        backgroundColor: 'white'
    }
});

const mapStateToProp = ({ event, mgr, drawer }) => {
    const { searchModuleName } = mgr;
    const { isPortrait, width, height } = event;
    const { moduleId } = drawer;
    return { searchModuleName, isPortrait, width, height, moduleId };
};

export default connect(mapStateToProp)(Search);

