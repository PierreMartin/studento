// import { } from './../api';
import * as types from 'types';

const getMessage = res => res.response && res.response.data && res.response.data.message;

/***************************************** Open / close tchat box *****************************************/
export function isBoxOpenAction(isOpen) {
	return {
		type: types.TCHATBOX_MODAL_ISOPEN_ACTION,
		isOpen
	};
}
