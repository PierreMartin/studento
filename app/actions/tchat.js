import { getChannelByUserFrontIdRequest, createNewChannelRequest, fetchMessagesRequest, createNewMessageRequest } from './../api';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;

/***************************************** Get channels *****************************************/
/*
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
*/

/***************************************** Create new channel *****************************************/
/*
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
*/

/***************************************** Open / close tchat box *****************************************/

/**
 * Check if the current tchatbox is already opened
 * @param {object} getChannel - the channel find by back-end
 * @param {object} channelsListOpen - the list of the channels open (from the state)
 * @return {boolean} true if already opened
 **/
function isTchatboxAlreadyOpened(getChannel, channelsListOpen) {
	if (!getChannel) return true;
	let isAlreadyOpened = false;

	if (Object.keys(channelsListOpen).length > 0) {
		for (const keyOfChannelList in channelsListOpen) {
			if (channelsListOpen[keyOfChannelList]) {
				// if key of channel to try to open === key of channelslist (info: key === id)
				if (Object.keys(getChannel)[0] === keyOfChannelList) {
					isAlreadyOpened = true;
					break;
				}
			}
		}
	}

	return isAlreadyOpened;
}

export function openTchatboxSuccess(getChannel) {
	return {
		type: types.ADD_TCHATBOX,
		getChannel
	};
}

export function openTchatboxAction(userMe, userFront, channelsListOpen) {
	return (dispatch) => {
		if (!userMe || !userFront) return;

		let getChannel;
		getChannelByUserFrontIdRequest(userMe._id, userFront._id)
			.then((res) => {
				getChannel = res && res.data && res.data.getChannel;
				if (!getChannel) return createNewChannelRequest(userFront._id, userMe._id); // TODO return new channel populate
			})
			.then((res) => {
				if (!getChannel) {
					getChannel = res && res.data && res.data.getChannel; // data from channel create
				}

				// Open a new instance of tchatbox :
				if (!isTchatboxAlreadyOpened(getChannel, channelsListOpen)) {
					dispatch(openTchatboxSuccess(getChannel));
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
