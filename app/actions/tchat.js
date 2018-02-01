import { getChannelsByUserIdRequest, createNewChannelRequest, fetchMessagesRequest, createNewMessageRequest } from './../api';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;

/***************************************** Get channels *****************************************/
export function getChannelsByUserIdSuccess(res) {
	return {
		type: types.GET_CHANNELS_TCHAT_SUCCESS,
		message: res.message,
		channelsList: res.channelsList
	};
}

export function getChannelsByUserIdFailure(messageError) {
	return {
		type: types.GET_CHANNELS_TCHAT_FAILURE,
		messageError
	};
}

export function getChannelsByUserIdAction(userMeId) {
	return (dispatch) => {
		if (!userMeId) return;

		getChannelsByUserIdRequest(userMeId)
			.then((res) => {
				if (res.status === 200) return dispatch(getChannelsByUserIdSuccess(res.data));
			})
			.catch((err) => {
				if (err.message) return dispatch(getChannelsByUserIdFailure(getMessage(err)));
			});
	};
}

/***************************************** Create new channel *****************************************/
export function createNewChannelSuccess(res) {
	return {
		type: types.CREATE_NEW_CHANNEL_SUCCESS,
		message: res.message,
		newChannel: res.newChannel
	};
}

export function createNewChannelFailure(messageError) {
	return {
		type: types.CREATE_NEW_CHANNEL_FAILURE,
		messageError
	};
}

export function createNewChannelAction(userFrontId, userMeId) {
	return (dispatch) => {
		if (!userFrontId || !userMeId) return;

		createNewChannelRequest(userFrontId, userMeId)
			.then((res) => {
				if (res.status === 200) return dispatch(createNewChannelSuccess(res.data));
			})
			.catch((err) => {
				if (err.message) return dispatch(createNewChannelFailure(getMessage(err)));
			});
	};
}

/***************************************** Open / close tchat box *****************************************/
/**
 * Get the channel if already created
 * @return {null | object} null if no matching - the object of the channel if matching
 **/
function getChannelByUserFrontId(channelsList, userFront) {
	if (!channelsList) return null;
	let channel = null;

	if (channelsList && channelsList.length > 0) {
		for (let i = 0; i < channelsList.length; i++) {
			for (let j = 0; j < channelsList[i].users.length; j++) {
				if (channelsList[i].users[j]._id === userFront._id) {
					channel = channelsList[i];
					break;
				}
			}
			if (channel) break;
		}
	}

	return channel;
}

/**
 * Check if the current tchatbox is already opened :
 * @return {boolean} true if already opened
 **/
function isTchatboxAlreadyOpened(channel, boxsOpen) {
	if (!channel) return true;
	let isAlreadyOpened = false;

	for (let i = 0; boxsOpen.length > 0 && i < boxsOpen.length; i++) {
		const channelIdFromBoxsOpen = boxsOpen[i];
		if (channel.id === channelIdFromBoxsOpen) {
			isAlreadyOpened = true;
			break;
		}
	}

	return isAlreadyOpened;
}

export function openTchatboxSuccess(channelId) {
	return {
		type: types.ADD_TCHATBOX,
		channelId
	};
}

export function openTchatboxAction(userMe, userFront, boxsOpen) {
	return (dispatch) => {
		if (!userMe || !userFront) return;

		// 1) REQ - get all channels by userMe
		// 2) matching for get the channel nedeed for open the box
		// 		a) COND REQ - create new channel if doesn't exist
		// 		b) COND REQ - get all channels by (with new channel)
		// 3) open box with the channel

		let channelToFind;
		let resFirstReq = {};

		// TODO here import the state.channelsList for tests before make requests

		// get all channels
		getChannelsByUserIdRequest(userMe._id)
			.then((res) => {
				if (res && res.data && res.data.channelsList) {
					// Get the channel nedeed for open the box :
					channelToFind = getChannelByUserFrontId(res.data.channelsList, userFront);
					resFirstReq = res;
				}

				// create new channel if needed :
				if (!channelToFind) return createNewChannelRequest(userFront._id, userMe._id);
			})
			.then(() => {
				// get all channels if needed :
				if (!channelToFind) return getChannelsByUserIdRequest(userMe._id);
			})
			.then((res) => {
				// if channel created - we get again the channel nedeed for open the box :
				if (res && res.status === 200) {
					channelToFind = getChannelByUserFrontId(res.data.channelsList, userFront);
				}

				const dataChannels = (res && res.status === 200) ? res.data : resFirstReq.data;
				dispatch(getChannelsByUserIdSuccess(dataChannels));

				// ALL THE CASES : open a new instance of tchatbox :
				if (!isTchatboxAlreadyOpened(channelToFind, boxsOpen)) {
					dispatch(openTchatboxSuccess(channelToFind.id));
				}
			});
	};
}

export function closeTchatboxAction(channelId) {
	return {
		type: types.REMOVE_TCHATBOX,
		channelId
	};
}

/***************************************** Fetch messages *****************************************/
export function fetchMessagesSuccess(res) {
	return {
		type: types.GET_MESSAGES_TCHAT_SUCCESS,
		message: res.message,
		getMessagesListForChannel: res.getMessagesListForChannel
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
