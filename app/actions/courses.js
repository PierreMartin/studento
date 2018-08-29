import * as types from './../types';
import { createCourseRequest, updateCourseRequest, fetchCoursesByIdRequest, deleteCourseRequest } from './../api';
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';

const getMessage = res => res.response && res.response.data && res.response.data.message;
const getFieldsMissing = res => res.response && res.response.data && res.response.data.errorField;

/************************ Get courses by id ***********************/
export function fetchCoursesByIdSuccess(res) {
	return {
		type: types.GET_COURSES_SUCCESS,
		messageSuccess: res.message,
		courses: res.courses
	};
}

export function fetchCoursesByIdFailure(messageError) {
	return {
		type: types.GET_COURSES_FAILURE,
		messageError
	};
}

export function fetchCoursesByIdAction(data) {
	return (dispatch) => {
		fetchCoursesByIdRequest(data)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchCoursesByIdSuccess(res.data));
			})
			.catch((err) => {
				dispatch(fetchCoursesByIdFailure(getMessage(err)));
			});
	};
}

/************************ Create or edit course ***********************/
export function addOrEditCourseSuccess(res) {
	return {
		type: types.CREATE_OR_EDIT_COURSE_SUCCESS,
		messageSuccess: res.message,
		course: res.newCourse
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

export function createCourseAction(data) {
	return (dispatch) => {
		createCourseRequest(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch(push('/course/edit/' + res.data.newCourse._id)); // redirection
					toast.success(res.data.message);
					return dispatch(addOrEditCourseSuccess(res.data));
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
			});
	};
}

export function updateCourseAction(data) {
	return (dispatch) => {
		updateCourseRequest(data)
			.then((res) => {
				if (res.status === 200) {
					toast.success(res.data.message);
					return dispatch(addOrEditCourseSuccess(res.data));
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
			});
	};
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
				if (res.status === 200) return dispatch(deleteCourseSuccess(res.data, { courseId, courseTitle }));
			})
			.catch((err) => {
				const messageError = getMessage(err);
				toast.error(messageError);
				dispatch(deleteCourseFailure(messageError));
			});
	};
}
