import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import User from '../../db/models/user';

/* eslint-disable no-param-reassign */
export default (passport) => {
  const googleCb = () => (req, accessToken, refreshToken, profile, done) => {
		if (req.user) {
			return User.findOne({ google: profile.id }, (findOneErr, existingUser) => {
				if (existingUser) {
					return done(null, false, { message: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
				}
				return User.findById(req.user.id, (findByIdErr, user) => {
					user.google = profile.id;
					user.tokens.push({ kind: 'google', accessToken });
					user.profile.name = user.profile.name || profile.displayName;
					user.profile.gender = user.profile.gender || profile._json.gender;
					user.profile.picture = user.profile.picture || profile._json.picture;
					user.save((err) => {
						done(err, user, { message: 'Google account has been linked.' });
					});
				});
			});
		}
		return User.findOne({ google: profile.id }, (findByGoogleIdErr, existingUser) => {
			if (existingUser) return done(null, existingUser);
			return User.findOne({ email: profile._json.emails[0].value }, (findByEmailErr, existingEmailUser) => {
				if (existingEmailUser) {
					return done(null, false, { message: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
				}
				const user = new User();
				user.email = profile._json.emails[0].value;
				user.google = profile.id;
				user.tokens.push({ kind: 'google', accessToken });
				user.profile.name = profile.displayName;
				user.profile.gender = profile._json.gender;
				user.profile.picture = profile._json.picture;
				return user.save((err) => {
					done(err, user);
				});
			});
		});
	};
	/* eslint-enable no-param-reassign */

  /*
  * OAuth Strategy taken modified from https://github.com/sahat/hackathon-starter/blob/master/config/passport.js
  *
  * - User is already logged in.
  *   - Check if there is an existing account with a provider id.
  *     - If there is, return an error message. (Account merging not supported)
  *     - Else link new OAuth account with currently logged-in user.
  * - User is not logged in.
  *   - Check if it's a returning user.
  *     - If returning user, sign in and we are done.
  *     - Else check if there is an existing account with user's email.
  *       - If there is, return an error message.
  *       - Else create a new account.
  *
  * The Google OAuth 2.0 authentication strategy authenticates
  * users using a Google account and OAuth 2.0 tokens.
  * The strategy requires a verify callback, which accepts these
  * credentials and calls done providing a user, as well
  * as options specifying a client ID, client secret, and callback URL.
  */
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true
  }, googleCb));
};
