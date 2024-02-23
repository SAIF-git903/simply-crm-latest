import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SwipeOut from 'react-native-swipeout';
import {deleteRecord, filterField} from '../../actions';
import {RECORD_COLOR, RECORD_SELECTED_COLOR} from '../../variables/themeColors';
import {commonStyles, fontStyles} from '../../styles/common';
import store from '../../store';

class RecordItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      labelColorsObject: {},
      textWidth: 0,
    };
  }

  componentDidMount() {
    const {colorRuducer} = store.getState();

    let picklistColorsObject = {};

    if (colorRuducer?.passedValue !== null) {
      colorRuducer?.passedValue?.forEach((colorReducer) => {
        if (colorReducer?.type?.picklistColors) {
          Object.keys(colorReducer?.type?.picklistColors).forEach(
            (colorKey) => {
              if (!picklistColorsObject[colorKey]) {
                picklistColorsObject[colorKey] =
                  colorReducer?.type?.picklistColors[colorKey];
              }
            },
          );
        }
      });
    }

    this.setState({labelColorsObject: picklistColorsObject});
  }

  getActions() {
    return [
      {
        component: (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f2f3f8',
              borderColor: 'white',
              borderRightWidth: 1,
            }}>
            <Icon name="pencil-alt" solid size={30} color="black" />
          </View>
        ),
        onPress: this.onEdit.bind(this),
      },
      {
        component: (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f2f3f8',
            }}>
            <Icon name="trash-alt" solid size={30} color="black" />
          </View>
        ),
        onPress: this.onDelete.bind(this),
      },
    ];
  }

  onEdit() {
    //TODO Non-serializable values were found in the navigation state. Use navigation.setOption() instead
    this.props.navigation.navigate('Edit Record', {
      id: this.props.id,
      lister: this.props.listerInstance,
      isDashboard: this.props.isDashboard,
    });
  }

  onDelete() {
    Alert.alert(
      'Are you sure want to delete this record ?',
      this.props.recordName,
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            this.props.listerInstance.setState(
              {
                isFlatListRefreshing: true,
              },
              () => {
                this.props.dispatch(
                  deleteRecord(
                    this.props.listerInstance,
                    this.props.id,
                    this.props.index,
                    () => {
                      this.props.listerInstance.setState({
                        isFlatListRefreshing: false,
                      });
                    },
                  ),
                );
              },
            );
          },
        },
      ],
      {cancelable: true},
    );
  }
  handleTextLayout = (event) => {
    const {width} = event.nativeEvent.layout;

    this.setState({textWidth: width});
  };

  renderLabel(label, index, labelColorsObject) {
    const labelColor = labelColorsObject[label] || null;

    if (!label || label.length === 0) return null;
    return (
      <View
        style={{
          backgroundColor: labelColor,
          borderRadius: 3,
          width: labelColor ? '50%' : '100%',
        }}>
        <Text
          key={index + 2}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            fontStyles.dashboardRecordLabel,
            {
              color: labelColor ? '#fff' : '#707070',
              paddingLeft: labelColor ? 5 : 0,
            },
          ]}>
          {typeof label === 'object' ? label?.value : label}
        </Text>
      </View>
    );
  }

  renderLabels(labels, labelColorsObject) {
    return labels.map((label, index) =>
      this.renderLabel(label, index, labelColorsObject),
    );
  }

  renderLoading() {
    return (
      <View
        style={[
          styles.backgroundStyle,
          {
            borderTopWidth: this.props.index === 0 ? 1 : 0,
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor:
              this.props.selectedIndex === this.props.index
                ? RECORD_SELECTED_COLOR
                : RECORD_COLOR,
          },
        ]}>
        <Text style={fontStyles.fieldValue}>Loading.....</Text>
        <ActivityIndicator />
      </View>
    );
  }

  renderLine(labelColorsObject) {
    let recordName = this.props.recordName;
    let no_tittle_style = {};
    if (recordName === '') {
      recordName = '*empty title*';
      no_tittle_style = commonStyles.no_tittle;
    }
    return (
      <View>
        <SwipeOut buttonWidth={70} right={this.getActions()} autoClose>
          <TouchableOpacity
            onPress={() => {
              this.props.onRecordSelect(this.props.id, this.props.index);
            }}>
            <View
              style={[
                styles.backgroundStyle,
                {
                  borderTopWidth: this.props.index === 0 ? 1 : 0,
                  backgroundColor:
                    this.props.selectedIndex === this.props.index
                      ? RECORD_SELECTED_COLOR
                      : RECORD_COLOR,
                },
              ]}>
              <Text
                key={1}
                numberOfLines={1}
                style={[fontStyles.dashboardRecordLabelBig, no_tittle_style]}>
                {recordName}
              </Text>
              {this.props.labels
                ? this.renderLabels(this.props.labels, labelColorsObject)
                : null}
            </View>
          </TouchableOpacity>
        </SwipeOut>
      </View>
    );
  }

  render() {
    const {labelColorsObject} = this.state;
    return this.state.loading
      ? this.renderLoading()
      : this.renderLine(labelColorsObject);
  }
}

export default connect(null)(RecordItem);

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    borderColor: '#f2f3f8',
    borderBottomWidth: 1,
    padding: 15,
  },
});
