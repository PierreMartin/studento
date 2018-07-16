import * as types from 'types';
import { combineReducers } from 'redux';

/*
channelsListOpen = {
	'454548989': {
		id: '454548989',
 		users: [{POPULATE}, {POPULATE}, {POPULATE}]
	},
	'454548990': {
		id: '454548990',
 		users: [{POPULATE}, {POPULATE}, {POPULATE}]
	}
}
*/

/*
messagesListOpen = {
	'454545989': {
		channelId: '454545989',
		messages: [{_id: '', author: {POPULATE}, content: '', created_at: '', read_at: ''}, {_id: '', author: {POPULATE}, content: '', created_at: '', read_at: ''}, {_id: '', author: {POPULATE}, content: '', created_at: '', read_at: ''}]
	},
	'454545990': {
		channelId: '454545990',
		messages: [{_id: '', author: {POPULATE}, content: '', created_at: '', read_at: ''}, {_id: '', author: {POPULATE}, content: '', created_at: '', read_at: ''}, {_id: '', author: {POPULATE}, content: '', created_at: '', read_at: ''}]
	}
}
*/

const channelsListAll = (state = [], action) => {
	switch (action.type) {
		case types.GET_CHANNELS_TCHAT_SUCCESS:
			if (action.channelsList && action.channelsList.length > 0) return action.channelsList;
			return state;
		case types.GET_CHANNELS_TCHAT_FAILURE:
			return state;
		case types.UPDATE_CHANNELS_LIST_TCHAT:
			if (action.channelId) return [...state, action.channelId];
			return state;
		default:
			return state;
	}
};

const channelsListOpen = (state = {}, action) => {
	switch (action.type) {
		case types.ADD_TCHATBOX:
			if (action.getChannel) return {...state, ...action.getChannel};
			return state;
		case types.REMOVE_TCHATBOX:
			if (action.channelId) {
				const newState = Object.assign({}, state); // clone state
				delete newState[action.channelId]; // delete channel of the box removed
				return newState;
			}

			return state;
		default:
			return state;
	}
};

const messagesListOpen = (state = {}, action) => {
	switch (action.type) {
		case types.GET_MESSAGES_TCHAT_SUCCESS:
			if (action.getMessagesListForChannel) {
				let newMessagesListForChannel = {};

				const cId = Object.keys(action.getMessagesListForChannel)[0];
				const oldMsgs = state[cId] ? state[cId].messages : [];
				const newMsgs = action.getMessagesListForChannel[cId].messages;

				newMessagesListForChannel = action.getMessagesListForChannel;
				newMessagesListForChannel[cId].messages = [...newMsgs, ...oldMsgs];

				return {...state, ...newMessagesListForChannel};
			}
			return state;
		case types.GET_MESSAGE_TCHAT_FAILURE:
			return state;
		case types.REMOVE_TCHATBOX:
			if (action.channelId) {
				const newState = Object.assign({}, state); // clone state
				delete newState[action.channelId]; // delete all messages of the box removed
				return newState;
			}

			return state;
		case types.ADD_OR_RECEIVE_NEW_MESSAGE_TCHAT:
			const channelId = action.newMessageData && action.newMessageData.channelId;
			if (channelId && state[channelId]) {
				return {
					...state,
					[channelId]: {
						...state[channelId],
						messages: [
							...state[channelId].messages, // ...arr => obj
							action.newMessageData // obj
						]
					}
				};
			}

			return state;
		case types.CREATE_NEW_MESSAGE_TCHAT_FAILURE:
			return state;
		default:
			return state;
	}
};

const unreadMessages = (state = [], action) => {
	switch (action.type) {
		case types.GET_NB_UNREAD_MESSAGES_TCHAT_SUCCESS:
			if (action.unreadMessagesList) return action.unreadMessagesList;
			return state;
		case types.GET_NB_UNREAD_MESSAGE_TCHAT_FAILURE:
			return state;
		case types.ADD_OR_RECEIVE_NEW_MESSAGE_TCHAT:
			// Do nothing if the message has been create by the user:
			if (!action.receiveFromSockets) return state;
			const newStateForUnreadMessages = JSON.parse(JSON.stringify(state)) || []; // clone state

			for (let i = 0; i < newStateForUnreadMessages.length; i++) {
				// if channel already exist:
				if (newStateForUnreadMessages[i]._id === action.newMessageData.channelId) {
					newStateForUnreadMessages[i].count++;
					newStateForUnreadMessages[i].lastMessageDate = action.newMessageData.created_at;
					return newStateForUnreadMessages;
				}
			}

			// if channel don't exist in unreadMessages:
			newStateForUnreadMessages.push({
				author: [action.newMessageData.author],
				count: 1,
				_id: action.newMessageData.channelId,
				lastMessageDate: action.newMessageData.created_at
			});

			return newStateForUnreadMessages;
		case types.SET_READ_MESSAGES_TCHAT_SUCCESS:
			const newState = JSON.parse(JSON.stringify(state)); // clone state
			if (state.length > 0 && action.channelId) return newState.filter(s => s._id !== action.channelId);
			return state;
		case types.SET_READ_MESSAGE_TCHAT_FAILURE:
			return state;
		default:
			return state;
	}
};

const tchatReducer = combineReducers({
	channelsListAll,
	channelsListOpen,
	messagesListOpen,
	unreadMessages
});

export default tchatReducer;
