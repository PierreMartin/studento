import passport from 'passport';
import { controllers, passport as passportConfig } from '../db';

const authController = controllers && controllers.auth;
const usersController = controllers && controllers.users;
const coursesController = controllers && controllers.courses;
const channelsController = controllers && controllers.channels;
const messagesController = controllers && controllers.messages;

export default (app) => {
	// courses routes
	if (coursesController) {
		app.get('/api/getcourses', coursesController.all);
		app.get('/api/getcourses/:id', coursesController.allById);
		app.get('/api/getcourse/:id', coursesController.oneById);
		app.post('/api/addcourse', coursesController.add);
		app.put('/api/updatecourse', coursesController.update);
	} else {
		console.warn('courses routes');
	}

  // authentification routes
  if (authController) {
    app.post('/api/login', authController.login);
    app.post('/api/signup', authController.signUp);
    app.post('/api/logout', authController.logout);
  } else {
    console.warn('authentification routes');
  }

	// users routes
	if (usersController) {
		app.get('/api/getusers', usersController.all);
		app.get('/api/getuser/:id', usersController.oneById);
		app.put('/api/updateuser/:id', usersController.update);
		app.post('/api/addavatar/:id/:avatarId', usersController.uploadAvatarMulter, usersController.uploadAvatar);
		app.put('/api/setdefaultavatar/:idUser/', usersController.setDefaultAvatar);
	} else {
		console.warn('users routes');
	}

	// channels tchat routes
	if (channelsController) {
		app.get('/api/getchannels/:usermeid', channelsController.allByUserId); // By userMe
		app.get('/api/getchannelbyuserfrontid/:usermeid/:userfrontid', channelsController.allByUserFrontId); // By userFront
		app.post('/api/addchannel', channelsController.add);
	} else {
		console.warn('channels tchat routes');
	}

	// messages tchat routes
	if (messagesController) {
		app.post('/api/getmessages/:channelid', messagesController.allByChannelId);
		app.get('/api/getunreadmessages/:userid/:username', messagesController.allUnreadByUserId);
		app.put('/api/setreadmessages/:channelid', messagesController.setReadMessages);
		app.post('/api/addmessage', messagesController.add);
	} else {
		console.warn('messages tchat routes');
	}

  /*
  if (passportConfig && passportConfig.google) {
    app.get('/auth/google', passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }));

    app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
      })
    );
  }
  */
};
