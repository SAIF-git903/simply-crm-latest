import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import EventReducer from './eventReducer';
import DrawerReducer from './drawerReducer';
import RecordViewer from './recordViewerReducer';
import Mgr from './mgrReducer';
import dashboardReducer from './dashboardReducer';

export default combineReducers({
  auth: AuthReducer,
  event: EventReducer,
  drawer: DrawerReducer,
  recordViewer: RecordViewer,
  mgr: Mgr,
  dashboardUpdate: dashboardReducer,
});

