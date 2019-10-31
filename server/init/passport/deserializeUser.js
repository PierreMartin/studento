import User from '../../db/models/user';

export default (id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
};
