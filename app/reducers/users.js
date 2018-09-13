import { combineReducers } from 'redux';
import * as types from './../types';

const all = (state = [], action) => {
	switch (action.type) {
		case types.GET_USERS_SUCCESS:
			if (action.users) return action.users;
			return state;
		case types.GET_USERS_FAILURE:
			return state;
		default:
			return state;
	}
};

const one = (state = {}, action) => {
	switch (action.type) {
		case types.GET_USER_SUCCESS:
			if (action.user) return action.user;
			return state;
		case types.GET_USER_FAILURE:
			return state;
		default:
			return state;
	}
};

const pagesCount = (state = 0, action) => {
	switch (action.type) {
		case types.GET_USER_SUCCESS:
			if (action.pagesCount >= 0) return action.pagesCount;
			return state;
		case types.GET_USER_FAILURE:
			return 0;
		default:
			return state;
	}
};

const usersReducer = combineReducers({
	all,
	one,
	pagesCount
});

export default usersReducer;
