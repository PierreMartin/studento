import { Strategy as FacebookStrategy } from 'passport-facebook';
import { facebook } from '../../../config/secrets';
import User from '../../db/models/user';

export default (passport) => {
	const facebookCb = (accessToken, refreshToken, profile, done) => {
		// 'profile' contain user profile information provided by Facebook

		// { 'facebook.id': profile.id }
		User.findOne({ email: profile.emails[0].value }, (findErr, findUser) => {
			if (findErr) { return done(findErr); }
			// No user was found: create a new user with values from Facebook
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
			clientID: facebook.clientID,
			clientSecret: facebook.clientSecret,
			callbackURL: facebook.callbackURL
		},
		facebookCb
	));
};
