import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import HomeMain from '../components/homeMain';
import HomeDrawer from '../components/homeDrawer';
import RecordViewer from '../components/recordViewer';
import { DRAWER_BACKGROUND } from '../variables/themeColors';
import Search from '../components/search';
import { RECORD_ADDER, RECORD_VIEWER, HOME_MAIN, SEARCH_COMPONENT } from '../variables/constants';

class HomeTablet extends Component {
    static navigationOptions = {
        header: null
    }

    renderTabletLandscape() {
        return (
            <View style={styles.landscapeStyle} >
                <View style={styles.homeMainStyle}>
                    {
                        this.renderRecordLister()
                    }
                </View>
                {
                    this.renderRecordMgr()
                }
            </View>
        );
    }

    renderRecordLister() {
        //console.log(this.props.ltrComponentToShow);        
        debugger;
        switch (this.props.ltrComponentToShow) {
            case HOME_MAIN:
                return (
                    <HomeMain navigation={this.props.navigation} />
                );
            case SEARCH_COMPONENT:
                return (
                    <Search />
                );
            default:
                return undefined;
        }
    }

    renderRecordMgr() {
        switch (this.props.mgrComponentToShow) {
            case RECORD_VIEWER:
                return (
                    <View style={styles.recordMgrStyle}>
                        <RecordViewer />
                    </View>
                );
            case RECORD_ADDER:
                return (
                    <View style={styles.recordMgrStyle}>
                        <RecordViewer />
                    </View>
                );
            default:
                return undefined;
        }
    }

    renderTabletPortrait() {
        return (
            <View style={styles.homeMainStyle}>
                <HomeMain navigation={this.props.navigation} />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.homeTabletStyle}>
                <View style={styles.homeDrawerStyle}>
                    <HomeDrawer navigation={this.props.navigation} />
                </View>
                {
                    (this.props.isPortrait) ?
                        this.renderTabletPortrait() :
                        this.renderTabletLandscape()
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    homeTabletStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        flex: 1,
        width: '100%'
    },
    homeDrawerStyle: {
        width: 250,
        borderColor: '#d3d3d3',
        backgroundColor: DRAWER_BACKGROUND,
        height: '100%',
    },
    homeMainStyle: {
        flex: 1,
    },
    recordMgrStyle: {
        flex: 1,
        marginLeft: 10
    },
    landscapeStyle: {
        backgroundColor: '#5A5A5A',
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        paddingTop: 35,
        paddingBottom: 35,
        paddingLeft: 25,
        paddingRight: 25
    }
});

const mapStateToProp = ({ event, mgr }) => {
    const { isPortrait, width, height } = event;
    const { mgrComponentToShow, ltrComponentToShow } = mgr;
    return { isPortrait, width, height, mgrComponentToShow, ltrComponentToShow };
};

export default connect(mapStateToProp)(HomeTablet);
