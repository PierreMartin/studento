import { addNewChannelRequest, fetchMessagesRequest, createNewMessageRequest } from './../api';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;

/***************************************** Open / close tchat box *****************************************/
export function openTchatboxAction(channelId) {
	return {
		type: types.ADD_TCHATBOX,
		channelId
	};
}

export function closeTchatboxAction(channelId) {
	return {
		type: types.REMOVE_TCHATBOX,
		channelId
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
		type: types.GET_MESSAGES_TCHAT_SUCCESS,
		message: res.message,
		messagesListForChannelId: res.messagesListForChannelId
	};
}

export function fetchMessagesFailure(messageError) {
	return {
		type: types.GET_MESSAGE_TCHAT_FAILURE,
		messageError
	};
}

export function fetchMessagesAction(channelId) {
	return (dispatch) => {
		if (!channelId) return;

		fetchMessagesRequest(channelId)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchMessagesSuccess(res.data));
			})
			.catch((err) => {
				if (err.message) return dispatch(fetchMessagesFailure(getMessage(err)));
			});
	};
}

/***************************************** Create new message *****************************************/
export function createNewMessageSuccess(res) {
	return {
		type: types.CREATE_NEW_MESSAGE_TCHAT_SUCCESS,
		message: res.message,
		newMessageData: res.newMessageData
	};
}

export function createNewMessageFailure(messageError) {
	return {
		type: types.CREATE_NEW_MESSAGE_TCHAT_FAILURE,
		messageError
	};
}

export function createNewMessageAction(newMessageData) {
	return (dispatch) => {
		if (!newMessageData) return;

		createNewMessageRequest(newMessageData)
			.then((res) => {
				if (res.status === 200) return dispatch(createNewMessageSuccess(res.data));
			})
			.catch((err) => {
				if (err.message) return dispatch(createNewMessageFailure(getMessage(err)));
			});
	};
}
