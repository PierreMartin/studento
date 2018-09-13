import { fetchUserRequest, fetchUsersByFieldRequest, fetchCoursesByFieldRequest } from './../api';
import { fetchCoursesByIdSuccess } from './courses';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;

/************************ Get courses by id or a field ***********************/
export function fetchUsersByFieldSuccess(res) {
	return {
		type: types.GET_USERS_SUCCESS,
		messageSuccess: res.message,
		users: res.users,
		pagesCount: res.pagesCount
	};
}

export function fetchUsersByFieldFailure(messageError) {
	return {
		type: types.GET_USERS_FAILURE,
		messageError
	};
}

export function fetchUsersByFieldAction(param) {
	if (!param.keyReq || !param.valueReq) return;

	return (dispatch) => {
		fetchUsersByFieldRequest(param)
			.then((res) => {
				if (res.status === 200) return dispatch(fetchUsersByFieldSuccess(res.data));
			})
			.catch((err) => {
				dispatch(fetchUsersByFieldFailure(getMessage(err)));
			});
	};
}

/***************************************** Get User by id ********************************************/
export function fetchUserSuccess(res) {
	return {
		type: types.GET_USER_SUCCESS,
		messageSuccess: res.message,
		user: res.user
	};
}

export function fetchUserFailure(messageError) {
	return {
		type: types.GET_USER_FAILURE,
		messageError
	};
}

export function fetchUserAction(userFrontId) {
	return (dispatch) => {
		fetchUserRequest(userFrontId)
			.then((resUser) => {
				if (resUser.status === 200) {
					dispatch(fetchUserSuccess(resUser.data));
					return fetchCoursesByFieldRequest({ keyReq: 'uId', valueReq: userFrontId });
				}
			})
			.catch((err) => {
				return dispatch(fetchUserFailure(getMessage(err)));
			})
			.then((resCourses) => {
				if (resCourses.data) return dispatch(fetchCoursesByIdSuccess(resCourses.data));
			});
	};
}
