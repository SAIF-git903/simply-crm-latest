import React, { Component } from 'react';
import { connect } from 'react-redux';
import RNFetchBlob from "react-native-fetch-blob";
import {View, Modal, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import ImageViewer from '../react-native-image-viewer/index';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import store from '../store';

const Button = ({ text, onPress, style }) => (
    <TouchableOpacity
        style={[{
            paddingTop: 5,
            paddingLeft: 15
        }, style]}
        onPress={onPress}
    >
        <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
);

export function processFile(item) {
    const imageTypeArray = ['image/bmp', 'image/gif', 'image/jpeg', 'image/png'];
    const urlSuffix = ['bmp', 'gif', 'jpg', 'jpeg', 'png'];
    let fileButton = null;
    const downloadData = item.downloadData;
    if (downloadData) {
        let downloadDataChanged = [];
        for (const [key, attachment] of Object.entries(downloadData)) {
            let url = attachment.url;
            let type = attachment.type;
            let suffix_exist = false;
            urlSuffix.forEach(function(suffix) {
                if (url && url.endsWith(suffix)) {
                    suffix_exist = true;
                }
            });
            if (
                type && imageTypeArray.includes(type)
                || suffix_exist
            ) {
                //this attachment picture and can be showed
                downloadDataChanged.push(attachment);
            }
        }
        if (downloadDataChanged.length > 0) {
            fileButton = (
                <ShowImage
                    downloadData={downloadDataChanged}
                >
                </ShowImage>
            );
        } else {
            //process not image attachments
            //download file or something else
        }
    }
    return fileButton;
}

class ShowImage extends Component {
    constructor(props) {
        super(props);
        const loadGif = require('../../assets/images/loading.gif');
        const { width, height } = Image.resolveAssetSource(loadGif);
        //array to object
        let downloadData = {};
        Object.assign(downloadData, this.props.downloadData);
        let initImageData = {};
        //add empty objects to render loading gif in it
        for (let i = 0; i < Object.keys(downloadData).length; i++) {
            initImageData[i] = {};
        }

        this.state = {
            modalEnabled: false,
            loadImageData: {
                source: loadGif,
                width: width,
                height: height,
            },
            downloadData: downloadData,
            imageData: initImageData,
        };
        //structure of 'imageData' will be like this { url, width, height, isExternal }
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
        for (const [key, attachment] of Object.entries(this.state.downloadData)) {
            if (attachment.location !== 'external') {
                const {auth: {loginDetails: {session, url}}} = store.getState();
                const ext = attachment.type.split('/');
                RNFetchBlob.config({
                    fileCache: true,
                    appendExt: ext[1],
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
                        _operation: attachment._operation,
                        module: attachment.module,
                        record: attachment.record,
                        fileid: attachment.fileid,
                        display: 1,
                    })
                ).then(resp => {
                    // on success
                    let imagePath = resp.path();
                    Image.getSize(`file://${imagePath}`, (width, height) => {
                        //on success
                        if (this.mounted) {
                            let imageData = this.state.imageData;
                            imageData[key] = {
                                url: imagePath,
                                width: width,
                                height: height,
                                isExternal: false,
                            };
                            this.setState({
                                imageData: imageData,
                            });
                        }
                    }, err => {
                        //on error
                        console.log('Error getting image width and height: ' + err);
                    });
                }, resp => {
                    // on error
                    console.log('Error getting image path with RNFetchBlob');
                    console.log(resp);
                });
            } else {
                let imageData = this.state.imageData;
                imageData[key] = {
                    url: attachment.url,
                    width: this.state.loadImageData.width,
                    height: this.state.loadImageData.height,
                    isExternal: true,
                };
                this.setState({
                    imageData: imageData,
                });
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    enableModal(state) {
        if (state.modalEnabled === true) {
            this.setState({ modalEnabled: false });
        } else {
            this.setState({ modalEnabled: true });
        }
    }

    render() {
        let imageUrls = [];
        for (const [key, image] of Object.entries(this.state.imageData)) {
            let source = {};
            if (image.url) {
                if (image.isExternal) {
                    source = {
                        url: image.url,
                    };
                } else {
                    source = {
                        url: '',
                        width: image.width,
                        height: image.height,
                        props: {
                            source: {
                                uri: `file://${image.url}`,
                            },
                        },
                    };
                }
            } else {
                source = {
                    url: '',
                    width: this.state.loadImageData.width,
                    height: this.state.loadImageData.height,
                    props: {
                        source: this.state.loadImageData.source,
                    },
                };
            }
            imageUrls.push(source);
        }
        let buttonName = Object.keys(this.state.imageData).length > 1 ? 'Show images' : 'Show image';

        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        onPress={() => this.enableModal(this.state)}
                        text={buttonName}
                    />
                </View>
                <Modal
                    visible={this.state.modalEnabled}
                    transparent={true}
                    onRequestClose={() => this.setState({ modalEnabled: false })}
                >
                    <ImageViewer
                        imageUrls={imageUrls}
                        saveToLocalByLongPress={false}
                        enableSwipeDown={false}
                        enablePreload={false}
                        useNativeDriver={true}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            top: 30, right: 30,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => this.setState({ modalEnabled: false })}
                        >
                            <Icon
                                name='times'
                                size={30}
                                color='#C5C5C5'
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    actionText: {
        fontFamily: 'Poppins-Medium',
        color: '#00BBF2'
    }
});

export default connect(null, { processFile })(ShowImage);
