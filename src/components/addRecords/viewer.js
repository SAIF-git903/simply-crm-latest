import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, ActivityIndicator, ScrollView, Platform, Keyboard, KeyboardAvoidingView} from 'react-native';
import { getRecordStructureHelper, copyPriceDetails } from '../../helper';

class Viewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            inputForm: [],
            inputInstance: [],
            id: this.props.moduleId,
            recordId: (this.props.recordId) ? this.props.recordId : '',
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        this.onFetchCall();
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
        this.setState({
            loading: true,
        }, () => {
            getRecordStructureHelper(this);
        });
    }

    onCopyPriceDetails(priceFields, stockFields) {
        copyPriceDetails(this, priceFields, stockFields);
    }

    doRender() {
        let view;
        if (this.state.loading) {
            view = (
                <View style={{ width: '100%', height: 50, alignItems: 'center', marginTop: 30 }}>
                    <ActivityIndicator color={'#000000'} />
                </View>
            );
        } else {
            view = (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={(Platform.OS === "ios") ? "padding" : "height"}
                    keyboardVerticalOffset={122}
                >
                    <ScrollView
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
            <View style={{ flex: 1, backgroundColor: '#f2f3f8' }}>
                {this.doRender()}
            </View>
        );
    }
}

const mapStateToProps = ({ drawer }) => {
    const { moduleId } = drawer;
    return { moduleId };
};

export default connect(mapStateToProps)(Viewer);
