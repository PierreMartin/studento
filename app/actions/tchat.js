import { getChannelsByUserIdRequest, getChannelByUserFrontIdRequest, createNewChannelRequest, fetchMessagesRequest, createNewMessageRequest, fetchUnreadMessagesRequest, setReadMessagesRequest } from './../api';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;
let numberClickOnTchatBox = 0;

/**
 * formate an object for send to socket
 * @param {object} getChannel - the datas of the new channel just created
 * @param {object} userMe - the datas of my infos as user
 * @return {object} newChannelId and usersIdDestination
 **/
function formateGetChannel(getChannel, userMe) {
	const objChannel = Object.values(getChannel)[0];

	let newChannelId = '';
	const usersIdDestination = [];

	if (objChannel) {
		for (let i = 0; i < objChannel.users.length; i++) {
			if (objChannel.users[i]._id !== userMe._id) {
				usersIdDestination.push(objChannel.users[i]._id);
			}
		}

		newChannelId = objChannel.id;
	}

	return { newChannelId, usersIdDestination };
}

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

export function fetchChannelsByUserIdAction(userMeId) {
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
 * @param {string} userFrontId - the id of the user front
 * @param {object} channelsListOpen - the list of the channels open (from the state)
 * @return {boolean} true if already opened
 **/
function isTchatboxAlreadyOpened(userFrontId, channelsListOpen) {
	if (!userFrontId) return true;
	let isAlreadyOpened = false;

	if (Object.keys(channelsListOpen).length > 0) {
		for (const keyOfChannelList in channelsListOpen) {
			if (channelsListOpen[keyOfChannelList]) {
				for (let i = 0; i < channelsListOpen[keyOfChannelList].users.length; i++) {
					if (userFrontId === channelsListOpen[keyOfChannelList].users[i]._id) {
						isAlreadyOpened = true;
						break;
					}
				}
				if (isAlreadyOpened) break;
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

export function updateChannelsListAction(channelId) {
	return {
		type: types.UPDATE_CHANNELS_LIST_TCHAT,
		channelId
	};
}

export function openTchatboxAction(userMe, userFront, channelsListOpen, socket) {
	return (dispatch) => {
		if (!userMe || !userFront || isTchatboxAlreadyOpened(userFront._id, channelsListOpen)) return;

		let getChannel;
		getChannelByUserFrontIdRequest(userMe._id, userFront._id)
			.then((res) => {
				getChannel = res && res.data && res.data.getChannel;
				if (!getChannel) return createNewChannelRequest(userFront._id, userMe._id);
			})
			.then((resNewChannel) => {
				// if channel create:
				if (!getChannel) {
					getChannel = resNewChannel && resNewChannel.data && resNewChannel.data.newChannel;

					// update the channelsListAll store:
					if (getChannel && Object.keys(getChannel)[0]) dispatch(updateChannelsListAction(Object.keys(getChannel)[0]));

					// send new channel via sockets:
					socket.emit('new_channel', formateGetChannel(getChannel, userMe));
				}

				// Open a new instance of tchatbox :
				dispatch(openTchatboxSuccess(getChannel));
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

/***************************************** Receive new message socket *****************************************/
export function receiveNewMessageSocketAction(messageReceive) {
	return (dispatch) => {
		if (!messageReceive) return;

		return dispatch(createNewMessageSuccess(messageReceive));
	};
}

/***************************************** Fetch unread messages *****************************************/
export function fetchUnreadMessagesSuccess(res) {
	return {
		type: types.GET_NB_UNREAD_MESSAGES_TCHAT_SUCCESS,
		message: res.message,
		unreadMessagesList: res.unreadMessagesList
	};
}

export function fetchUnreadMessagesFailure(messageError) {
	return {
		type: types.GET_NB_UNREAD_MESSAGE_TCHAT_FAILURE,
		messageError
	};
}

export function fetchUnreadMessagesAction(userId, username) {
	return (dispatch) => {
		if (!userId || !username) return;

		fetchUnreadMessagesRequest(userId, username)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchUnreadMessagesSuccess(res.data));
			})
			.catch((err) => {
				if (err.message) return dispatch(fetchUnreadMessagesFailure(getMessage(err)));
			});
	};
}

/********************************* Receive unread message (by sockets) ***********************************/
export function receiveUnreadMessagesAction(messageReceive) {
	if (!messageReceive || !messageReceive.newMessageData) return;

	return {
		type: types.RECEIVE_UNREAD_MESSAGE_TCHAT,
		newMessageData: messageReceive.newMessageData
	};
}

/***************************************** Set as read messages *****************************************/
export function setReadMessagesSuccess(res) {
	return {
		type: types.SET_READ_MESSAGES_TCHAT_SUCCESS,
		message: res.message,
		channelId: res.channelId
	};
}

export function setReadMessagesFailure(messageError) {
	return {
		type: types.SET_READ_MESSAGE_TCHAT_FAILURE,
		messageError
	};
}

export function setReadMessagesAction(channelId, userMeData) {
	return (dispatch) => {
		if (!channelId || !userMeData.username || !userMeData.userId) return;
		numberClickOnTchatBox++;

		// For prevent the multiple requests for actions lower to 2s:
		if (numberClickOnTchatBox === 1) {
			const readMessagesInterval = setInterval(() => {
				setReadMessagesRequest(channelId, userMeData)
					.then((res) => {
						numberClickOnTchatBox = 0;
						clearInterval(readMessagesInterval);
						if (res.status === 200) return dispatch(setReadMessagesSuccess(res.data));
					})
					.catch((err) => {
						numberClickOnTchatBox = 0;
						clearInterval(readMessagesInterval);
						if (err.message) return dispatch(setReadMessagesFailure(getMessage(err)));
					});
			}, 2000);
		}
	};
}
