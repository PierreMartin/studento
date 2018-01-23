import * as types from 'types';
import { combineReducers } from 'redux';

// boxsOpen = [{channelId= '454545989', message: [{id: '', authorId: '', message: '', time: ''}, ... ] }, ...]

const boxsOpen = (state = [], action) => {
	switch (action.type) {
		case types.ADD_TCHATBOX:
			if (action.channelId) return [...state, { channelId: action.channelId }];
			return state;
		case types.REMOVE_TCHATBOX:
			if (action.channelId) return state.filter(t => t.channelId !== action.channelId); // action.channelId => box to remove
			return state;
		default:
			return state;
	}
};

const tchatReducer = combineReducers({
	boxsOpen
});

export default tchatReducer;
