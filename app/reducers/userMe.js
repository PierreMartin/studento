import * as types from './../types';
import { combineReducers } from 'redux';


const data = (state = {}, action) => {
	switch (action.type) {
		case types.LOGIN_SUCCESS_USER:
		case types.SIGNUP_SUCCESS_USER:
		case types.LOGOUT_ERROR_USER:
			if (action.userObj) return action.userObj;
			return state;
		case types.UPDATE_USER_SUCCESS:
			if (action.userObj) {
				return {...state, ...action.userObj};
			}
			return state;
		case types.LOGIN_ERROR_USER:
		case types.SIGNUP_ERROR_USER:
		case types.LOGOUT_SUCCESS_USER:
			return {};
		default:
			return state;
	}
};

const typingUpdateUserState = (state = {}, action) => {
	switch (action.type) {
		case types.TYPING_UPDATE_USER_ACTION:
			return {...state, ...action.data};
		case types.UPDATE_USER_SUCCESS:
		case types.UPDATE_USER_FAILURE:
		case types.LOGOUT_SUCCESS_USER:
			return {};
		default:
			return state;
	}
};

const updateMessageError = (state = '', action) => {
	switch (action.type) {
		case types.UPDATE_USER_SUCCESS:
		case types.LOGOUT_SUCCESS_USER:
			return '';
		case types.UPDATE_USER_FAILURE:
			return action.messageError;
		default:
			return state;
	}
};

const updateMissingRequiredField = (state = {}, action) => {
	switch (action.type) {
		case types.UPDATE_USER_MISSING_REQUIRED_FIELDS:
			return action.fields;
		case types.LOGOUT_SUCCESS_USER:
		case types.UPDATE_USER_SUCCESS:
		case types.UPDATE_USER_FAILURE:
			return {};
		default:
			return state;
	}
};

const userMeReducer = combineReducers({
	data,
	typingUpdateUserState,
	updateMissingRequiredField,
	updateMessageError
});

export default userMeReducer;
