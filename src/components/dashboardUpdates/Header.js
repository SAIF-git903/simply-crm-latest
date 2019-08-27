import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { connect } from 'react-redux';
import { moduleSelected } from '../../actions';
import { HEADER_COLOR } from '../../variables/themeColors';

class Header extends Component {
    handleDisplayModule(value) {
        this.props.moduleSelected(value);
    }
    
    render() {
        return (
            <View style={styles.subContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.labelStyle}>Recently Added</Text>  
                    <ModalDropdown 
                        options={['Contacts', 'Calendar', 'Leads']}
                        onSelect={(index, value) => this.handleDisplayModule.bind(this)(value)}
                        defaultValue={this.props.moduleName}
                        //defaultIndex={0}
                        style={{ width: '46.5%', 
                             height: 30,
                             flex: 1,
                             backgroundColor: '#fff', 
                             paddingTop: 5,
                             borderWidth: 1,
                             borderColor: '#fff',
                        }}
                        textStyle={{ fontSize: 16, lineHeight: 20, textAlign: 'center' }}
                        dropdownStyle={{ width: '46.5%', height: '25%' }}
                        dropdownTextStyle={{ fontSize: 16, 
                                         lineHeight: 20, 
                                         borderBottomColor: '#d3d3d3', 
                                         borderBottomWidth: 1,
                        }}
                    />           
                </View>
            </View>
        );
    }
}
const styles = {
    subContainer: {        
        padding: 5,
        backgroundColor: HEADER_COLOR,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        
    },
    rowContainer: {
        height: 30,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
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
