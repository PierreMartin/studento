import { combineReducers } from 'redux';
import * as types from './../types';


const all = (state = [], action) => {
	switch (action.type) {
		case types.GET_COURSES_SUCCESS:
			if (action.courses) return action.courses;
			return state;
		case types.DELETE_COURSE_SUCCESS:
			if (action.courseId) return state.filter(s => s._id !== action.courseId);
			return state;
		case types.GET_COURSES_FAILURE:
		case types.DELETE_COURSE_FAILURE:
			return state;
		default:
			return state;
	}
};

const one = (state = {}, action) => {
	switch (action.type) {
		case types.GET_COURSE_SUCCESS:
		case types.CREATE_OR_EDIT_COURSE_SUCCESS:
			if (action.course) return action.course;
			return state;
		case types.GET_COURSE_FAILURE:
		case types.CREATE_OR_EDIT_COURSE_FAILURE:
		case types.CREATE_OR_EDIT_COURSE_MISSING_FIELDS:
			return state;
		case types.EMPTY_COURSE:
			return {};
		default:
			return state;
	}
};

const addOrEditMissingField = (state = {}, action) => {
	switch (action.type) {
		case types.CREATE_OR_EDIT_COURSE_MISSING_FIELDS:
			if (action.fields) return action.fields;
			return state;
		case types.CREATE_OR_EDIT_COURSE_SUCCESS:
			return {};
		default:
			return state;
	}
};

const addOrEditFailure = (state = '', action) => {
	switch (action.type) {
		case types.CREATE_OR_EDIT_COURSE_FAILURE:
			if (action.messageError) return action.messageError;
			return state;
		case types.CREATE_OR_EDIT_COURSE_SUCCESS:
			return '';
		default:
			return state;
	}
};

const coursesReducer = combineReducers({
	all,
	one,
	addOrEditMissingField,
	addOrEditFailure
});

export default coursesReducer;
