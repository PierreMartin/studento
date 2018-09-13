import { fetchUserRequest, fetchCoursesByFieldRequest } from './../api';
import { fetchCoursesByIdSuccess } from './courses';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;


/***************************************** Get User ********************************************/
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
