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
			if (action.getMessagesListForChannel) return {...state, ...action.getMessagesListForChannel};
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
		case types.CREATE_NEW_MESSAGE_TCHAT_SUCCESS:
			const channelId = action.newMessageData && action.newMessageData.channelId;
			if (channelId) {
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

const unreadMessages = (state = {}, action) => {
	switch (action.type) {
		case types.GET_NB_UNREAD_MESSAGES_TCHAT_SUCCESS:
			if (action.unreadMessagesList) return action.unreadMessagesList;
			return state;
		case types.GET_NB_UNREAD_MESSAGE_TCHAT_FAILURE:
			return state;
		default:
			return state;
	}
};

const tchatReducer = combineReducers({
	channelsListOpen,
	messagesListOpen,
	unreadMessages
});

export default tchatReducer;
