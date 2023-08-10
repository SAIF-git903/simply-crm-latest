import React, {Component} from 'react';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import ImageViewer from '../react-native-image-viewer/index';
import Icon from 'react-native-vector-icons/FontAwesome5';
import store from '../store';
import loadImageImport from '../../assets/images/loading.gif';

const Button = ({text, onPress, style}) => (
  <TouchableOpacity
    style={[
      {
        paddingTop: 5,
        paddingLeft: 15,
      },
      style,
    ]}
    onPress={onPress}>
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
      urlSuffix.forEach(function (suffix) {
        if (url && url.endsWith(suffix)) {
          suffix_exist = true;
        }
      });
      if ((type && imageTypeArray.includes(type)) || suffix_exist) {
        //this attachment picture and can be showed
        downloadDataChanged.push(attachment);
      }
    }
    if (downloadDataChanged.length > 0) {
      fileButton = <ShowImage downloadData={downloadDataChanged} />;
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
    const loadImage = Image.resolveAssetSource(loadImageImport);
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
        source: require('../../assets/images/loading.gif'),
        width: loadImage.width,
        height: loadImage.height,
        uri: loadImage.uri,
      },
      downloadData: downloadData,
      imageData: initImageData,
    };
    //structure of 'imageData' will be like this { url, isExternal }
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    for (const [key, attachment] of Object.entries(this.state.downloadData)) {
      let appendExt, fetchMethod, fetchUrl, fetchHeaders, fetchBody, isExternal;
      if (attachment.location !== 'external') {
        const {
          auth: {
            loginDetails: {session, url},
          },
        } = store.getState();
        const ext = attachment.type.split('/');
        if (ext.length <= 1) {
          console.log('Cant get external type of image for type:');
          console.log(attachment.type);
          continue;
        }

        appendExt = ext[1];
        fetchMethod = 'POST';
        fetchUrl = `${url}/modules/Mobile/api.php`;
        fetchHeaders = {
          'cache-control': 'no-cache',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        fetchBody = JSON.stringify({
          _session: session,
          _operation: attachment._operation,
          module: attachment.module,
          record: attachment.record,
          fileid: attachment.fileid,
          display: 1,
        });
      } else {
        const explode = attachment.url.split('.');
        if (explode.length <= 1) {
          console.log('Cant get external type of image for url:');
          console.log(attachment.url);
          continue;
        }

        appendExt = explode[explode.length - 1];
        fetchMethod = 'GET';
        fetchUrl = attachment.url;
        fetchHeaders = undefined;
        fetchBody = undefined;
        isExternal = true;
      }
      RNFetchBlob.config({
        fileCache: true,
        appendExt: appendExt,
      })
        .fetch(fetchMethod, fetchUrl, fetchHeaders, fetchBody)
        .then(
          resp => {
            // on success
            if (this.mounted) {
              let imageData = this.state.imageData;
              imageData[key] = {
                url: `file://${resp.path()}`,
                isExternal: isExternal,
              };
              this.setState({
                imageData: imageData,
              });
            }
          },
          resp => {
            // on error
            console.log('Error getting image path with RNFetchBlob');
            console.log(resp);
          },
        );
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  enableModal(state) {
    if (state.modalEnabled === true) {
      this.setState({modalEnabled: false});
    } else {
      this.setState({modalEnabled: true});
    }
  }

  render() {
    let imageUrls = [];
    for (const [key, image] of Object.entries(this.state.imageData)) {
      let source = {};
      //at first all 'image.url' is empty and the 'loadImage' will be shown
      //in the second, the user image will be fetched from the backend, and 'image.url' will be filled with the local path to the user image
      //if the size of the user image is unknown, then the loaded image will be shown again
      if (image.url) {
        if (image.isExternal) {
          source = {
            url: image.url,
          };
        } else {
          source = {
            url: image.url,
            props: {
              source: {
                uri: image.url,
              },
            },
          };
        }
      } else {
        source = {
          width: this.state.loadImageData.width,
          height: this.state.loadImageData.height,
          props: {
            source: this.state.loadImageData.source,
          },
        };
      }
      imageUrls.push(source);
    }
    let buttonName =
      Object.keys(this.state.imageData).length > 1
        ? 'Show images'
        : 'Show image';

    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button
            onPress={() => this.enableModal(this.state)}
            text={buttonName}
          />
        </View>
        <Modal
          visible={this.state.modalEnabled}
          transparent={true}
          onRequestClose={() => this.setState({modalEnabled: false})}>
          <ImageViewer
            imageUrls={imageUrls}
            enableImageZoom={true}
            saveToLocalByLongPress={false}
            enableSwipeDown={false}
            enablePreload={false}
            useNativeDriver={true}
            //when in downloading external image
            loadingRender={() => (
              <Image source={this.state.loadImageData.source} />
            )}
            //when image size not found
            failImageSource={{
              url: this.state.loadImageData.uri,
              width: this.state.loadImageData.width,
              height: this.state.loadImageData.height,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 30,
              right: 30,
            }}>
            <TouchableOpacity
              onPress={() => this.setState({modalEnabled: false})}>
              <Icon name="times" size={30} color="#C5C5C5" />
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
    color: '#00BBF2',
  },
});

export default connect(null, {processFile})(ShowImage);
