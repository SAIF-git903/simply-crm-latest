import { StackNavigator } from 'react-navigation';
import { Dimensions } from 'react-native';
import login from './screens/login';
import homeTablet from './screens/homeTablet';
import homePhone from './screens/homePhone';
import recordViewer from './components/recordViewer';
import search from './components/search';
import addRecord from './components/addRecords';
import editRecord from './components/editRecords';
import reference from './components/addRecords/referenceRecordLister';


function getHome() {
    const { width } = Dimensions.get('screen');

    if (width > 600) {
        return ({
        screen: homeTablet
    });
    }

    return ({
        screen: homePhone
    });
}

const routerConfig = {
    SplashScreen: { 
        screen: login,
    },
    HomeScreen: getHome(),
    SearchScreen: {
        screen: search
    },
    DetailsScreen: {
        screen: recordViewer
    },
    AddRecordScreen: {
        screen: addRecord
    },
    EditRecordScreen: {
        screen: editRecord
    },
    ReferenceScreen: {
        screen: reference
    }
};

const stackNavigatorConfig = {
    headerMode: 'screen'
};

const MainNavigator = StackNavigator(routerConfig, stackNavigatorConfig);
export default MainNavigator;
