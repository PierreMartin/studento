import { combineReducers } from 'redux';
import * as types from './../types';


const all = (state = [], action) => {
	switch (action.type) {
		case types.GET_CATEGORIES_SUCCESS:
			if (action.categories) return action.categories;
			return state;
		case types.GET_CATEGORIES_FAILURE:
			return state;
		default:
			return state;
	}
};


const categoriesReducer = combineReducers({
	all
});

export default categoriesReducer;
