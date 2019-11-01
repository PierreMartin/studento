import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../db/models/user';

export default (passport) => {
  const localCb = (email, password, done) => {
    User.findOne({ email }, (findErr, user) => {
			if (findErr) { return done(findErr); }
      if (!user) { return done(null, false, { message: `There is no user with the email ${email}.` }); }

      return user.comparePassword(password, (passErr, isMatch) => {
        if (isMatch) { return done(null, user); }
        return done(null, false, { message: 'Your email or password combination is not correct.' });
      });
    });
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, localCb));
};
