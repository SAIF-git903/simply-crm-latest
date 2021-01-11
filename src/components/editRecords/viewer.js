import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Keyboard, Platform} from 'react-native';
import { describeEditRecordHelper } from '../../helper';

class Viewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            inputForm: [],
            id: 0
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        this.onFetchCall();
    }

    onFetchCall() {
        const { moduleId } = this.props;
        this.setState({ loading: true, id: moduleId, recordId: `${this.props.moduleId}x${this.props.recordId}` },
            () => { describeEditRecordHelper(this); });

        //getDataHelper(this, state.params.id);
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
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
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

    render() {
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
const mapStateToProps = ({ drawer }) => {
    const { moduleId } = drawer;
    return { moduleId };
};
export default connect(mapStateToProps)(Viewer);
