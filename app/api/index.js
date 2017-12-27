import { api } from './services';
import * as types from 'types';

/********************************************** Courses ***********************************************/
export const fetchCoursesRequest = (params, store) => {
	return api().getCourses()
		.then((res) => {
			if (res.status === 200) {
				store.dispatch({type: types.GET_COURSES_SUCCESS, data: res.data});
			}
		})
		.catch((err) => {
			store.dispatch({type: types.GET_COURSES_FAILURE, message: err.message });
		});
};

export const fetchCourseRequest = (params, store) => {
	return api().getCourseById(params.id)
		.then((res) => {
			if (res.status === 200) {
				store.dispatch({type: types.GET_COURSE_SUCCESS, data: res.data});
			}
		})
		.catch((err) => {
			store.dispatch({type: types.GET_COURSE_FAILURE, message: err.message});
		});
};

export const createCourseRequest = (data) => {
	return api().createCourse(data)
		.then((res) => {
			if (res.status === 200) return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

/********************************************** Authentification ***********************************************/
export const loginRequest = (data) => {
	return api().login(data)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const signupRequest = (data) => {
	return api().signup(data)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const logoutRequest = () => {
	return api().logout()
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};
