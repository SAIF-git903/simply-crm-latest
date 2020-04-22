import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { connect } from 'react-redux';
import { moduleSelected } from '../../actions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons';

class Header extends Component {
    handleDisplayModule(value) {
        if (value === 'Organizations') value = 'Accounts';
        this.props.moduleSelected(value);
    }

    render() {
        const { moduleName } = this.props;
        let dropdownText = moduleName;

        if (moduleName === 'Accounts') {
            dropdownText = 'Organizations'
        }

        return (
            <View style={styles.subContainer}>
                <View style={styles.rowContainer}>
                    <Text style={{
                        fontFamily: 'Poppins-Medium',
                        color: '#707070',
                        fontSize: 16
                    }}>
                        Show Recent
                    </Text>
                    <ModalDropdown
                        options={['Organizations', 'Contacts', 'Calendar', 'Leads']}
                        onSelect={(index, value) => this.handleDisplayModule.bind(this)(value)}
                        defaultValue={moduleName}
                        dropdownStyle={{
                            width: '64.5%',
                            marginLeft: 10,
                            height: 178
                        }}
                        dropdownTextStyle={{
                            fontFamily: 'Poppins-Medium',
                            color: '#707070',
                            fontSize: 16
                        }}
                        style={{ flex: 1 }}
                    >
                        <View
                            style={{
                                marginLeft: 10,
                                backgroundColor: '#fff',
                                borderColor: '#fff',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: 0.05,
                                shadowRadius: 5,
                                elevation: 2,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row',
                                padding: 10,
                                height: 44
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Poppins-Medium',
                                    color: '#707070',
                                    fontSize: 16
                                }}
                            >{dropdownText}
                            </Text>
                            <FontAwesomeIcon
                                icon={faAngleRight}
                                color={'#707070'}
                                size={23}
                            />
                        </View>
                    </ModalDropdown>
                </View>
            </View>
        );
    }
}
const styles = {
    subContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',

    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    labelStyle: {
        fontSize: 14,
        paddingLeft: 5,
        flex: 1,
        color: '#ffffff'
    },

};
const mapStateToProps = ({ dashboardUpdate }) => {
    const { moduleName } = dashboardUpdate;
    return { moduleName };
};

export default connect(mapStateToProps, { moduleSelected })(Header);
