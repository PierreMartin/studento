/***************************************** Messages ********************************************/
export const DISMISS_MESSAGE = 'DISMISS_MESSAGE';

/***************************************** Courses ********************************************/
// Create
export const TYPING_CREATE_COURSE_ACTION = 'TYPING_CREATE_COURSE_ACTION';
export const CREATE_COURSE_SUCCESS = 'CREATE_COURSE_SUCCESS';
export const CREATE_COURSE_FAILURE = 'CREATE_COURSE_FAILURE';
export const CREATE_COURSE_DUPLICATE = 'CREATE_COURSE_DUPLICATE';

// Get all
export const GET_COURSES_SUCCESS = 'GET_COURSES_SUCCESS';
export const GET_COURSES_FAILURE = 'GET_COURSES_FAILURE';

// Get one
export const GET_COURSE_SUCCESS = 'GET_COURSE_SUCCESS';
export const GET_COURSE_FAILURE = 'GET_COURSE_FAILURE';

// Delete
export const DESTROY_COURSE_SUCCESS = 'DESTROY_COURSE_SUCCESS';
export const DESTROY_COURSE_FAILURE = 'DESTROY_COURSE_FAILURE';

// Voting Course
export const RATING_COURSE_SUCCESS = 'RATING_COURSE_SUCCESS';
export const RATING_COURSE_FAILURE = 'RATING_COURSE_FAILURE';

/***************************************** Authentification ********************************************/
export const LOGIN_BEGIN_USER = 'LOGIN_BEGIN_USER';
export const SIGNUP_BEGIN_USER = 'SIGNUP_BEGIN_USER';
export const LOGOUT_BEGIN_USER = 'LOGOUT_BEGIN_USER';

export const TYPING_LOGIN_SIGNUP_ACTION = 'TYPING_LOGIN_SIGNUP_ACTION';

export const LOGIN_SUCCESS_USER = 'LOGIN_SUCCESS_USER';
export const SIGNUP_SUCCESS_USER = 'SIGNUP_SUCCESS_USER';
export const LOGOUT_SUCCESS_USER = 'LOGOUT_SUCCESS_USER';

export const LOGIN_ERROR_USER = 'LOGIN_ERROR_USER';
export const SIGNUP_ERROR_USER = 'SIGNUP_ERROR_USER';
export const LOGOUT_ERROR_USER = 'LOGOUT_ERROR_USER';

// DISPLAYING MISSING FIELDS :
export const LOGIN_SIGNUP_MISSING_REQUIRED_FIELDS = 'LOGIN_SIGNUP_MISSING_REQUIRED_FIELDS';

/***************************************** Users ********************************************/
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';

export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

// UPDATE
export const TYPING_UPDATE_USER_ACTION = 'TYPING_UPDATE_USER_ACTION';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

// DISPLAYING MISSING FIELDS :
export const UPDATE_USER_MISSING_REQUIRED_FIELDS = 'UPDATE_USER_MISSING_REQUIRED_FIELDS';

// AVATARS REQUEST :
export const UPDATE_USER_AVATAR_SUCCESS = 'UPDATE_USER_AVATAR_SUCCESS';
export const UPDATE_USER_AVATAR_FAILURE = 'UPDATE_USER_AVATAR_FAILURE';

// AVATAR SET DEFAULT :
export const SET_MAIN_USER_AVATAR_SUCCESS = 'SET_MAIN_USER_AVATAR_SUCCESS';
export const SET_MAIN_USER_AVATAR_FAILURE = 'SET_MAIN_USER_AVATAR_FAILURE';

/***************************************** Tchat ********************************************/
export const ADD_TCHATBOX = 'ADD_TCHATBOX';
export const REMOVE_TCHATBOX = 'REMOVE_TCHATBOX';

export const RECEIVE_SOCKET = 'RECEIVE_SOCKET';

export const GET_CHANNELS_TCHAT_SUCCESS = 'GET_CHANNELS_TCHAT_SUCCESS';
export const GET_CHANNELS_TCHAT_FAILURE = 'GET_CHANNELS_TCHAT_FAILURE';

export const CREATE_NEW_CHANNEL_SUCCESS = 'CREATE_NEW_CHANNEL_SUCCESS';
export const CREATE_NEW_CHANNEL_FAILURE = 'CREATE_NEW_CHANNEL_FAILURE';

export const GET_MESSAGES_TCHAT_SUCCESS = 'GET_MESSAGES_TCHAT_SUCCESS';
export const GET_MESSAGE_TCHAT_FAILURE = 'GET_MESSAGE_TCHAT_FAILURE';

export const GET_NB_UNREAD_MESSAGES_TCHAT_SUCCESS = 'GET_NB_UNREAD_MESSAGES_TCHAT_SUCCESS';
export const GET_NB_UNREAD_MESSAGE_TCHAT_FAILURE = 'GET_NB_UNREAD_MESSAGE_TCHAT_FAILURE';

export const SET_READ_MESSAGES_TCHAT_SUCCESS = 'SET_READ_MESSAGES_TCHAT_SUCCESS';
export const SET_READ_MESSAGE_TCHAT_FAILURE = 'SET_READ_MESSAGE_TCHAT_FAILURE';

export const CREATE_NEW_MESSAGE_TCHAT_SUCCESS = 'CREATE_NEW_MESSAGE_TCHAT_SUCCESS';
export const CREATE_NEW_MESSAGE_TCHAT_FAILURE = 'CREATE_NEW_MESSAGE_TCHAT_FAILURE';

export const SEND_NEW_MESSAGE = 'SEND_NEW_MESSAGE';
