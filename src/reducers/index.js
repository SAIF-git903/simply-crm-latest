import {combineReducers} from 'redux';
import AuthReducer from './authReducer';
import EventReducer from './eventReducer';
import DrawerReducer from './drawerReducer';
import RecordViewer from './recordViewerReducer';
import Mgr from './mgrReducer';
import dashboardReducer from './dashboardReducer';
import UserReducer from './userReducer';

// Ducks
import calendar from '../ducks/calendar';
import updates from '../ducks/updates';
import comments from '../ducks/comments';
import durationreducer from './durationReducer';

export default combineReducers({
  auth: AuthReducer,
  event: EventReducer,
  drawer: DrawerReducer,
  recordViewer: RecordViewer,
  mgr: Mgr,
  dashboardUpdate: dashboardReducer,
  UserReducer,
  calendar,
  updates,
  comments,
  durationreducer,
});
