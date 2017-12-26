import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import authentification from './authentification';
import courses from './courses';

const rootReducer = combineReducers({
	authentification,
  courses,
  routing
});

export default rootReducer;
