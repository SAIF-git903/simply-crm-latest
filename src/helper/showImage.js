import React, { Component } from 'react';
import { connect } from 'react-redux';
import RNFetchBlob from "react-native-fetch-blob";
import {View, Modal, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Gallery from 'react-native-image-gallery';
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
        this.state = {
            modalEnabled: false,
            downloadData: this.props.downloadData,
            imagePath: null,
        };
    }

    componentDidMount() {
        if (this.state.downloadData.location !== 'external') {
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
                let imagePath = resp.path();
                this.setState({
                    imagePath: imagePath,
                });
                return imagePath;
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
            source = (this.state.imagePath) ? { uri: `file://${this.state.imagePath}` } : require('../../assets/images/loading.gif');
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
                        resizeMode='contain'
                        style={{ flex: 1, backgroundColor: 'white' }}
                        images={[
                            { source: source },
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
