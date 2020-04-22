import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

import Header from './Header';
import Viewer from './Viewer';
import { drawerButtonPress } from '../../actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBuilding, faUser, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

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
        <FontAwesomeIcon
            size={36}
            icon={icon}
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
                        justifyContent: 'space-between'
                    }}
                >
                    {/* buttons */}
                    <IconButton
                        icon={faBuilding}
                        title={'Organizations'}
                        onPress={() => this.props.dispatch(drawerButtonPress(
                            'Accounts',
                            'Organizations',
                            11
                        ))}
                    />

                    <IconButton
                        icon={faUser}
                        title={'Contacts'}
                        onPress={() => this.props.dispatch(drawerButtonPress(
                            'Contacts',
                            'Contacts',
                            12
                        ))}
                    />

                    <IconButton
                        icon={faCalendarAlt}
                        title={'Calendar'}
                    />

                    <IconButton
                        icon={faTasks}
                        title={'Tasks'}
                    />
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
};

export default connect(null)(UpdateWidget);

