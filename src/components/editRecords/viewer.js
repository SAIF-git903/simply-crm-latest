import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { describeEditRecordHelper } from '../../helper';
import SectionBox from '../common/section/sectionBox';


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
        const { state } = this.props.navigation;
        this.setState({ loading: true, id: state.params.id, recordId: `${this.props.moduleId}x${state.params.id}` },
            () => { describeEditRecordHelper(this, state.params.id); });

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
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{ paddingTop: 75 }}
            >
                <SectionBox style={{ paddingRight: 10 }}>
                    {this.state.inputForm}
                </SectionBox>
            </KeyboardAwareScrollView>

        );
    }

    render() {
        //console.log(this.state.inputForm.length);
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
const mapStateToProps = ({ drawer }) => {
    const { moduleId } = drawer;
    return { moduleId };
};
export default connect(mapStateToProps)(Viewer);
