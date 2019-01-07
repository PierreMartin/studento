import { combineReducers } from 'redux';
import _ from 'lodash';
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
		case types.DO_SORT_COURSES:
			const { doReverse, clickedColumn } = action.param;

			if (doReverse) return state.reverse();
			if (clickedColumn) return _.orderBy(state, [s => s[clickedColumn].toLowerCase(), 'create_at']);
			return state;
		case types.CREATE_OR_EDIT_COURSE_SUCCESS:
			// If update:
			if (action.isUpdate && action.course) {
				const newStateForAllCourses = JSON.parse(JSON.stringify(state)) || [];
				for (let i = 0; i < newStateForAllCourses.length; i++) {
					if (newStateForAllCourses[i]._id === action.course._id) {
						newStateForAllCourses[i] = action.course;
						return newStateForAllCourses;
					}
				}
			} else if (action.course && ((action.coursesPagesCount === 0 || action.coursesPagesCount === 1) || action.coursesPagesCount === action.indexPagination) && state.length < 12) {  // 12 => numberItemPerPage setted in controller
				// If new course:
				return [action.course, ...state]; // add the data only if we here on the last page for handle the pagination
			}

			return state;
		case types.RATING_COURSE_SUCCESS:
			if (action.stars && action.courseId) {
				const newStateForRatingCourse = JSON.parse(JSON.stringify(state)) || [];
				for (let j = 0; j < newStateForRatingCourse.length; j++) {
					if (newStateForRatingCourse[j]._id === action.courseId) {
						newStateForRatingCourse[j].stars = action.stars;
						return newStateForRatingCourse;
					}
				}
			}
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
		case types.ADD_COMMENT_COURSE_SUCCESS:
			if (action.commentsList) return { ...state, commentedBy: action.commentsList };
			return state;
		case types.RATING_COURSE_SUCCESS:
			if (action.stars) return { ...state, stars: action.stars };
			return state;
		case types.GET_COURSE_FAILURE:
		case types.CREATE_OR_EDIT_COURSE_FAILURE:
		case types.CREATE_OR_EDIT_COURSE_MISSING_FIELDS:
		case types.ADD_COMMENT_COURSE_FAILURE:
		case types.RATING_COURSE_FAILURE:
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
		case types.EMPTY_ERRORS_EDITING_COURSE:
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
		case types.EMPTY_ERRORS_EDITING_COURSE:
			return '';
		default:
			return state;
	}
};

const coursesCount = (state = 0, action) => {
	switch (action.type) {
		case types.GET_COURSES_SUCCESS:
			if (action.coursesCount >= 0) return action.coursesCount;
			return state;
		case types.GET_COURSES_FAILURE:
			return 0;
		default:
			return state;
	}
};

const pagesCount = (state = 0, action) => {
	switch (action.type) {
		case types.GET_COURSES_SUCCESS:
			if (action.pagesCount >= 0) return action.pagesCount;
			return state;
		case types.GET_COURSES_FAILURE:
			return 0;
		default:
			return state;
	}
};

const paginationEditor = (state = { lastActivePage: 1 }, action) => {
	switch (action.type) {
		case types.SET_PAGINATION_COURSES_EDITOR:
			if (action.paginationEditor) return action.paginationEditor;
			return state;
		default:
			return state;
	}
};

const addCommentMissingField = (state = {}, action) => {
	switch (action.type) {
		case types.ADD_COMMENT_COURSE_MISSING_FIELDS:
			if (action.fields) return action.fields;
			return state;
		case types.ADD_COMMENT_COURSE_SUCCESS:
		case types.EMPTY_ERRORS_COMMENTING_COURSE:
			return {};
		default:
			return state;
	}
};

const coursesReducer = combineReducers({
	all,
	one,
	addOrEditMissingField,
	addOrEditFailure,
	coursesCount,
	pagesCount,
	paginationEditor,
	addCommentMissingField
});

export default coursesReducer;
