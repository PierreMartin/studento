import { updateUserRequest, createAvatarUserRequest, createAvatarS3SignRequest, createAvatarS3SaveDbRequest, defaultAvatarUserRequest } from './../api';
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
		type: types.UPDATE_USER_MISSING_REQUIRED_FIELDS,
		fields
	};
}

export function updateUserAction(data, id) {
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

export function uploadAvatarUserAction(formData, userId, avatarId, file) {
	return (dispatch) => {
		const isProduction = process.env.NODE_ENV === 'production';

		if (isProduction) {
			if (!file.name || !file.type || !userId) return;

			return createAvatarS3SignRequest(file, userId).then((resSignS3) => {
				// createAvatarS3SignUploadRequest(resSignS3.signedRequest).then((resUploadSignS3) => {  if (resUploadSignS3.status === 200) createAvatarS3SaveDbRequest(formData, userId, avatarId)  })
				return createAvatarS3SaveDbRequest(formData, userId, avatarId)
					.then((resOnS3) => {
						if (resOnS3.status === 200) {
							dispatch(avatarUploadUserSuccess(resOnS3.data));
							toast.success(resOnS3.data.message);
						} else {
							dispatch(avatarUploadUserError(getMessage(resOnS3)));
						}
				}).catch((errOnS3) => {
						dispatch(avatarUploadUserError(getMessage(errOnS3)));
					});
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
