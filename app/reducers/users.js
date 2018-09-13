import { combineReducers } from 'redux';
import * as types from './../types';

const all = (state = [], action) => {
	switch (action.type) {
		case types.GET_USERS_SUCCESS:
			if (action.data) return action.data;
			return state;
		case types.GET_USERS_FAILURE:
			if (action.data) return action.message;
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

const usersReducer = combineReducers({
	all,
	one
});

export default usersReducer;
