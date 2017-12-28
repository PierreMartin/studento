import * as types from './../types';

const userMe = (state = {}, action) => {
	switch (action.type) {
		case types.LOGIN_SUCCESS_USER:
		case types.SIGNUP_SUCCESS_USER:
		case types.LOGOUT_ERROR_USER:
			if (action.userObj) return action.userObj;
			return state;
		case types.LOGIN_ERROR_USER:
		case types.SIGNUP_ERROR_USER:
		case types.LOGOUT_SUCCESS_USER:
			return {};
		default:
			return state;
	}
};

export default userMe;
