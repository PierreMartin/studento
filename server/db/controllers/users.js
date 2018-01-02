import multer from 'multer';
import path from 'path';
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


/***************************************** Upload Avatars *****************************************/
const maxSize = 1000 * 1000 * 1000;
const uploaded = multer().single('formAvatar');

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'public/uploads/');
	},
	filename: function (req, file, callback) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			if (!err) {
				let ext = file.originalname && path.extname(file.originalname);

				if (typeof ext === 'undefined' || ext === '') {
					ext = '.jpg';
				}
				callback(null, raw.toString('hex') + Date.now() + ext.toLowerCase());
			}
		});
	}
});

const upload = multer({
	storage,
	limits: { fileSize: maxSize },
	fileFilter: function (req, file, callback) {
		const typeArray = file.mimetype.split('/');
		const ext = file.originalname && path.extname(file.originalname).toLowerCase();

		if (typeArray[0] !== 'image') {
			return callback(new Error('Something went wrong'), false);
		}

		if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
			return callback(new Error('Only images are allowed'), false);
		}

		callback(null, true);
	}
});

export const uploadAvatarMulter = upload.single('formAvatar');

/**
 * POST /api/addavatar/:id/:avatarId
 */
export function uploadAvatar(req, res) {
	const id = req.params.id;
	const filename = req.file.filename;
	const mainProfil = '150_' + req.file.filename;
	const thumbnail1 = '80_' + req.file.filename;
	const avatarId = parseInt(req.params.avatarId, 10);
	const avatarsSrc = { avatarId, mainProfil, thumbnail1 };

	uploaded(req, res, function (err) {
		if (err || !id || !filename) {
			return res.status(500).json({message: 'A error happen at the updating avatar profile'}).end();
		}

		sharp.cache(true);

		// Main image :
		sharp(req.file.path)
			.resize(150, 150)
			.crop(sharp.strategy.entropy)
			.toFile('public/uploads/' + mainProfil);

		// Thumbnail image :
		sharp(req.file.path)
			.resize(80, 80)
			.crop(sharp.strategy.entropy)
			.toFile('public/uploads/' + thumbnail1, function (err) {
				// for deleting the original image // TODO ATTENTION ON WINDOWS
				unlinkSync('public/uploads/' + filename);
			});
	});

	User.findOne({ '_id': id, avatarsSrc: { $elemMatch: { avatarId } } }, (findErr, userAvatar) => {
		// If avatar already exist
		if (userAvatar) {
			console.log('This avatar already exist');

			User.findOneAndUpdate({'_id': id, 'avatarsSrc.avatarId': avatarId},
				{
					$set: {
						'avatarsSrc.$.avatarId': avatarId,
						'avatarsSrc.$.mainProfil': mainProfil,
						'avatarsSrc.$.thumbnail1': thumbnail1
					}
				}, (err) => {
					if (err) return res.status(500).json({message: 'A error happen at the updating avatar profile'});

					return res.status(200).json({message: 'Your avatar has been update', avatarsSrc});
				});
		// If avatar don't exist
		} else {
			console.log('This avatar don\'t exist');

			User.findOneAndUpdate({'_id': id}, {$push: { avatarsSrc } }, (err) => {
				if (err) return res.status(500).json({message: 'A error happen at the updating avatar profile'});

				return res.status(200).json({message: 'Your avatar has been add', avatarsSrc});
			});
		}
	});
}

export default {
	all,
	oneById,
	update,
	uploadAvatarMulter,
	uploadAvatar
};
