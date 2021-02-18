import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { Text, TextInput, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import DrawerContent from './components/drawerContent';

// Screens
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Records from './screens/Records';
import RecordDetails from './screens/Record/';
import ForgotPassword from './screens/ForgotPassword';
import Calendar from './screens/Calendar';
import AddRecord from './components/addRecords';
import ReferenceScreen from './components/addRecords/referenceRecordLister';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


let defaultTextRender = Text.render;
Text.render = function (...args) {
    let origin = defaultTextRender.call(this, ...args);

    return React.cloneElement(origin, {
        style: [{ color: 'black', fontFamily: 'Poppins-Regular' }, origin.props.style]
    })
};

let defaultTextInputRender = TextInput.render;
TextInput.render = function (...args) {
    let origin = defaultTextInputRender.call(this, ...args);

    return React.cloneElement(origin, {
        style: [{ height: 50 }, origin.props.style]
    })
};

StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.20)');
StatusBar.setTranslucent(true);
StatusBar.setBarStyle('light-content', true);

export default class Router extends Component {
    createLoginStack = () => <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Drawer" component={this.createDrawer} />
        <Stack.Screen name="Record Details" component={RecordDetails} />
        <Stack.Screen name="Add Record" component={AddRecord} />
        <Stack.Screen name="Edit Record" component={AddRecord} />
        <Stack.Screen name="Reference Screen" component={ReferenceScreen} />
        <Stack.Screen name="Forgot Password" component={ForgotPassword} />
    </Stack.Navigator>;

    createDrawer = () => <Drawer.Navigator
        drawerType={'front'}
        drawerContent={props => <DrawerContent {...props} />}
    >
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Records" component={Records} />
        <Drawer.Screen name="Calendar" component={Calendar} />
    </Drawer.Navigator>;

    render() {
        return (
            <SafeAreaProvider>
                <NavigationContainer>
                    {this.createLoginStack()}
                </NavigationContainer>
            </SafeAreaProvider>
        );
    }
}
