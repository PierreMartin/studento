import * as types from 'types';
import { combineReducers } from 'redux';

const isBoxOpen = (state = false, action) => {
	switch (action.type) {
		case types.TCHATBOX_MODAL_ISOPEN_ACTION:
			return action.isOpen;
		default:
			return state;
	}
};

const tchatReducer = combineReducers({
	isBoxOpen
});

export default tchatReducer;
