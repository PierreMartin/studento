import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../../db/models/user';

export default (passport) => {
	const facebookCb = (accessToken, refreshToken, profile, done) => {
		// 'profile' contain user profile information provided by Facebook
		console.log('profile ', profile);

		let photo;
		if (profile.photos && profile.photos[0] && profile.photos[0].value) {
			photo = profile.photos[0].value;
		}

		console.log(photo);

		// { 'facebook.id': profile.id }
		User.findOne({ 'facebook.id': profile.id }, (findErr, findUser) => {
			console.log('findErr ', findErr);
			console.log('findUser ', findUser);

			if (findErr) { return done(findErr); }
			// No user was found: create a new user with values from Facebook
			return;
			if (!findUser) {
				const user = new User({
					firstName: profile.displayName,
					// username: profile.username,
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
			passReqToCallback: true,
			profileFields: ['id', 'name', 'displayName', 'picture.type(large)', 'about_me']
		},
		facebookCb
	));
};
