import restApiClient from './../middlewares/restApiClient';

export function api() {
	const localClient = restApiClient().withConfig({ baseURL: 'http://localhost:3000' });

	return {
		// Courses :
		getCourses: () => localClient.request({
			method: 'GET',
			url: '/api/getcourses'
		}),
		getCourseById: id => localClient.request({
			method: 'GET',
			url: '/api/getcourse/' + id
		}),
		createCourse: data => localClient.request({
			method: 'POST',
			url: '/api/addcourse/' + data.id,
			data
		}),
		deleteCourse: id => localClient.request({
			method: 'DELETE',
			url: '/api/course/' + id
		}),
		updateCourse: (id, data) => localClient.request({
			method: 'PUT',
			url: '/api/course/' + id,
			data
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
		getUsers: () => localClient.request({
			method: 'GET',
			url: '/api/getusers'
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
		createAvatarUser: (data, id, avatarId) => localClient.request({
			method: 'POST',
			url: '/api/addavatar/' + id + '/' + avatarId,
			data
		})
	};
}
