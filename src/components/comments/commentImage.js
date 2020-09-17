import React, { Component } from 'react';
import { connect } from 'react-redux';
import RNFetchBlob from "react-native-fetch-blob";
import { Button } from './comment.js';
import { View, Modal } from 'react-native';
import Gallery from 'react-native-image-gallery';

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
        //TODO process for external files with different 'this.state.downloadData.url'
        const fs = RNFetchBlob.fs;
        let imagePath = null;
        RNFetchBlob.config({
            fileCache: true
        }).fetch(
            "POST",
            this.state.downloadData.url,
            {
                'cache-control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            JSON.stringify({
                _operation: this.state.downloadData._operation,
                module: this.state.downloadData.module,
                record: this.state.downloadData.record,
                fileid: this.state.downloadData.fileid,
                display: 1,
            })
        )
        // when response status code is 200
        .then(resp => {
            // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile("base64");
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

    enableModal(state) {
        if (state.modalEnabled === true) {
            this.setState({ modalEnabled: false });
        } else {
            this.setState({ modalEnabled: true });
        }
    }

    render() {
        const source = (this.state.base64Data) ? { uri: this.state.base64Data } : require('../../../assets/images/loading.gif');

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
