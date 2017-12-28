import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import authentification from './authentification';
import users from './users';
import userMe from './userMe';
import courses from './courses';

const rootReducer = combineReducers({
	authentification,
	users,
	userMe,
  courses,
  routing
});

export default rootReducer;
