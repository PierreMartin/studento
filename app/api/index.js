import { api } from './services';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;

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

/********************************************** Users ***********************************************/
export const fetchUsersRequest = (params, store) => {
	return api().getUsers()
		.then((res) => {
			if (res.status === 200) {
				store.dispatch({type: types.GET_USERS_SUCCESS, data: res.data});
			}
		})
		.catch((err) => {
			store.dispatch({type: types.GET_USERS_FAILURE, message: getMessage(err)});
		});
};

export const fetchUserRequest = (params, store) => {
	return api().getUser(params.id)
		.then((res) => {
			if (res.status === 200) {
				store.dispatch({type: types.GET_USER_SUCCESS, data: res.data});
			}
		})
		.catch((err) => {
			store.dispatch({type: types.GET_USER_FAILURE, message: getMessage(err)});
		});
};

export const updateUserRequest = (data, id) => {
	return api().updateUser(data, id)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};