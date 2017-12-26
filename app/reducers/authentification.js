import * as types from 'types';
import { combineReducers } from 'redux';


const message = (state = '', action) => {
	switch (action.type) {
		case types.MANUAL_LOGIN_USER:
		case types.SIGNUP_USER:
		case types.LOGOUT_USER:
		case types.LOGIN_SUCCESS_USER:
		case types.SIGNUP_SUCCESS_USER:
			return '';
		case types.LOGIN_ERROR_USER:
		case types.SIGNUP_ERROR_USER:
			return action.message;
		default:
			return state;
	}
};

const isWaiting = (state = false, action) => {
	switch (action.type) {
		case types.MANUAL_LOGIN_USER:
		case types.SIGNUP_USER:
		case types.LOGOUT_USER:
			return true;
		case types.LOGIN_SUCCESS_USER:
		case types.SIGNUP_SUCCESS_USER:
		case types.LOGOUT_SUCCESS_USER:
		case types.LOGIN_ERROR_USER:
		case types.SIGNUP_ERROR_USER:
		case types.LOGOUT_ERROR_USER:
			return false;
		default:
			return state;
	}
};

const authenticated = (state = false, action) => {
	switch (action.type) {
		case types.LOGIN_SUCCESS_USER:
		case types.SIGNUP_SUCCESS_USER:
		case types.LOGOUT_ERROR_USER:
			return true;
		case types.LOGIN_ERROR_USER:
		case types.SIGNUP_ERROR_USER:
		case types.LOGOUT_SUCCESS_USER:
			return false;
		default:
			return state;
	}
};

/************* login/signup - typing *************/
const typingLoginSignupState = (state = {}, action) => {
	switch (action.type) {
		case types.TYPING_LOGIN_SIGNUP_ACTION:
			return {...state, ...action.data};
		case types.LOGIN_SUCCESS_USER:
		case types.SIGNUP_SUCCESS_USER:
		case types.LOGOUT_SUCCESS_USER:
			return {};
		case types.LOGIN_ERROR_USER:
		case types.SIGNUP_ERROR_USER:
			return state;
		default:
			return state;
	}
};

const missingRequiredField = (state = {}, action) => {
	switch (action.type) {
		case types.LOGIN_SIGNUP_MISSING_REQUIRED_FIELDS:
			return action.fields;
		case types.LOGIN_SUCCESS_USER:
		case types.SIGNUP_SUCCESS_USER:
		case types.LOGOUT_SUCCESS_USER:
		case types.LOGIN_ERROR_USER:
		case types.SIGNUP_ERROR_USER:
		case types.LOGOUT_ERROR_USER:
			return {};
		default:
			return state;
	}
};

const authentificationReducer = combineReducers({
	isWaiting,
	authenticated,
	message,
	typingLoginSignupState,
	missingRequiredField
});

export default authentificationReducer;
