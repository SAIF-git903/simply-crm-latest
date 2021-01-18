import React, { Component } from 'react';
import { connect } from 'react-redux';
import RNFetchBlob from "react-native-fetch-blob";
import {View, Modal, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import store from '../store';

const Button = ({ text, onPress, style }) => <TouchableOpacity
    style={[{
        paddingTop: 5,
        paddingLeft: 15
    }, style]}
    onPress={onPress}
>
    <Text style={styles.actionText}>{text}</Text>
</TouchableOpacity>;

export function processFile(item) {
    const imageTypeArray = ['image/bmp', 'image/gif', 'image/jpeg', 'image/png'];
    const urlSuffix = ['bmp', 'gif', 'jpg', 'jpeg', 'png'];
    let fileButton = null;
    if (item.downloadData) {
        let suffix_exist = false;
        urlSuffix.forEach(function(suffix) {
            if (item.downloadData.url && item.downloadData.url.endsWith(suffix)) {
                suffix_exist = true;
            }
        });
        if (
            item.downloadData.type && imageTypeArray.includes(item.downloadData.type)
            || suffix_exist
        ) {
            fileButton = (
                <ShowImage
                    downloadData={item.downloadData}
                >
                </ShowImage>
            );
        } else {
            //download file or something else
        }
    }
    return fileButton;
}

class ShowImage extends Component {
    constructor(props) {
        super(props);
        const {load_width, load_height} = Image.resolveAssetSource(require('../../assets/images/loading.gif'));
        this.state = {
            modalEnabled: false,
            loadWidth: load_width,
            loadHeight: load_height,
            downloadData: this.props.downloadData,
            imagePath: null,
            imageWidth: 200,
            imageHeight: 200,
        };
    }

    componentDidMount() {
        if (this.state.downloadData.location !== 'external') {
            const {auth: {loginDetails: {session, url}}} = store.getState();
            const ext = this.state.downloadData.type.split('/');
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
                    _operation: this.state.downloadData._operation,
                    module: this.state.downloadData.module,
                    record: this.state.downloadData.record,
                    fileid: this.state.downloadData.fileid,
                    display: 1,
                })
            ).then(resp => {
                // on success
                let imagePath = resp.path();
                Image.getSize(`file://${imagePath}`, (width, height) => {
                    //on success
                    this.setState({
                        imagePath: imagePath,
                        imageWidth: width,
                        imageHeight: height,
                    });
                }, err => {
                    //on error
                    console.log('Error getting image width and height: ' + err);
                });
            }, resp => {
                // on error
                console.log('Error getting image path with RNFetchBlob');
                console.log(resp);
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
            if (this.state.imagePath) {
                source = {
                    url: '',
                    width: this.state.imageWidth,
                    height: this.state.imageHeight,
                    props: {
                        source: {
                            uri: `file://${this.state.imagePath}`
                        }
                    }
                };
            } else {
                source = {
                    url: '',
                    width: this.state.loadWidth,
                    height: this.state.loadHeight,
                    props: {
                        source: require('../../assets/images/loading.gif')
                    }
                };
            }
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
                    <ImageViewer
                        imageUrls={[
                            source,
                        ]}
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

