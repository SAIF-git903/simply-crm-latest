import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { fontStyles } from '../../styles/common';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import IconButton from '../../components/IconButton';
import { searchRecord } from '../../actions';
import { connect } from 'react-redux';

class SearchBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            data: [],
            searchNo: 0,
            moduleName: this.props.moduleName
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.data !== nextState.data) {
            this.props.onDataReceived({ data: nextState.data, searchText: nextState.searchText, moduleName: this.state.moduleName });
        }
    }

    onChangeText(text) {
        this.setState({ searchText: text })
    }

    onSubmit() {
        if (this.state.searchText.length === 0 || this.props.disabled) return;

        this.refs.searchbox.blur();
        this.setState({
            data: [],
            statusText: 'Searching .....',
            statusTextColor: '#000000',
            searchNo: this.state.searchNo + 1
        }, () => {
            this.props.dispatch(searchRecord(this));
        });
    }

    didFinishSearch() {
        this.props.didFinishSearch();
    }

    render() {
        console.log(this.props.moduleName)
        const { style } = this.props;
        const { searchText } = this.state;

        return (
            <View
                height={40}
                style={[style, styles.wrapper]}
            >
                <TextInput
                    autoCorrect={false}
                    spellCheck={false}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    style={[fontStyles.searchBoxLabel, styles.searchBoxField]}
                    placeholder='Search'
                    placeholderTextColor='#707070'
                    ref='searchbox'
                    onSubmitEditing={() => {
                        this.onSubmit();
                    }}
                    autoCapitalize='none'
                    returnKeyType='done'
                    value={searchText}
                    onChangeText={this.onChangeText.bind(this)}
                />
                <IconButton
                    icon={faSearch}
                    color={'#707070'}
                    size={16}
                    onPress={() => {
                        this.onSubmit();
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        backgroundColor: '#E5E6EA',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderRadius: 8,
        flexDirection: 'row'
    },
    searchBoxField: {
        flex: 1,
        marginRight: 5
    }
})

const mapStateToProps = ({ event, mgr, drawer }) => {
    const { searchModuleName } = mgr;
    const { isPortrait, width, height } = event;
    const { moduleId } = drawer;
    return { searchModuleName, isPortrait, width, height, moduleId };
};

export default connect(mapStateToProps)(SearchBox);