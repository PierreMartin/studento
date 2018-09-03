import * as types from './../types';
import { fetchCategoriesRequest } from './../api';

const getMessage = res => res.response && res.response.data && res.response.data.message;

/************************ Get categories ***********************/
export function fetchCategoriesSuccess(res) {
	return {
		type: types.GET_CATEGORIES_SUCCESS,
		messageSuccess: res.message,
		categories: res.categories
	};
}

export function fetchCategoriesFailure(messageError) {
	return {
		type: types.GET_CATEGORIES_FAILURE,
		messageError
	};
}

export function fetchCategoriesAction() {
	return (dispatch) => {
		fetchCategoriesRequest()
			.then((res) => {
				if (res.status === 200) return dispatch(fetchCategoriesSuccess(res.data));
			})
			.catch((err) => {
				dispatch(fetchCategoriesFailure(getMessage(err)));
			});
	};
}
