import React, { Component } from 'react';
import { View, ActivityIndicator, ScrollView, Platform, Keyboard } from 'react-native';
import { describeRecordHelper, copyPriceDetails } from '../../helper';
import SectionBox from '../common/section/sectionBox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class Viewer extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, inputForm: [] };
    }

    componentDidMount() {
        this.props.onRef(this);
        this.onFetchCall();
    }

    onFetchCall() {
        this.setState({ loading: true });
        describeRecordHelper(this);
    }
    onCopyPriceDetails(priceFields, stockFields) {

        copyPriceDetails(this, priceFields, stockFields);
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
            <KeyboardAwareScrollView
                enableResetScrollToCoords={false}
                onScrollBeginDrag={() => {
                    if (Platform.OS === 'ios') {
                        return;
                    }

                    Keyboard.dismiss();
                }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingTop: 10 }}
            >
                <SectionBox style={{ paddingRight: 10 }}>
                    {this.state.inputForm}
                </SectionBox>
            </KeyboardAwareScrollView>
        );
    }

    render() {
        // console.log(this.state.inputForm.length);
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f3f8' }}>
                {
                    (this.state.loading) ?
                        this.renderLoading() :
                        this.renderRecordView()
                }
            </View>
        );
    }
}

export default Viewer;
