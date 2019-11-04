import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../../db/models/user';

export default (passport) => {
	const facebookCb = (accessToken, refreshToken, profile, done) => {
		// 'profile' contain user profile information provided by Facebook
		console.log('profile ', profile);
		console.log('emails ', profile.emails[0].value);

		// { 'facebook.id': profile.id }
		User.findOne({ email: profile.emails[0].value }, (findErr, findUser) => {
			console.log('findErr ', findErr);
			console.log('findUser ', findUser);

			if (findErr) { return done(findErr); }
			// No user was found: create a new user with values from Facebook
			return;
			if (!findUser) {
				const user = new User({
					firstName: profile.displayName,
					email: profile.emails[0].value,
					username: profile.username,
					provider: 'facebook',
					facebook: profile._json
				});
				user.save((err) => {
					if (err) { console.log(err); }
					return done(null, user);
				});
			} else {
				return done(null, findUser);
			}
		});
	};

	passport.use(new FacebookStrategy({
			clientID: process.env.FACEBOOK_CLIENTID,
			clientSecret: process.env.FACEBOOK_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK,
			profileFields: ['id', 'username', 'displayName', 'profileUrl', 'email']
		},
		facebookCb
	));
};
