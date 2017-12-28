import User from '../models/user';

/**
 * GET /api/getusers
 */
export function all(req, res) {
	User.find({}).exec((err, users) => {
		if (err) {
			return res.status(500).send({message: 'Something went wrong getting the data'});
		}

		return res.status(200).json(users);
	});
}

/**
 * GET /api/getuser/:id
 */
export function oneById(req, res) {
	const id = req.params.id;

	User.findOne({'_id': id}).exec((err, user) => {
		if (err) {
			return res.status(500).send({message: 'Something went wrong getting the data'});
		}

		if (!user) {
			return res.status(404).send({ message: 'user not found.' });
		}

		return res.status(200).json(user);
	});
}


export default {
	all,
	oneById
};
