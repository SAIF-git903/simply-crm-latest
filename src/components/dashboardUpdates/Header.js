import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
// import ModalDropdown from 'react-native-modal-dropdown';
import {connect} from 'react-redux';
import {moduleSelected} from '../../actions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Dropdown} from 'react-native-element-dropdown';
class Header extends Component {
  constructor() {
    super();
    this.state = {visible: false, value: null};
  }
  componentDidMount() {
    console.log('this.props', this.props);
  }

  // handleDisplayModule = (value) => {
  //   const findModule = (moduleName, moduleList) => {
  //     return moduleList.find((module) => module?.name === moduleName) || null;
  //   };
  //   const modules = this.props?.modules;
  //   const organizationModule = findModule('Accounts', modules);
  //   const contactModule = findModule('Contacts', modules);
  //   const calendarModule = findModule('Calendar', modules);

  //   let newArry = [organizationModule, contactModule, calendarModule];

  //   let newval = newArry.find((val) => val?.label === value) || null;
  //   if (newval != null) {
  //     this.props.moduleSelected(newval?.name);
  //   }
  // };

  // isModuleActive(moduleName) {
  //   for (const module of this.props.modules) {
  //     if (moduleName === module.name) return true;
  //   }
  // }
  renderItem = (item, index) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#707070',
        }}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };
  render() {
    // const {moduleName} = this.props;
    // const findModule = (moduleName, moduleList) => {
    //   return moduleList.find((module) => module?.name === moduleName) || null;
    // };
    // const modules = this.props?.modules;
    // const organizationModule = findModule('Accounts', modules);
    // const contactModule = findModule('Contacts', modules);
    // const calendarModule = findModule('Calendar', modules);

    // let dropdownText = moduleName;
    // if (moduleName === 'Accounts') {
    //   dropdownText = organizationModule?.label;
    // } else if (moduleName === 'Contacts') {
    //   dropdownText = contactModule?.label;
    // } else if (moduleName === 'Calendar') {
    //   dropdownText = calendarModule?.label;
    // }

    // const options = [
    //   organizationModule?.label,
    //   contactModule?.label,
    //   calendarModule?.label,
    // ].filter(Boolean);

    // if (this.isModuleActive('Leads')) options.push('Leads');

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
          {/* 
          <ModalDropdown
            options={this.props.menu}
            onSelect={(index, value) => this.handleDisplayModule(value)}
            defaultValue={moduleName}
            saveScrollPosition={false}
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
          </ModalDropdown> */}

          {this.props.menu?.length > 0 && (
            <Dropdown
              data={this.props.menu}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              style={styles.dropdown}
              maxHeight={300}
              labelField="label"
              valueField="value"
              // value={this.state.value}
              onChange={(item) => {
                this.setState({value: item?.value});
                this.props.moduleSelected(item?.name);
              }}
              renderItem={this.renderItem}
            />
          )}
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
  dropdown: {
    margin: 16,
    height: 50,
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontFamily: 'Poppins-Medium',
    color: '#707070',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontFamily: 'Poppins-Medium',
    color: '#707070',
    fontSize: 16,
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
