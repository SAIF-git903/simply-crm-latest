import React, {Component} from 'react';
import {View, Text} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {connect} from 'react-redux';
import {moduleSelected} from '../../actions';
import Icon from 'react-native-vector-icons/FontAwesome5';

class Header extends Component {
  handleDisplayModule(value) {
    if (value === 'Organizations') value = 'Accounts';
    this.props.moduleSelected(value);
  }

  isModuleActive(moduleName) {
    for (const module of this.props.modules) {
      if (moduleName === module.name) return true;
    }
  }

  render() {
    const {moduleName} = this.props;
    let dropdownText = moduleName;

    if (moduleName === 'Accounts') {
      dropdownText = 'Organizations';
    }

    const options = ['Organizations', 'Contacts', 'Calendar'];

    if (this.isModuleActive('Leads')) options.push('Leads');

    return (
      <View style={styles.subContainer}>
        <View style={styles.rowContainer}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              color: '#707070',
              fontSize: 16,
            }}>
            Show Recent
          </Text>
          <ModalDropdown
            options={options}
            onSelect={(index, value) =>
              this.handleDisplayModule.bind(this)(value)
            }
            defaultValue={moduleName}
            dropdownStyle={{
              width: '64.5%',
              marginLeft: 10,
              height: 178,
            }}
            dropdownTextStyle={{
              fontFamily: 'Poppins-Medium',
              color: '#707070',
              fontSize: 16,
            }}
            style={{flex: 1}}>
            <View
              style={{
                marginLeft: 10,
                backgroundColor: '#fff',
                borderColor: '#fff',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.05,
                shadowRadius: 5,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 10,
                height: 44,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  color: '#707070',
                  fontSize: 16,
                }}>
                {dropdownText}
              </Text>
              <Icon name={'angle-right'} size={23} color={'#707070'} />
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
    justifyContent: 'space-between',
  },
  labelStyle: {
    fontSize: 14,
    paddingLeft: 5,
    flex: 1,
    color: '#ffffff',
  },
};
const mapStateToProps = ({dashboardUpdate}) => {
  const {moduleName} = dashboardUpdate;
  return {moduleName};
};

export default connect(mapStateToProps, {moduleSelected})(Header);
