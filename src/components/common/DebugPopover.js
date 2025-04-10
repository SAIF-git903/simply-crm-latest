import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import Popover from 'react-native-popover-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KEEPUSERINFO, LOGINDETAILSKEY} from '../../variables/strings';

class DebugPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      user_name: '',
      session_id: '',
      networktype: '',
      requestLog: [],
    };
  }

  fetchDebugData = async () => {
    const loginDetails = JSON.parse(await AsyncStorage.getItem(KEEPUSERINFO));
    let request_Log =
      JSON.parse(await AsyncStorage.getItem('requestLog')) || [];
    const {type} = await NetInfo.fetch();
    this.setState({
      user_name: loginDetails?.username,
      session_id: loginDetails?.session,
      networktype: type,
      requestLog: request_Log,
      visible: true,
    });
  };

  render() {
    return (
      <Popover
        isVisible={this.state.visible}
        verticalOffset={
          Platform.OS === 'android' ? -StatusBar.currentHeight : 0
        }
        onRequestClose={() => this.setState({visible: false})}
        from={
          <TouchableOpacity
            onPress={this.fetchDebugData}
            style={{
              position: this.props.position,
              zIndex: 1,
              alignSelf: this.props.alignSelf,
              bottom: this.props.bottom,
              padding: 10,
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: this.props.sendDebugColor,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Send Debug
            </Text>
          </TouchableOpacity>
        }>
        <View style={{padding: 15, gap: 5}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={styles.heading}>{this.state.user_name}</Text>
              <Text style={styles.heading}>{this.state.session_id}</Text>
              <Text style={styles.heading}>{this.state.networktype}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.setState({visible: false})}>
              <Ionicons name="close-circle-sharp" size={30} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              width: this.props.screenWidth * 0.9,
              height: this.props.screenHeight * 0.8,
            }}>
            {this.state.requestLog?.map((val, index) => {
              const formattedDate = moment(val?.time).format(
                'DD/MM/YY hh:mm A',
              );
              return (
                <View key={index} style={{gap: 10}}>
                  <View
                    style={{
                      height: 1,
                      width: 'auto',
                      borderWidth: 0.5,
                      marginTop: 10,
                    }}
                  />
                  <Text style={styles.lbl}>{formattedDate}</Text>
                  <Text style={styles.lbl}>{val?.requesturl}</Text>
                  <Text style={styles.lbl}>{val?.operation}</Text>
                  <Text style={styles.lbl}>{val?.bodyData}</Text>
                  <Text style={styles.lbl}>{val?.method}</Text>
                  <Text style={styles.lbl}>{val?.status}</Text>
                  <Text
                    style={styles.lbl}
                    numberOfLines={8}
                    ellipsizeMode="tail">
                    {val?.responseJson}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Popover>
    );
  }
}

export default DebugPopover;

const styles = StyleSheet.create({
  heading: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  lbl: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
});
