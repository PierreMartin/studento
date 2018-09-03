import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import authentification from './authentification';
import users from './users';
import userMe from './userMe';
import courses from './courses';
import tchat from './tchat';
import categories from './categories';

const rootReducer = combineReducers({
	authentification,
	tchat,
	users,
	userMe,
  courses,
	categories,
  routing
});

export default rootReducer;
