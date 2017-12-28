import User from '../models/user';

export function all(req, res) {
	User.find({}).exec((err, users) => {
		if (err) {
			return res.status(500).send({message: 'Something went wrong getting the data'});
		}

		return res.status(200).json(users);
	});
}

export default {
	all
};
