import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

import Header from './Header';
import Viewer from './Viewer';
import { drawerButtonPress } from '../../actions/index';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';

import { fontStyles } from '../../styles/common';

const IconButton = ({ icon, title, style, onPress }) => {
    return <TouchableOpacity
        onPress={onPress}
        style={[
            style,
            {
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 60
            }
        ]}>
        <Icon
            name={icon}
            size={36}
            color={'#797f8b'}
        />
        <Text style={[fontStyles.iconButtonLabel, { paddingTop: 10 }]}>
            {title}
        </Text>
    </TouchableOpacity >
}

class UpdateWidget extends Component {

    render() {
        console.log(this.props)
        return (
            <View style={styles.container} >
                <View
                    style={{
                        flexDirection: 'row',
                        paddingTop: 30,
                        paddingBottom: 20,
                        paddingHorizontal: 20,
                        justifyContent: 'center'
                    }}
                >
                    <View
                        style={styles.iconButtonContainer}
                    >
                        {/* buttons */}
                        <IconButton
                            icon={'building'}
                            title={'Organizations'}
                            onPress={() => this.props.dispatch(drawerButtonPress(
                                'Accounts',
                                'Organizations',
                                11
                            ))}
                        />
                    </View>

                    <View
                        style={styles.iconButtonContainer}
                    >
                        <IconButton
                            icon={'user'}
                            title={'Contacts'}
                            onPress={() => this.props.dispatch(drawerButtonPress(
                                'Contacts',
                                'Contacts',
                                12
                            ))}
                        />
                    </View>

                    <View
                        style={styles.iconButtonContainer}
                    >
                        <IconButton
                            icon={'calendar-alt'}
                            title={'Calendar'}
                            onPress={() => this.props.dispatch(drawerButtonPress(
                                'Calendar',
                                'Calendar',
                                9
                            ))}
                        />
                    </View>
                    {/* 
                    <IconButton
                        icon={'tasks'}
                        title={'Tasks'}
                    /> */}
                </View>
                <View style={{ padding: 10, paddingBottom: 0 }}>
                    <Header />
                </View>

                <View style={{ flex: 1, padding: 10 }}>
                    <Viewer navigation={this.props.navigation} />
                </View>

            </View>

        );
    }

}
const styles = {
    container: {
        flex: 1
    },
    iconButtonContainer: {
        paddingHorizontal: 15
    }
};

export default connect(null)(UpdateWidget);

