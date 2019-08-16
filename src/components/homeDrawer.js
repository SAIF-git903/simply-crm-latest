import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { View, Text, Image, StatusBar, ScrollView, Linking, 
    TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { renderDrawerView } from '../helper';
import { DRAWER_BACKGROUND, HEADER_COLOR } from '../variables/themeColors';

class HomeDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            drawerViews: [],
            drawerLoadComplete: false
        };
    }

    componentWillMount() {
        if (!this.state.drawerLoadComplete) {
            this.setState({ loading: true });
            renderDrawerView(this.props.loginDetails, this);
        }
    }
    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: DRAWER_BACKGROUND }} >
                <StatusBar
                backgroundColor={HEADER_COLOR}
                barStyle="light-content"
                />
                {
                    (this.state.loading) ? 
                    <ActivityIndicator /> :
                    <ScrollView style={{ backgroundColor: DRAWER_BACKGROUND }}>
                        {this.state.drawerViews}
                        <View style={{ width: '100%', minHeight: '100%', backgroundColor: DRAWER_BACKGROUND }} />
                        
                    </ScrollView>
                }
                <View style={{ width: '100%', height: 80 }}>
                    <Swiper height={50} style={styles.wrapper} autoplay horizontal showsButtons={false} showsPagination={false}>
                        <View style={styles.slide}>
                        <TouchableOpacity
                        style={{ flex: 1 }} 
                        onPress={() => {
                            Linking.openURL('https://www.smackcoders.com/xero-vtiger-crm-6-0-integration.html').catch(err => console.error('An error occurred', err));
                            }}
                        >
                            <View 
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}
                            >
                                <Image 
                                source={{ uri: 'ad_xero' }}
                                style={{ width: 30, height: 30 }}
                                resizeMode={'contain'} 
                                />
                                <Text style={{ color: 'white' }} numberOfLines={1}>Xero Vtiger Integration</Text>
                            </View>
                        </TouchableOpacity>
                        </View>
                        <View style={styles.slide}>
                            <TouchableOpacity
                            style={{ flex: 1 }} 
                            onPress={() => {
                                Linking.openURL('https://www.smackcoders.com/vtigercrm-magento-connector.html').catch(err => console.error('An error occurred', err));
                                }}
                            >
                                <View 
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around'
                                }}
                                >
                                    <Image 
                                    source={{ uri: 'ad_magento' }}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode={'contain'} 
                                    />
                                    <Text style={{ color: 'white' }} numberOfLines={1}>Magento Vtiger Connector</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.slide}>
                            <TouchableOpacity
                            style={{ flex: 1 }} 
                            onPress={() => {
                                Linking.openURL('https://www.smackcoders.com/vtigercrm-mailchimp-integration.html').catch(err => console.error('An error occurred', err));
                                }}
                            >
                                <View 
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around'
                                }}
                                >
                                    <Image 
                                    source={{ uri: 'ad_mailchimp' }}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode={'contain'} 
                                    />
                                    <Text style={{ color: 'white' }} numberOfLines={1}>Mailchimp Integration</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.slide}>
                            <TouchableOpacity
                            style={{ flex: 1 }} 
                            onPress={() => {
                                Linking.openURL('https://www.smackcoders.com/vtiger-google-calendar-sync-bi-directional.html').catch(err => console.error('An error occurred', err));
                                }}
                            >
                                <View 
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around'
                                }}
                                >
                                    <Image 
                                    source={{ uri: 'ad_googlesync' }}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode={'contain'} 
                                    />
                                    <Text style={{ color: 'white' }} numberOfLines={1}>Google Calendar Sync</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Swiper>
                    <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                        <Text style={{ color: 'white' }}>  Powered by</Text>
                        <Image 
                        source={{ uri: 'smackcoders' }}
                        style={{ width: 17, height: 17 }}
                        resizeMode={'contain'} 
                        />
                        <Text style={{ color: 'white' }}> Smackcoders, Inc.</Text>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    wrapper: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#d3d3d3',
        marginBottom: 10
    },
    slide: {
        height: 50 
    }
});

const mapStateToProps = ({ auth }) => {
    const { loginDetails } = auth;
    return { loginDetails };
};

export default connect(mapStateToProps)(HomeDrawer);
