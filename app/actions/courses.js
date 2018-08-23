import * as types from './../types';
import { createCourseRequest, updateCourseRequest } from './../api';
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';

const getMessage = res => res.response && res.response.data && res.response.data.message;
const getFieldsMissing = res => res.response && res.response.data && res.response.data.errorField;

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
