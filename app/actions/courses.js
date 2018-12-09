import * as types from './../types';
import { createCourseRequest, updateCourseRequest, fetchCoursesByFieldRequest, fetchCoursesBySearchRequest, deleteCourseRequest, addCommentRequest } from './../api';
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';

const getMessage = res => res.response && res.response.data && res.response.data.message;
const getFieldsMissing = res => res.response && res.response.data && res.response.data.errorField;

/************************ Get courses by id or a field ***********************/
export function fetchCoursesByIdSuccess(res) {
	return {
		type: types.GET_COURSES_SUCCESS,
		messageSuccess: res.message,
		courses: res.courses,
		pagesCount: res.pagesCount
	};
}

export function fetchCoursesByIdFailure(messageError) {
	return {
		type: types.GET_COURSES_FAILURE,
		messageError
	};
}

export function fetchCoursesByFieldAction(param) {
	if (!param.keyReq || !param.valueReq) return;

	return (dispatch) => {
		fetchCoursesByFieldRequest(param)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchCoursesByIdSuccess(res.data));
			})
			.catch((err) => {
				dispatch(fetchCoursesByIdFailure(getMessage(err)));
			});
	};
}

/************************ Get courses by search ***********************/
export function fetchCoursesBySearchAction(fieldSearch) {
	return (dispatch) => {
		if (typeof fieldSearch.typing === 'undefined' || !fieldSearch.select || fieldSearch.select === '') return;

		// When the user delete the search after typing in input:
		if (fieldSearch.typing.trim() === '') {
			return fetchCoursesByFieldRequest({ keyReq: 'all', valueReq: 'all' }, { dispatch })
				.then((resCoursesByField) => {
					if (resCoursesByField.status === 200) return dispatch(fetchCoursesByIdSuccess(resCoursesByField.data));
				})
				.catch((err) => {
				return dispatch(fetchCoursesByIdFailure(getMessage(err)));
			});
		}

		fetchCoursesBySearchRequest(fieldSearch)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchCoursesByIdSuccess(res.data));
			})
			.catch((err) => {
				dispatch(fetchCoursesByIdFailure(getMessage(err)));
			});
	};
}

/************************ Create or edit course ***********************/
export function addOrEditCourseSuccess(res, isUpdate, coursesPagesCount, indexPagination) {
	return {
		type: types.CREATE_OR_EDIT_COURSE_SUCCESS,
		messageSuccess: res.message,
		course: res.newCourse,
		isUpdate,
		coursesPagesCount,
		indexPagination
	};
}

export function addOrEditCourseFailure(messageError) {
	return {
		type: types.CREATE_OR_EDIT_COURSE_FAILURE,
		messageError
	};
}

export function addOrEditMissingField(fields) {
	return {
		type: types.CREATE_OR_EDIT_COURSE_MISSING_FIELDS,
		fields
	};
}

export function createCourseAction(data, coursesPagesCount, indexPagination) {
	return (dispatch) => {
		return createCourseRequest(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch(push('/course/edit/' + res.data.newCourse._id)); // redirection
					toast.success(res.data.message);
					dispatch(addOrEditCourseSuccess(res.data, false, coursesPagesCount, indexPagination));
					return Promise.resolve(res);
				}
			})
			.catch((err) => {
				if (err.response.data.errorField) {
					// Missing required fields to dispay in form :
					dispatch(addOrEditMissingField(getFieldsMissing(err)));
				} else {
					// Back-end errors to dispay in notification :
					dispatch(addOrEditCourseFailure(getMessage(err)));
				}
				return Promise.reject(err);
			});
	};
}

export function updateCourseAction(data) {
	return (dispatch) => {
		return updateCourseRequest(data)
			.then((res) => {
				if (res.status === 200) {
					toast.success(res.data.message);
					dispatch(addOrEditCourseSuccess(res.data, true));
					return Promise.resolve(res);
				}
			})
			.catch((err) => {
				if (err.response.data.errorField) {
					// Missing required fields to dispay in form :
					dispatch(addOrEditMissingField(getFieldsMissing(err)));
				} else {
					// Back-end errors to dispay in notification :
					dispatch(addOrEditCourseFailure(getMessage(err)));
				}
				return Promise.reject(err);
			});
	};
}

export function emptyErrorsAction() {
	return { type: types.EMPTY_ERRORS_EDITING_COURSE };
}

/************************ Delete course ***********************/
export function deleteCourseSuccess(res, course) {
	return {
		type: types.DELETE_COURSE_SUCCESS,
		messageSuccess: res.message,
		courseId: course.courseId,
		courseTitle: course.courseTitle
	};
}

export function deleteCourseFailure(messageError) {
	return {
		type: types.DELETE_COURSE_FAILURE,
		messageError
	};
}

export function deleteCourseAction(param) {
	const { courseId, courseTitle } = param;

	if (!courseId || courseId.length < 1) return;

	return (dispatch) => {
		return deleteCourseRequest(courseId)
			.then((res) => {
				toast.success(`course '${courseTitle}' deleted`);
				if (res.status === 200) return dispatch(deleteCourseSuccess(res.data, param));
			})
			.catch((err) => {
				const messageError = getMessage(err);
				toast.error(messageError);
				dispatch(deleteCourseFailure(messageError));
			});
	};
}

/************************ Handle sort courses ***********************/
export function doSortCoursesAction(param) {
	return { type: types.DO_SORT_COURSES, param };
}

/************************ Add comment ***********************/
export function addCommentSuccess(res) {
	return {
		type: types.ADD_COMMENT_COURSE_SUCCESS,
		messageSuccess: res.message,
		commentsList: res.commentsList
	};
}

export function addCommentFailure(messageError) {
	return {
		type: types.ADD_COMMENT_COURSE_FAILURE,
		messageError
	};
}

export function addCommentMissingField(fields) {
	return {
		type: types.ADD_COMMENT_COURSE_MISSING_FIELDS,
		fields
	};
}

export function emptyErrorsCommentAction() {
	return { type: types.EMPTY_ERRORS_COMMENTING_COURSE };
}

export function addCommentAction(param) {
	if (!param.courseId || !param.uId) return;

	return (dispatch) => {
		return addCommentRequest(param)
			.then((res) => {
				if (res.status === 200) {
					toast.success(res.data.message);
					dispatch(addCommentSuccess(res.data));
					return Promise.resolve();
				}

				return Promise.reject();
			})
			.catch((err) => {
				if (err.response.data.errorField) {
					// Missing required fields to dispay in form :
					dispatch(addCommentMissingField(getFieldsMissing(err)));
				} else {
					// Back-end errors to dispay in notification :
					toast.error(getMessage(err));
					dispatch(addCommentFailure(getMessage(err)));
				}

				return Promise.reject();
			});
	};
}
