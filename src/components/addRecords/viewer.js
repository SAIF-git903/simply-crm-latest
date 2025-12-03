import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ActivityIndicator,
  ScrollView,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {getRecordStructureHelper, copyPriceDetails} from '../../helper';
import {generalBgColor} from '../../variables/themeColors';
import store from '../../store';
import {isSession} from '../../actions';

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      inputForm: [],
      inputInstance: [],
      id: this.props.moduleId,
      recordId: this.props.recordId ? this.props.recordId : '',
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    // Only fetch if moduleName is available
    if (this.props.moduleName) {
      this.onFetchCall();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isSession) {
      this.props.onRef(this);
      this.onFetchCall();
      store.dispatch(isSession(false));
    }
    // Re-fetch if moduleName changed from undefined/null to a value, or recordId changed
    const moduleNameChanged = prevProps.moduleName !== this.props.moduleName;
    const recordIdChanged = prevProps.recordId !== this.props.recordId;
    const moduleNameNowAvailable = !prevProps.moduleName && this.props.moduleName;
    
    if (
      (moduleNameChanged || recordIdChanged || moduleNameNowAvailable) &&
      this.props.moduleName &&
      !this.state.loading
    ) {
      console.log('Viewer: Props changed, re-fetching. moduleName:', this.props.moduleName);
      this.onFetchCall();
    }
  }

  // componentWillUnmount() {
  //     console.log('unmount');
  // }

  // componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
  //     if (prevState.inputInstance !== this.state.inputInstance) {
  //         console.log('prevState.inputInstance');
  //         // console.log(prevState.inputInstance);
  //         console.log('this.state.inputInstance');
  //         // console.log(this.state.inputInstance);
  //     }
  // }

  onFetchCall() {
    // Don't fetch if moduleName is not available
    if (!this.props.moduleName) {
      console.log('Viewer: moduleName not available, skipping fetch');
      return;
    }
    
    console.log('Viewer: Fetching with moduleName:', this.props.moduleName, 'recordId:', this.props.recordId);
    this.setState(
      {
        loading: true,
      },
      () => {
        getRecordStructureHelper(this);
      },
    );
  }

  onCopyPriceDetails(priceFields, stockFields) {
    copyPriceDetails(this, priceFields, stockFields);
  }

  doRender() {
    console.log('Viewer doRender:', {
      loading: this.state.loading,
      inputFormLength: this.state.inputForm?.length,
      moduleName: this.props.moduleName,
      recordId: this.props.recordId,
    });
    
    let view;
    if (this.state.loading) {
      view = (
        <View
          style={{
            width: '100%',
            height: 50,
            alignItems: 'center',
            marginTop: 30,
          }}>
          <ActivityIndicator color={'#000000'} />
        </View>
      );
    } else {
      view = (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={122}>
          <ScrollView
            scrollEnabled={this?.props?.isScroll}
            enableResetScrollToCoords={false}
            onScrollBeginDrag={() => {
              if (Platform.OS === 'ios') {
                return;
              }

              Keyboard.dismiss();
            }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{paddingTop: 10}}>
            {this.state.inputForm}
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }
    return view;
  }

  render() {
    // console.log('rerender viewer');
    return (
      <View style={{flex: 1, backgroundColor: generalBgColor}}>
        {this.doRender()}
      </View>
    );
  }
}

const mapStateToProps = ({drawer, scrollReducer, sessionReducer}) => {
  const {moduleId} = drawer;
  const {isScroll} = scrollReducer;
  const {isSession} = sessionReducer;
  return {moduleId, isScroll, isSession};
};

export default connect(mapStateToProps)(Viewer);
