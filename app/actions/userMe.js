import { updateUserRequest } from './../api';
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
		userObj: res.data
	};
}

export function requiredFieldsError(fields) {
	return {
		type: types.MISSING_REQUIRED_FIELDS_UPDATE_USER, // TODO rename here
		fields
	};
}

export function updateUserAction(data, id) {
	return (dispatch) => {
		return updateUserRequest(data, id)
			.then((response) => {
				if (response.status === 200) {
					dispatch(updateUserSuccess(response.data));
				} else {
					dispatch(updateUserError(getMessage(response)));
				}
			})
			.catch((err) => {
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
