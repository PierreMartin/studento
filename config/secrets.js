/** Don't commit this file!! **/

export const sessionSecret = process.env.SESSION_SECRET || 'Your Session Secret goes here';

export const google = {
  clientID: process.env.GOOGLE_CLIENTID || '62351010161-eqcnoa340ki5ekb9gvids4ksgqt9hf48.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_SECRET || '6cKCWD75gHgzCvM4VQyR5_TU',
  callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback'
};

export const facebook = {
	clientID: process.env.FACEBOOK_CLIENTID || '435286900503355',
	clientSecret: process.env.FACEBOOK_SECRET || '3b786fb4df4e1c49cbb4f41478742f24',
	callbackURL: process.env.FACEBOOK_CALLBACK || 'http://localhost:3000/auth/facebook/callback'
};
