import React, {Component, createRef} from 'react';
import {View, StyleSheet, TextInput, Platform} from 'react-native';
import {fontStyles} from '../../styles/common';
import IconButton from '../../components/IconButton';
import {connect} from 'react-redux';

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.searchboxRef = createRef();
    this.state = {
      data: [],
      moduleName: this.props.moduleName,
    };
  }

  onChangeText(text) {
    this.props.onChangeText(text);
  }

  onSubmit() {
    if (this.props.searchText.length === 0 || this.props.disabled) {
      return;
    }

    this.searchboxRef.current?.blur();
    this.props.doSearch(this.props.searchText);
  }

  render() {
    const {style} = this.props;
    const {searchText} = this.props;

    return (
      <View height={40} style={[style, styles.wrapper]}>
        <IconButton
          icon={'search'}
          color={'#707070'}
          size={25}
          onPress={() => {
            this.onSubmit();
          }}
        />
        <TextInput
          autoGrow={true}
          autoCorrect={false}
          spellCheck={false}
          underlineColorAndroid={'transparent'}
          style={[
            fontStyles.searchBoxLabel,
            styles.searchBoxField,
            {marginBottom: Platform.OS === 'android' ? -5 : 0},
          ]}
          placeholder="Search"
          placeholderTextColor="#707070"
          ref={this.searchboxRef}
          onSubmitEditing={() => this.onSubmit()}
          autoCapitalize="none"
          returnKeyType="done"
          value={searchText}
          onChangeText={this.onChangeText.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    // backgroundColor: '#E5E6EA',
    backgroundColor: '#FFF',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    paddingVertical: 23,
    borderWidth: 1,
    borderColor: '#dfdfdf',
  },
  searchBoxField: {
    // flex: 1,
    width: '85%',
    marginLeft: 10,
  },
});

const mapStateToProps = ({event, mgr, drawer}) => {
  const {searchModuleName} = mgr;
  const {isPortrait, width, height} = event;
  const {moduleId} = drawer;
  return {searchModuleName, isPortrait, width, height, moduleId};
};

export default connect(mapStateToProps)(SearchBox);
