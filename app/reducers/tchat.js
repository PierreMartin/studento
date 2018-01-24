import * as types from 'types';
import { combineReducers } from 'redux';

/*
messagesList = [{
	channelId: '454545989',
	messages: [{
		_id: '',
		authorId: '',
		content: '',
	  created_at: '',
	  read_at: '',
	}]
}]
*/

const boxsOpen = (state = [], action) => {
	switch (action.type) {
		case types.ADD_TCHATBOX:
			if (action.channelId) return [...state, action.channelId];
			return state;
		case types.REMOVE_TCHATBOX:
			if (action.channelId) return state.filter(channelId => channelId !== action.channelId); // action.channelId => box to remove
			return state;
		default:
			return state;
	}
};

const messagesList = (state = [], action) => {
	switch (action.type) {
		case types.GET_MESSAGES_TCHAT_SUCCESS:
			// TODO voir ici
			// for => if (state.messagesList[i].channelId === action.messagesListForChannelId.channelId) ? [...state[...state[i].messages, action.messagesListForChannelId]] :  '';
			if (action.messagesListForChannelId) return action.messagesListForChannelId;
			return state;
		case types.GET_MESSAGE_TCHAT_FAILURE:
			return state;
		case types.CREATE_NEW_MESSAGE_TCHAT_SUCCESS:
			if (action.newMessageData) return [...state, action.newMessageData];
			return state;
		case types.CREATE_NEW_MESSAGE_TCHAT_FAILURE:
			return state;
		default:
			return state;
	}
};

const tchatReducer = combineReducers({
	boxsOpen,
	messagesList
});

export default tchatReducer;
