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

// Avatar
export const createAvatarUserRequest = (formData, _id, avatarId) => {
	return api().createAvatarUser(formData, _id, avatarId)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const defaultAvatarUserRequest = (avatarId, idUser) => {
	return api().setDefaultAvatarUser(avatarId, idUser)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

/********************************************** Tchat ***********************************************/
export const getChannelsByUserIdRequest = (userMeId) => {
	return api().getChannels(userMeId)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const getChannelByUserFrontIdRequest = (userMeId, userFrontId) => {
	return api().getChannelByUserFrontId(userMeId, userFrontId)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const createNewChannelRequest = (userFrontId, userMeId) => {
	return api().createChannel(userFrontId, userMeId)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const fetchMessagesRequest = (channelId, page) => {
	return api().getMessages(channelId, page)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const fetchUnreadMessagesRequest = (userId, username) => {
	return api().getUnreadMessagesByUserId(userId, username)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const setReadMessagesRequest = (channelId, userMeData) => {
	return api().setReadMessagesByChannelId(channelId, userMeData)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const createNewMessageRequest = (newMessageData) => {
	return api().createMessage(newMessageData)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};
