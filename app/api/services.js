import restApiClient from './../middlewares/restApiClient';
import { apiEndpoint } from './../../config/app';

export function api() {
	const localClient = restApiClient().withConfig({ baseURL: apiEndpoint });

	return {
		// Courses :
		getCoursesByField: param => localClient.request({
			method: 'POST',
			url: '/api/getcourses',
			data: param
		}),
		getCoursesBySearch: fieldSearch => localClient.request({
			method: 'POST',
			url: '/api/getcoursesbysearch',
			data: fieldSearch
		}),
		getCourseById: id => localClient.request({
			method: 'GET',
			url: '/api/getcourse/' + id
		}),
		createCourse: data => localClient.request({
			method: 'POST',
			url: '/api/addcourse',
			data
		}),
		updateCourse: data => localClient.request({
			method: 'PUT',
			url: '/api/updatecourse',
			data
		}),
		deleteCourse: courseId => localClient.request({
			method: 'DELETE',
			url: '/api/deletecourse/' + courseId
		}),
		addComment: data => localClient.request({
			method: 'POST',
			url: '/api/addcomment',
			data
		}),
		ratingCourse: data => localClient.request({
			method: 'POST',
			url: '/api/ratingcourse',
			data
		}),
		checkIfUserOwnerCourse: (userMeId, courseIdToFind) => localClient.request({
			method: 'POST',
			url: '/api/checkownercourse',
			data: { userMeId, courseIdToFind }
		}),

		// Categories
		getCategories: () => localClient.request({
			method: 'GET',
			url: '/api/getcategories'
		}),
		getCategory: (category, subcategory) => localClient.request({
			method: 'POST',
			url: '/api/getcategory',
			data: { category, subcategory }
		}),

		// Authentification
		login: data => localClient.request({
			method: 'POST',
			url: '/api/login',
			data
		}),
		signup: data => localClient.request({
			method: 'POST',
			url: '/api/signup',
			data
		}),
		logout: () => localClient.request({
			method: 'POST',
			url: '/api/logout'
		}),

		// Users
		getUsersByField: param => localClient.request({
			method: 'POST',
			url: '/api/getusers',
			data: param
		}),
		getUser: id => localClient.request({
			method: 'GET',
			url: '/api/getuser/' + id
		}),
		updateUser: (data, id) => localClient.request({
			method: 'PUT',
			url: '/api/updateuser/' + id,
			data
		}),

		// upload avatar local
		createAvatarUser: (formData, userId, avatarId) => localClient.request({
			method: 'POST',
			url: '/api/addavatar/' + userId + '/' + avatarId,
			data: formData
		}),

		// upload avatar S3:
		createAvatarS3User: (formData, userId, avatarId) => localClient.request({
			method: 'POST',
			url: '/api/addavatar-s3/' + userId + '/' + avatarId,
			data: formData
		}),

		setDefaultAvatarUser: (avatarId, idUser) => localClient.request({
			method: 'PUT',
			url: '/api/setdefaultavatar/' + idUser,
			data: { avatarId }
		}),

		// Tchat
		getChannels: userMeId => localClient.request({
			method: 'GET',
			url: '/api/getchannels/' + userMeId
		}),
		getChannelByUserFrontId: (userMeId, userFrontId) => localClient.request({
			method: 'GET',
			url: '/api/getchannelbyuserfrontid/' + userMeId + '/' + userFrontId
		}),
		createChannel: (userFrontId, userMeId) => localClient.request({
			method: 'POST',
			url: '/api/addchannel',
			data: { userFrontId, userMeId }
		}),
		getMessages: (channelId, lastMessageId) => localClient.request({
			method: 'POST',
			url: '/api/getmessages/' + channelId,
			data: lastMessageId
		}),
		getUnreadMessagesByUserId: (userId, username) => localClient.request({
			method: 'GET',
			url: '/api/getunreadmessages/' + userId + '/' + username
		}),
		setReadMessagesByChannelId: (channelId, userMeData) => localClient.request({
			method: 'PUT',
			url: '/api/setreadmessages/' + channelId,
			data: userMeData
		}),
		createMessage: newMessageData => localClient.request({
			method: 'POST',
			url: '/api/addmessage',
			data: newMessageData
		})
	};
}
