import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { describeRecordHelper, copyPriceDetails } from '../../helper';
import SectionBox from '../common/section/sectionBox';

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
                keyboardShouldPersistTaps='handled'
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
            <View style={{ flex: 1 }}>
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
