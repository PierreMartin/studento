import { addNewChannelRequest, fetchMessagesRequest } from './../api';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;

/***************************************** Open / close tchat box *****************************************/
export function isBoxOpenAction(isOpen) {
	return {
		type: types.TCHATBOX_MODAL_ISOPEN_ACTION,
		isOpen
	};
}

/***************************************** Add new channel *****************************************/
export function addNewChannelSuccess(res) {
	return {
		type: types.ADD_NEW_CHANNEL_SUCCESS,
		message: res.message,
		newChannel: res.channelForUserMe
	};
}

export function addNewChannelFailure(messageError) {
	return {
		type: types.ADD_NEW_CHANNEL_FAILURE,
		messageError
	};
}

export function addNewChannelAction(userFrontId, userMeId) {
	return (dispatch) => {
		if (!userFrontId || !userMeId) return;

		addNewChannelRequest(userFrontId, userMeId)
			.then((res) => {
				if (res.status === 200) return dispatch(addNewChannelSuccess(res.data));
			})
			.catch((err) => {
				if (err.message) return dispatch(addNewChannelFailure(getMessage(err)));
			});
	};
}

/***************************************** Fetch messages *****************************************/
export function fetchMessagesSuccess(res) {
	return {
		type: types.GET_TCHAT_MESSAGES_SUCCESS,
		message: res.message,
		newMessage: res.newMessage
	};
}

export function fetchMessagesFailure(messageError) {
	return {
		type: types.GET_TCHAT_MESSAGE_FAILURE,
		messageError
	};
}

export function fetchMessagesAction(userMeId, channelId) {
	return (dispatch) => {
		if (!userMeId || !channelId) return;

		fetchMessagesRequest(userMeId, channelId)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchMessagesSuccess(res.data));
			})
			.catch((err) => {
				if (err.message) return dispatch(fetchMessagesFailure(getMessage(err)));
			});
	};
}
