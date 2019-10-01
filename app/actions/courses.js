import * as types from './../types';
import { createCourseRequest, updateCourseRequest, fetchCoursesByFieldRequest, fetchCoursesBySearchRequest, fetchCourseByFieldRequest, getNumberCoursesRequest, deleteCourseRequest, addCommentRequest, ratingCourseRequest } from './../api';
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';

const getMessage = res => res.response && res.response.data && res.response.data.message;
const getFieldsMissing = res => res.response && res.response.data && res.response.data.errorField;


/************************ Set last pagination values ***********************/
/*
export function setPaginationCoursesEditorAction(lastActivePage) {
	return {
		type: types.SET_PAGINATION_COURSES_EDITOR,
		paginationEditor: { lastActivePage }
	};
}
*/

/************************ Get courses by id or a field ***********************/
export function fetchCoursesByIdSuccess(res, paginationMethod = 'skip') {
	return {
		type: types.GET_COURSES_SUCCESS,
		messageSuccess: res.message,
		courses: res.courses,
		coursesCount: res.coursesCount,
		pagesCount: res.pagesCount,
		paginationMethod
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
				if (res.status === 200) return dispatch(fetchCoursesByIdSuccess(res.data, param.paginationMethod));
			})
			.catch((err) => {
				dispatch(fetchCoursesByIdFailure(getMessage(err)));
			});
	};
}

/************************ Get number of courses by field (for gauge) ***********************/
export function getNumberCoursesSuccess(res) {
	return {
		type: types.GET_NUMBER_COURSES_SUCCESS,
		numberCourses: res.numberCourses
	};
}

export function getNumberCoursesFailure(messageError) {
	return {
		type: types.GET_NUMBER_COURSES_FAILURE,
		messageError
	};
}

function getNumberCoursesReq(dispatch, param) {
	getNumberCoursesRequest(param)
		.then((res) => {
			if (res.status === 200) dispatch(getNumberCoursesSuccess(res.data));
		})
		.catch((err) => {
			dispatch(getNumberCoursesFailure(getMessage(err)));
		});
}

export function getNumberCoursesAction(param) {
	if (!param.keyReq || !param.valueReq) return;

	return (dispatch) => {
		getNumberCoursesReq(dispatch, param);
	};
}

/************************ Get courses by search ***********************/
export function fetchCoursesBySearchAction(typing, query, activePage) {
	return (dispatch) => {
		if (typeof typing === 'undefined') return;

		// When the user delete the search after typing in input:
		if (typing.trim() === '') {
			const noKeyReq = typeof query.keyReq === 'undefined'; // keyReq always undefined from home page
			const customQuery = noKeyReq ? { keyReq: 'all', valueReq: 'all' } : query;

			return fetchCoursesByFieldRequest(customQuery, { dispatch })
				.then((resCoursesByField) => {
					if (resCoursesByField.status === 200) return dispatch(fetchCoursesByIdSuccess(resCoursesByField.data));
				})
				.catch((err) => {
				return dispatch(fetchCoursesByIdFailure(getMessage(err)));
			});
		}

		fetchCoursesBySearchRequest(typing, query, activePage)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchCoursesByIdSuccess(res.data));
			})
			.catch((err) => {
				dispatch(fetchCoursesByIdFailure(getMessage(err)));
			});
	};
}

/************************ Get course by id or a field ***********************/
export function fetchCourseByFieldSuccess(res) {
	return {
		type: types.GET_COURSE_SUCCESS,
		messageSuccess: res.message,
		course: res.course
	};
}

export function fetchCourseByFieldFailure(messageError) {
	return {
		type: types.GET_COURSE_FAILURE,
		messageError
	};
}

export function fetchCourseByFieldAction(param) {
	if (!param.keyReq || !param.valueReq) return Promise.reject({});

	return (dispatch) => {
		return fetchCourseByFieldRequest(param)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchCourseByFieldSuccess(res.data));
			})
			.catch((err) => {
				return dispatch(fetchCourseByFieldFailure(getMessage(err)));
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
					const pathCourseToEdit = res.data.newCourse.type !== 'wy' ? `/courseMd/edit/${res.data.newCourse._id}` : `/course/edit/${res.data.newCourse._id}`;
					dispatch(push(pathCourseToEdit)); // redirection
					toast.success(res.data.message);
					dispatch(addOrEditCourseSuccess(res.data, false, coursesPagesCount, indexPagination));

					// Request for re-get the number of courses for the gauge:
					getNumberCoursesReq(dispatch, { keyReq: 'uId', valueReq: data.userMeId });
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

					// Request for re-get the number of courses for the gauge:
					getNumberCoursesReq(dispatch, { keyReq: 'uId', valueReq: data.userMeId });
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
	const { courseId, courseTitle, userMeId } = param;

	if (!courseId || courseId.length < 1) return;

	return (dispatch) => {
		return deleteCourseRequest(courseId)
			.then((res) => {
				toast.success(`course '${courseTitle}' deleted`);
				if (res.status === 200) {
					// Request for re-get the number of courses for the gauge:
					if (userMeId) { getNumberCoursesReq(dispatch, { keyReq: 'uId', valueReq: userMeId }); }

					return dispatch(deleteCourseSuccess(res.data, param));
				}
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

/************************ Rating course ***********************/
export function ratingCourseSuccess(res) {
	return {
		type: types.RATING_COURSE_SUCCESS,
		messageSuccess: res.message,
		stars: res.stars,
		courseId: res.courseId
	};
}

export function ratingCourseFailure(messageError) {
	return {
		type: types.RATING_COURSE_FAILURE,
		messageError
	};
}

export function ratingCourseAction(data) {
	const { rating, uId, courseId } = data;

	if (typeof rating === 'undefined' || !uId || !courseId) return;

	return (dispatch) => {
		return ratingCourseRequest(data)
			.then((res) => {
				toast.success(res.data.message);
				if (res.status === 200) return dispatch(ratingCourseSuccess(res.data));
			})
			.catch((err) => {
				const messageError = getMessage(err);
				toast.error(messageError);
				dispatch(ratingCourseFailure(messageError));
			});
	};
}
