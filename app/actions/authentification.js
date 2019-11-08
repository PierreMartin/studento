import { loginRequest, loginWithFacebookRequest, signupRequest, logoutRequest } from './../api';
import { push } from 'react-router-redux';
import * as types from 'types';
import { toast } from 'react-toastify';

const getMessage = res => res.response && res.response.data && res.response.data.message;
const getFieldsMissing = res => res.response && res.response.data && res.response.data.errorField;


// Required fields login / signup :
export function requiredFieldsError(fields) {
	return {
		type: types.LOGIN_SIGNUP_MISSING_REQUIRED_FIELDS,
		fields
	};
}

// Typing login / signup :
export function typingLoginSignupAction(nameField, valueField) {
	return {
		type: types.TYPING_LOGIN_SIGNUP_ACTION,
		data: {
			[nameField]: valueField
		}
	};
}


/***************************************** Log In ********************************************/
export function beginLogin() {
	return {type: types.LOGIN_BEGIN_USER};
}

export function loginSuccess(message, userObj) {
	return {
		type: types.LOGIN_SUCCESS_USER,
		message,
		userObj
	};
}

export function loginError(messageError) {
	return {
		type: types.LOGIN_ERROR_USER,
		messageError
	};
}

// AuthPassport
export function loginAction(data) {
	return (dispatch) => {
		dispatch(beginLogin());

		loginRequest(data)
			.then((response) => {
				if (response.status === 200) {
					dispatch(loginSuccess(response.data.message, response.data.userObj));
					dispatch(push('/user/' + response.data.userObj._id)); // redirection
					toast.success(response.data.message);
				} else {
					dispatch(loginError('Oops! Something went wrong!'));
				}
			})
			.catch((err) => {
				if (err.response.data.errorField) {
					// missing required fields :
					dispatch(requiredFieldsError(getFieldsMissing(err)));
				} else {
					// others errors :
					dispatch(loginError(getMessage(err)));
				}
			});
	};
}

// login or signup:
export function loginWithFacebookAction() {
	return (dispatch) => {
		dispatch(beginLogin());

		// TODO à cause de la redirection ('auth/facebook/callback'), le serveur ne peut envoyer de reponse à cette API
		loginWithFacebookRequest();
			/*
			.then((response) => {
				if (response.status === 200) {
					dispatch(loginSuccess(response.data.message, response.data.userObj));
					// dispatch(push('/user/' + response.data.userObj._id)); // redirection
					toast.success(response.data.message);
				} else {
					dispatch(loginError('Something went wrong!'));
				}
			})
			.catch((err) => {
					dispatch(loginError(getMessage(err)));
			});
			*/
	};
}

/***************************************** Sign Up ********************************************/
export function beginSignUp() {
	return {type: types.SIGNUP_BEGIN_USER};
}

export function signUpError(email, messageError) {
	return {
		type: types.SIGNUP_ERROR_USER,
		messageError,
		email
	};
}

export function signUpSuccess(message, userObj) {
	return {
		type: types.SIGNUP_SUCCESS_USER,
		message,
		userObj
	};
}

export function signupAction(data) {
	return (dispatch) => {
		dispatch(beginSignUp());

		signupRequest(data)
			.then((response) => {
				if (response.status === 200) {
					dispatch(signUpSuccess(response.data.message, response.data.userObj));
					dispatch(push('/settings')); // redirection
					toast.success(response.data.message);
				} else {
					dispatch(signUpError(data.email, 'Oops! Something went wrong'));
				}
			})
			.catch((err) => {
				if (err.response.data.errorField) {
					// missing required fields :
					dispatch(requiredFieldsError(getFieldsMissing(err)));
				} else {
					// acount already exist or others errors :
					dispatch(signUpError(data.email, getMessage(err)));
				}
			});
	};
}


/***************************************** Log Out ********************************************/
export function beginLogout() {
	return {type: types.LOGOUT_BEGIN_USER};
}

export function logoutSuccess() {
	return {type: types.LOGOUT_SUCCESS_USER};
}

export function logoutError() {
	return {type: types.LOGOUT_ERROR_USER};
}

export function logoutAction() {
	return (dispatch) => {
		dispatch(beginLogout());

		logoutRequest()
			.then((response) => {
				if (response.status === 200) {
					dispatch(logoutSuccess());
				} else {
					dispatch(logoutError());
				}
			})
			.catch((err) => {
				console.error(err);
				dispatch(logoutError());
			});
	};
}
