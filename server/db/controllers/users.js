import User from '../models/user';
import bcrypt from 'bcrypt-nodejs';
import { calculateAge } from '../../../toolbox/toolbox';

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

/**
 * PUT /api/updateuser/:id
 */
export function update(req, res) {
	const data = req.body;
	const id = req.params.id;
	const errorField = {};

	// handling required fields :
	errorField.username = data.username === null;
	errorField.email = data.email === null;
	errorField.password = data.password === null;

	const condiBirthDate1 = data.birthDateDay === null && data.birthDateMonth === null && data.birthDateYear !== null;
	const condiBirthDate2 = data.birthDateDay === null && data.birthDateMonth !== null && data.birthDateYear === null;
	const condiBirthDate3 = data.birthDateDay !== null && data.birthDateMonth === null && data.birthDateYear === null;
	const condiBirthDate4 = data.birthDateDay !== null && data.birthDateMonth === null && data.birthDateYear !== null;
	const condiBirthDate5 = data.birthDateDay !== null && data.birthDateMonth !== null && data.birthDateYear === null;
	const condiBirthDate6 = data.birthDateDay === null && data.birthDateMonth !== null && data.birthDateYear !== null;
	const condiBirthDateFull = data.birthDateDay !== null && data.birthDateMonth !== null && data.birthDateYear !== null;

	// check if the birthDate is half full:
	if (condiBirthDate1 || condiBirthDate2 || condiBirthDate3 || condiBirthDate4 || condiBirthDate5 || condiBirthDate6) {
		errorField.birthDateFull = true;
		errorField.birthDateDay = data.birthDateDay === null;
		errorField.birthDateMonth = data.birthDateMonth === null;
		errorField.birthDateYear = data.birthDateYear === null;
	} else if (condiBirthDateFull) {
		const birthDateFull = new Date(data.birthDateYear, data.birthDateMonth, data.birthDateDay);
		errorField.birthDateFull = Object.prototype.toString.call(birthDateFull) !== '[object Date]';

		data.birthDate = birthDateFull.getTime();
		data.age = calculateAge(birthDateFull);
	}

	if (data.password) {
		data.password = bcrypt.hashSync(data.password);
	}

	// displaying required fields :
	for (const key in errorField) {
		if (errorField[key] === true) {
			return res.status(400).json({errorField});
		}
	}

	if (id && !data) {
		return res.status(400).json({message: 'A error happen at the updating profile, no data'});
	}

	User.findOneAndUpdate({'_id': id}, data, (err) => {
		if (err) return res.status(500).json({message: 'A error happen at the updating profile'});

		return res.status(200).json({message: 'You\'re profile as been updated!', data});
	});
}


export default {
	all,
	oneById,
	update
};
