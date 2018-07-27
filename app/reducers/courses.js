import { combineReducers } from 'redux';
import * as types from './../types';


const all = (state = [], action) => {
	switch (action.type) {
		case types.GET_COURSES_SUCCESS:
			if (action.courses) return action.courses;
			return state;
		case types.GET_COURSES_FAILURE:
			return state;
		case types.CREATE_COURSE_SUCCESS:
			if (action.course) return [...state, action.course];
			return state;
		case types.CREATE_COURSE_FAILURE:
			return state.filter(t => t.id !== action.id);
		default:
			return state;
	}
};

const one = (state = {}, action) => {
	switch (action.type) {
		case types.GET_COURSE_SUCCESS:
			if (action.course) return action.course;
			return state;
		case types.GET_COURSE_FAILURE:
			return state;
		case types.EMPTY_COURSE:
			return {};
		default:
			return state;
	}
};

const coursesReducer = combineReducers({
	all,
	one
});

export default coursesReducer;
