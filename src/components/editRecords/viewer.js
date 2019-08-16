import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { describeEditRecordHelper, getDataHelper } from '../../helper';


class Viewer extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false,
                       inputForm: [],
                       id: 0 };
    }
    
    componentDidMount() {
        this.props.onRef(this);
        this.onFetchCall();     
    }
   
    onFetchCall() {
        const { state } = this.props.navigation;
        this.setState({ loading: true, id: state.params.id },
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
            <KeyboardAwareScrollView>
                {this.state.inputForm}
                
            </KeyboardAwareScrollView>

        );
    }

    render() {
        //console.log(this.state.inputForm.length);
        return (
            <View style={{ marginTop: 75, flex: 1 }}>
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
