import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../db/models/user';

/*
 Configuring local strategy to authenticate strategies
 Code modified from : https://github.com/madhums/node-express-mongoose-demo/blob/master/config/passport/local.js
*/
export default (passport) => {
  const localCb = (email, password, done) => {
    User.findOne({ email }, (findErr, user) => {
      if (!user) return done(null, false, { message: `There is no user of the email ${email}.` });
      return user.comparePassword(password, (passErr, isMatch) => {
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: 'Your email or password combination is not correct.' });
      });
    });
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, localCb));
};
