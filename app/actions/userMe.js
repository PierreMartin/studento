import { updateUserRequest, createAvatarUserRequest, createAvatarS3UserRequest, defaultAvatarUserRequest } from './../api';
import { toast } from 'react-toastify';
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

// backendError
export function updateUserError(messageError) {
	return {
		type: types.UPDATE_USER_FAILURE,
		messageError
	};
}

// missingFieldsError
export function requiredFieldsError(fields) {
	return {
		type: types.UPDATE_USER_MISSING_REQUIRED_FIELDS,
		fields
	};
}

// empty be or missing errors
export function emptyErrorsUserUpdateAction() {
	return { type: types.EMPTY_ERRORS_UPDATING_USER };
}

export function updateUserSuccess(res) {
	return {
		type: types.UPDATE_USER_SUCCESS,
		message: res.message,
		userObj: res.data
	};
}

export function updateUserAction(data, id) {
	if (!data || Object.keys(data).length === 0) return;

	return (dispatch) => {
		return updateUserRequest(data, id)
			.then((response) => {
				if (response.status === 200) {
					dispatch(updateUserSuccess(response.data));
					toast.success(response.data.message);
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

/***************************************** POST AVATAR user ********************************************/
export function avatarUploadUserError(message) {
	return {
		type: types.UPDATE_USER_AVATAR_FAILURE,
		message
	};
}

export function avatarUploadUserSuccess(res) {
	return {
		type: types.UPDATE_USER_AVATAR_SUCCESS,
		message: res.message,
		avatarSrc: res.avatarSrc
	};
}

export function uploadAvatarUserAction(formData, userId, avatarId) {
	return (dispatch) => {
		const isProduction = process.env.NODE_ENV === 'production';

		if (isProduction) {
			return createAvatarS3UserRequest(formData, userId, avatarId)
				.then((resS3) => {
					if (resS3.status === 200) {
						dispatch(avatarUploadUserSuccess(resS3.data));
						toast.success(resS3.data.message);
					} else {
						dispatch(avatarUploadUserError(getMessage(resS3)));
					}
				})
				.catch((errOnS3) => {
					dispatch(avatarUploadUserError(getMessage(errOnS3)));
				});
		}

		return createAvatarUserRequest(formData, userId, avatarId)
			.then((response) => {
				if (response.status === 200) {
					dispatch(avatarUploadUserSuccess(response.data));
					toast.success(response.data.message);
				} else {
					dispatch(avatarUploadUserError(getMessage(response)));
				}
			})
			.catch((err) => {
				dispatch(avatarUploadUserError(getMessage(err)));
			});
	};
}

/***************************************** SET DEFAULT AVATAR user ********************************************/
export function defaultAvatarUserSuccess(res) {
	return {
		type: types.SET_MAIN_USER_AVATAR_SUCCESS,
		message: res.message,
		avatarMainSrc: res.avatarMainSrc
	};
}

export function defaultAvatarUserError(message) {
	return {
		type: types.SET_MAIN_USER_AVATAR_FAILURE,
		message
	};
}

export function avatarMainAction(avatarId, idUser) {
	return (dispatch) => {
		return defaultAvatarUserRequest(avatarId, idUser)
			.then((response) => {
				if (response.status === 200) {
					dispatch(defaultAvatarUserSuccess(response.data));
					toast.success(response.data.message);
				} else {
					dispatch(defaultAvatarUserError(getMessage(response)));
				}
			})
			.catch((err) => {
				dispatch(defaultAvatarUserError(getMessage(err)));
			});
	};
}
