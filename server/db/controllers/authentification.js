import passport from 'passport';
import User from '../models/user';

/**
 * POST /api/login
 */
export function login(req, res, next) {
	const data = req.body;
	const errorField = {};

	// handling required fields :
	errorField.email = typeof data.email === 'undefined' || data.email === '';
	errorField.password = typeof data.password === 'undefined' || data.password === '';

	// displaying required fields :
	if (errorField.email || errorField.password) {
		return res.status(400).json({errorField});
	}

	// AuthPassport: 'local' define in server/init/passport/local.js
  passport.authenticate('local', (authErr, user, info) => {
    if (authErr) { return next(authErr); }

		// unauthorized error (if wrong password or wrong login) :
		if (!user) {
			return res.status(401).json({ message: info.message });
		}

		// Establish a session:
    return req.logIn(user, (loginErr) => {
			if (loginErr) { return res.status(401).json({ message: loginErr }); }

			return res.status(200).json({ message: 'You\'re now logged.', userObj: user });
    });
  })(req, res, next);
}

/**
 * GET /auth/facebook/callback
 */
export function facebookLogin(req, res, next) {
	// AuthPassport: 'facebook' define in server/init/passport/facebook.js
	passport.authenticate('facebook', (authErr, user) => {
		debugger;
		if (authErr) { return next(authErr); }
		if (!user) { return res.status(401).json({ message: 'A error happen' }); }

		// Establish a session:
		return req.logIn(user, (loginErr) => {
			if (loginErr) { return res.status(401).json({ message: loginErr }); }

			return res.status(200).json({ message: 'You\'re now logged.', userObj: user });
		});
	})(req, res, next);
}

/**
 * POST /api/signup
 */
export function signUp(req, res, next) {
	const data = req.body;
	const errorField = {};

	// handling required fields :
	errorField.username = typeof data.username === 'undefined' || data.username === '';
	errorField.email = typeof data.email === 'undefined' || data.email === '';
	errorField.password = typeof data.password === 'undefined' || data.password === '';

	// displaying required fields :
	if (errorField.email || errorField.password || errorField.username) {
		return res.status(400).json({errorField});
	}


  const user = new User(data);

  User.findOne({ email: data.email }, (findErr, existingUser) => {
		// conflict errors :
    if (existingUser) {
			return res.status(409).json({message: 'Count already exist!'});
    }

		// create count :
    return user.save((saveErr) => {
      if (saveErr) return next(saveErr);

			// Establish a session :
      return req.logIn(user, (loginErr) => {
				if (loginErr) return res.status(401).json({message: loginErr});

				return res.status(200).json({message: 'You\'re now logged.', userObj: user});
      });
    });
  });
}

/**
 * POST /api/logout
 */
export function logout(req, res) {
	req.logout();
	res.redirect('/');
}

export default {
  login,
	facebookLogin,
  logout,
  signUp
};
