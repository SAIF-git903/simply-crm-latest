import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Platform } from 'react-native';
import { fontStyles } from '../../styles/common';
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

    componentDidUpdate(prevProps, prevState) {
        //to reset search text on refresh lister page
        if (
            prevProps.resetSearch === false
            && this.props.resetSearch === true
        ) {
            this.setState({
                searchText: ''
            });
        }
        //to update search label on lister
        if (
            this.state.data !== prevState.data
        ) {
            this.props.onDataReceived({
                data: this.state.data,
                searchText: this.state.searchText
            });
        }
    }

    onChangeText(text) {
        this.setState({ searchText: text });
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
        const { style } = this.props;
        const { searchText } = this.state;

        return (
            <View
                height={40}
                style={[style, styles.wrapper]}
            >
                <TextInput
                    autoGrow={true}
                    autoCorrect={false}
                    spellCheck={false}
                    underlineColorAndroid={'transparent'}
                    style={[fontStyles.searchBoxLabel, styles.searchBoxField, { marginBottom: Platform.OS === 'android' ? -5 : 0 }]}
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
                    icon={'search'}
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
});

const mapStateToProps = ({ event, mgr, drawer }) => {
    const { searchModuleName } = mgr;
    const { isPortrait, width, height } = event;
    const { moduleId } = drawer;
    return { searchModuleName, isPortrait, width, height, moduleId };
};

export default connect(mapStateToProps)(SearchBox);