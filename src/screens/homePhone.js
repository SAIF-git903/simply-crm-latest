import { DrawerNavigator } from 'react-navigation';
import React from 'react';
import HomeMain from '../components/homeMain';
import HomeDrawer from '../components/homeDrawer';

const routeConfigs = { Main: { screen: HomeMain } };
const drawerNavigatorConfig = {
  drawerWidth: 250,
  contentComponent: props => <HomeDrawer {...props} />
};

const HomeNavigator = DrawerNavigator(routeConfigs, drawerNavigatorConfig);
HomeNavigator.navigationOptions = {
    header: null,
    gesturesEnabled: false
};

export default HomeNavigator;
