import { api } from './services';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;


/********************************************** Courses ***********************************************/
// All by id or by field
export const fetchCoursesByFieldRequest = (param) => {
	return api().getCoursesByField(param)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

// All by search
export const fetchCoursesBySearchRequest = (typing, query, activePage) => {
	return api().getCoursesBySearch(typing, query, activePage)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

// One by id or by field - FROM ACTIONS
export const fetchCourseByFieldRequest = (params) => {
	// create:
	if (params && params.action === 'create') return Promise.resolve({});

	// edit or view:
	if (params && (params.action === 'edit' || typeof params.action === 'undefined')) {
		return api().getCourseByField(params)
			.then((res) => {
				if (res.status === 200) return Promise.resolve(res);
			})
			.catch((err) => {
				return Promise.reject(err);
			});
	}
};

// One by id or by field - FROM ROUTINGS    (NOTES ==> allows to do setState() in componentDidMount() and to have Class Components nested)
export const fetchCourseRequest = (params, store) => {
	// create:
	if (params && params.action === 'create') {
		store.dispatch({type: types.EMPTY_COURSE});
		return Promise.resolve({});
	}

	// edit or view:
	if (params && (params.action === 'edit' || typeof params.action === 'undefined')) {
		return api().getCourseByField({ keyReq: '_id', valueReq: params.id, action: params.action })
			.then((res) => {
				if (res.status === 200) {
					store.dispatch({type: types.GET_COURSE_SUCCESS, course: res.data.course});
				}
			})
			.catch((err) => {
				store.dispatch({type: types.GET_COURSE_FAILURE, message: getMessage(err)});
			});
	}
};

// All number courses by id or by field
export const getNumberCoursesRequest = (params) => {
	return api().getNumberCourses(params)
		.then((res) => {
			if (res.status === 200) return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
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

export const updateCourseRequest = (data) => {
	return api().updateCourse(data)
		.then((res) => {
			if (res.status === 200) return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const deleteCourseRequest = (courseId) => {
	return api().deleteCourse(courseId)
		.then((res) => {
			if (res.status === 200) return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const addCommentRequest = (data) => {
	return api().addComment(data)
		.then((res) => {
			if (res.status === 200) return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const ratingCourseRequest = (data) => {
	return api().ratingCourse(data)
		.then((res) => {
			if (res.status === 200) return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

export const checkIfUserOwnerCourseRequest = (userMeId, courseIdToFind) => {
	return api().checkIfUserOwnerCourse(userMeId, courseIdToFind)
		.then((res) => {
			if (res.status === 200) return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

/********************************************** Categories ***********************************************/
// All
export const fetchCategoriesRequest = () => {
	return api().getCategories()
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

// One
export const fetchCategoryRequest = (category, subcategory) => {
	return api().getCategory(category, subcategory)
		.then((res) => {
			return Promise.resolve(res);
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
// All by id or by field
export const fetchUsersByFieldRequest = (param) => {
	return api().getUsersByField(param)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

// One by id
export const fetchUserRequest = (userFrontId) => {
	return api().getUser(userFrontId)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
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

// Avatar Local
export const createAvatarUserRequest = (formData, userId, avatarId) => {
	return api().createAvatarUser(formData, userId, avatarId)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

// Avatar S3
export const createAvatarS3UserRequest = (formData, userId, avatarId) => {
	return api().createAvatarS3User(formData, userId, avatarId)
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

// Delete user account
export const deleteUserAccountRequest = (userMeId, password) => {
	return api().deleteUserAccount(userMeId, password)
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

export const fetchMessagesRequest = (channelId, lastMessageId) => {
	return api().getMessages(channelId, lastMessageId)
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
