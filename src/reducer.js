import { combineReducers } from 'redux';
import face from './reducers/face';
import tongue from './reducers/tongue';
export default combineReducers({
   face,
   tongue
});