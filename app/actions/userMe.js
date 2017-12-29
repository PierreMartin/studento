import { updateUser } from './../api';
import { push } from 'react-router-redux';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;
const getFieldsMissing = res => res.response && res.response.data && res.response.data.errorField;


/***************************************** UPDATE user ********************************************/
export function typingUpdateUserAction(nameField, valueField) {
	return {
		type: types.TYPING_UPDATE_USER_ACTION,
		data: {
			[nameField]: valueField
		}
	};
}

export function updateUserError(messageError) {
	return {
		type: types.UPDATE_USER_FAILURE,
		messageError
	};
}

export function updateUserSuccess(res) {
	return {
		type: types.UPDATE_USER_SUCCESS,
		message: res.message,
		userObj: res.userObj
	};
}

export function updateUserAction(data, id) {
	return dispatch => {
		return updateUser(data, id)
			.then(response => {
				if (response.status === 200) {
					dispatch(updateUserSuccess(response.data));
				} else {
					dispatch(updateUserError(response.data.message));
				}
			})
			.catch(err => {
				if (err.response.data.errorField) {
					// missing required fields :
					dispatch(requiredFieldsError(getFieldsMissing(err)));
				} else {
					// others errors :
					dispatch(updateUserError(getMessage(err)));
				}
			});
	};
}
