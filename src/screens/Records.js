import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';

import Header from '../components/common/Header';
import Lister from '../components/recordLister/lister';

export default class Records extends Component {
    constructor(props) {
        super(props);
        this.lister = React.createRef();
    }

    renderAddRecordButton() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Add Record', { lister: this.lister })}>
                <View
                    style={{
                        backgroundColor: 'rgba(255,255,255,.2)',
                        width: 27,
                        height: 27,
                        borderRadius: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Icon
                        name='plus'
                        size={18}
                        color='white'
                    />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const {
            moduleName,
            moduleLable,
            moduleId
        } = this.props.route.params;

        return (
            <View style={styles.backgroundStyle}>
                <Header
                    title={moduleLable}
                    navigation={this.props.navigation}
                    customRightButton={this.renderAddRecordButton()}
                />
                <Lister
                    navigation={this.props.navigation}
                    moduleName={moduleName}
                    moduleLable={moduleLable}
                    moduleId={moduleId}
                    ref={ref => this.lister = ref}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        flex: 1
    }
});
