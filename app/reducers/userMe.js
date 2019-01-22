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
		case types.UPDATE_USER_AVATAR_SUCCESS:
			if (action.avatarSrc) {
				let avatarsSrcOutput = state.avatarsSrc || [];
				let avatarMainSrcOutput = state.avatarMainSrc;
				let isAvatarAlreadyExist = false;

				for (let i = 0; i < avatarsSrcOutput.length; i++) {
					// If avatar already exist - modify the current :
					if (avatarsSrcOutput[i].avatarId === action.avatarSrc.avatarId) {
						avatarsSrcOutput[i].avatar150 = action.avatarSrc.avatar150;
						avatarsSrcOutput[i].avatar80 = action.avatarSrc.avatar80;
						isAvatarAlreadyExist = true;

						// If updated the avatar setted as main - we also set default avatar :
						if (state.avatarMainSrc.avatarId === avatarsSrcOutput[i].avatarId) {
							avatarMainSrcOutput = avatarsSrcOutput[i];
						}

						break;
					}
				}

				// Else, if new avatar :
				if (!isAvatarAlreadyExist) {
					avatarsSrcOutput.push(action.avatarSrc);
				}

				return {...state, avatarsSrc: avatarsSrcOutput, avatarMainSrc: avatarMainSrcOutput};
			}
			return state;
		case types.UPDATE_USER_AVATAR_FAILURE:
			return state;
		case types.SET_MAIN_USER_AVATAR_SUCCESS:
			if (typeof action.avatarMainSrc !== 'undefined') {
				return {...state, avatarMainSrc: action.avatarMainSrc};
			}
			return state;
		case types.SET_MAIN_USER_AVATAR_FAILURE:
			return state;
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
		case types.EMPTY_ERRORS_UPDATING_USER:
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
		case types.EMPTY_ERRORS_UPDATING_USER:
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
