import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../../db/models/user';

export default (passport) => {
	const facebookCb = (req, accessToken, refreshToken, profile, done) => {
		// 'profile' contain user profile information provided by Facebook

		User.findOne({ 'facebook.id': profile.id }, (findErr, findUser) => {
			console.log('1 ===> findErr ', findErr);
			console.log('1 ===> findUser ', findUser);
			if (findErr) { return done(findErr); }

			// No user was found: create a new user with values from Facebook
			if (!findUser) {
				const userObj = {
					provider: 'facebook',
					facebook: profile._json,
					username: '',
					avatarsSrc: [],
					avatarMainSrc: {
						avatarId: -1,
						avatar150: '',
						avatar80: '',
						avatar28: ''
					}
				};

				if (profile.emails && profile.emails[0] && profile.emails[0].value) {
					// userObj.email = `${profile.emails[0].value}`;
				}
				if (profile._json && profile.displayName) {
					userObj.username = profile.displayName;
				}
				if (profile.name && profile.name.givenName) {
					userObj.firstName = profile.name.givenName;
				}
				if (profile.name && profile.name.familyName) {
					userObj.lastName = profile.name.familyName;
				}
				if (profile && profile.photos && profile.photos[0] && profile.photos[0].value) {
					userObj.avatarsSrc.push({
						avatarId: 0,
						avatar150: profile.photos[0].value,
						avatar80: profile.photos[0].value,
						avatar28: profile.photos[0].value,
						provider: 'facebook'
					});

					userObj.avatarMainSrc.avatarId = 0;
					userObj.avatarMainSrc.avatar150 = profile.photos[0].value;
					userObj.avatarMainSrc.avatar80 = profile.photos[0].value;
					userObj.avatarMainSrc.avatar28 = profile.photos[0].value;
					userObj.avatarMainSrc.provider = 'facebook';
				}

				userObj.username += `-${Math.ceil(Math.random() * 100000)}`;
				console.log('1 === userObj ', userObj);

				const user = new User(userObj);
				user.save((err) => {
					console.log('2 record db err', err);
					console.log('2 record db user', user);
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
			profileFields: ['id', 'emails', 'name', 'displayName', 'picture.type(large)']
		},
		facebookCb
	));
};
