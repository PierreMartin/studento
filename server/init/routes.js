import passport from 'passport';
import { controllers, passport as passportConfig } from '../db';

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

  // user routes
  if (usersController) {
    app.post('/api/login', usersController.login);
    app.post('/api/signup', usersController.signUp);
    app.post('/api/logout', usersController.logout);
  } else {
    console.warn('authentification routes');
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
