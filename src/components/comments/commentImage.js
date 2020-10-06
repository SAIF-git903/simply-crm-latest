import React, { Component } from 'react';
import { connect } from 'react-redux';
import RNFetchBlob from "react-native-fetch-blob";
import { Button } from './comment.js';
import { View, Modal } from 'react-native';
import Gallery from 'react-native-image-gallery';
import store from '../../store';

class CommentImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalEnabled: false,
            downloadData: this.props.downloadData,
            base64Data: null,
        };
    }

    componentDidMount() {
        if (this.state.downloadData.location !== 'external') {
            const fs = RNFetchBlob.fs;
            let imagePath = null;
            const {auth: {loginDetails: {session, url}}} = store.getState();
            RNFetchBlob.config({
                fileCache: true
            }).fetch(
                "POST",
                `${url}/modules/Mobile/api.php`,
                {
                    'cache-control': 'no-cache',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                JSON.stringify({
                    _session: session,
                    _operation: this.state.downloadData._operation,
                    module: this.state.downloadData.module,
                    record: this.state.downloadData.record,
                    fileid: this.state.downloadData.fileid,
                    display: 1,
                })
            ).then(resp => {
                // on success
                // the image path you can use it directly with Image component
                imagePath = resp.path();
                return resp.readFile("base64");
            }, resp => {
                // on error
                console.log('Error getting base64 with RNFetchBlob');
                console.log(resp);
            }).then(base64Data => {
                // here's base64 encoded image
                this.setState({
                    base64Data: 'data:' + this.state.downloadData.type + ';base64,' + base64Data,
                });
                // remove the file from storage
                return fs.unlink(imagePath)
                    .catch((errorMessage, statusCode) => {
                        console.log('RNFetchBlob.fs have error with "statusCode"="' + statusCode + '" and "message"="' + errorMessage + '"');
                    });
            });
        }
    }

    enableModal(state) {
        if (state.modalEnabled === true) {
            this.setState({ modalEnabled: false });
        } else {
            this.setState({ modalEnabled: true });
        }
    }

    render() {
        let source;
        if (this.state.downloadData.location === 'external') {
            source = {
                uri: this.state.downloadData.url
            };
            //TODO test me
        } else {
            source = (this.state.base64Data) ? { uri: this.state.base64Data } : require('../../../assets/images/loading.gif');
        }

        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        onPress={() => this.enableModal(this.state)}
                        text={'Show image'}
                    />
                </View>
                <Modal
                    visible={this.state.modalEnabled}
                    transparent={true}
                    onRequestClose={() => this.setState({ modalEnabled: false })}
                >
                    <Gallery
                        style={{ flex: 1, backgroundColor: 'white' }}
                        images={[
                            { source: source },
                        ]}
                    />
                </Modal>
            </View>
        );
    }
}

export default connect(null)(CommentImage);
