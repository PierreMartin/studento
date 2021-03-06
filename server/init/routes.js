import passport from 'passport';
import { controllers } from '../db';

const authController = controllers && controllers.auth;
const usersController = controllers && controllers.users;
const coursesController = controllers && controllers.courses;
const categoriesController = controllers && controllers.categories;
const channelsController = controllers && controllers.channels;
const messagesController = controllers && controllers.messages;

export default (app) => {
	// courses routes
	if (coursesController) {
		app.post('/api/getcourses', coursesController.allByField);
		app.post('/api/getcoursesbysearch', coursesController.allBySearch);
		app.post('/api/getcourse', coursesController.oneByField);
		app.post('/api/getnumbercourses', coursesController.countByField);
		app.post('/api/addcourse', coursesController.add);
		app.put('/api/updatecourse', coursesController.update);
		app.delete('/api/deletecourse/:courseid', coursesController.deleteOne);
		app.post('/api/addcomment', coursesController.addComment);
		app.post('/api/ratingcourse', coursesController.ratingCourse);
		app.post('/api/checkownercourse', coursesController.checkOwnerCourse);
	} else {
		console.warn('courses routes');
	}

	// categories routes
	if (categoriesController) {
		app.get('/api/getcategories', categoriesController.all);
		app.post('/api/getcategory', categoriesController.one);
	} else {
		console.warn('categories routes');
	}

  // authentification routes
  if (authController) {
		// Local auth:
    app.post('/api/login', authController.login);
    app.post('/api/signup', authController.signUp);

    // Facebook auth:
		app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
		app.get('/auth/facebook/callback', authController.facebookLogin);

    app.post('/api/logout', authController.logout);
  } else {
    console.warn('authentification routes');
  }

	// users routes
	if (usersController) {
		app.post('/api/getusers', usersController.all);
		app.get('/api/getuser/:id', usersController.oneById);
		app.put('/api/updateuser/:id', usersController.update);
		app.delete('/api/deleteuseraccount', usersController.deleteById);

		// avatars Local:
		app.post('/api/addavatar/:userId/:avatarId', usersController.uploadAvatarMulter, usersController.uploadAvatar);

		// avatars S3:
		app.post('/api/addavatar-s3/:userId/:avatarId', usersController.uploadAvatarMulterS3, usersController.uploadAvatarS3);

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
