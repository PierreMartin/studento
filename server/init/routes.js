import passport from 'passport';
import { controllers, passport as passportConfig } from '../db';

const authController = controllers && controllers.auth;
const usersController = controllers && controllers.users;
const coursesController = controllers && controllers.courses;

export default (app) => {
	// courses routes
	if (coursesController) {
		app.get('/api/getcourses', coursesController.all);
		app.post('/api/addcourse/:id', coursesController.add);
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
	} else {
		console.warn('users routes');
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
