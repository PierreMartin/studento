import multer from 'multer';
import multerS3 from 'multer-s3-transform';
import path from 'path';
import jimp from 'jimp'; // TODO to remove after replace by sharp
import sharp from 'sharp';
import crypto from 'crypto';
import aws from 'aws-sdk';
import { unlinkSync } from 'fs';
import User from '../models/user';
import bcrypt from 'bcrypt-nodejs';
import { calculateAge } from '../../../toolbox/toolbox';

const numberItemPerPage = 2;

// S3 AWS:
aws.config.region = 'eu-west-3';
const s3 = new aws.S3();
const S3_BUCKET = process.env.S3_BUCKET || 'studento';
const sizes = [150, 80, 28];
let nameImage = '';

/**
 * POST /api/getusers
 */
export function all(req, res) {
	const { keyReq, valueReq, currentUserId, directionIndex } = req.body;

	let query = {};
	if (keyReq !== 'all' && valueReq !== 'all') query = { [keyReq]: valueReq };

	// 1st page:
	if (typeof currentUserId === 'undefined') {
		User.find(query)
			.limit(numberItemPerPage)
			.sort({ _id: 1 })
			.exec((err, users) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'A error happen at the fetching users by field', err });
				}

				User.count(query).exec((err, usersCount) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: 'A error happen at the fetching users count by field', err });
					}

					const pagesCount = Math.ceil(usersCount / numberItemPerPage);
					return res.status(200).json({ message: 'users by field fetched', users, pagesCount });
				});
			});
	} else if (directionIndex >= 0) {
		// Go to page >
		User.find({ ...query, _id: {$gte: currentUserId }})
			.skip(directionIndex * numberItemPerPage)
			.limit(numberItemPerPage)
			.sort({ _id: 1 })
			.exec((err, users) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'A error happen at the fetching users by field >>', err });
				}
				return res.status(200).json({ message: 'users by field fetched >', users });
			});
	} else {
		// Go to page <
		User.find({ ...query, _id: {$lt: currentUserId }})
			.skip((Math.abs(directionIndex) - 1) * numberItemPerPage)
			.limit(numberItemPerPage)
			.sort({ _id: -1 })
			.exec((err, users) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'A error happen at the fetching users by field <<', err });
				}
				return res.status(200).json({ message: 'users by field fetched <', users: users.reverse() });
			});
	}
}

/**
 * GET /api/getuser/:id
 */
export function oneById(req, res) {
	const { id } = req.params;

	User.findOne({_id: id}).exec((err, user) => {
		if (err) return res.status(500).send({ message: 'A error happen at the fetching user by id', err });
		if (!user) return res.status(404).send({ message: 'user not found.' });

		return res.status(200).json({ message: 'user by id fetched', user });
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

	User.findOneAndUpdate({_id: id}, data, (err) => {
		if (err) return res.status(500).json({message: 'A error happen at the updating profile'});

		return res.status(200).json({message: 'You\'re profile as been updated!', data});
	});
}


/***************************************** Upload Avatars *****************************************/
const maxSize = 1000 * 1000 * 1000;

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, 'public/uploadsRaw/');
	},
	filename(req, file, callback) {
		crypto.pseudoRandomBytes(16, (err, raw) => {
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
	fileFilter(req, file, callback) {
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

const createUniqueName = (file) => {
	const ext = (/[^.]+$/.exec(file.originalname.toLowerCase()) && /[^.]+$/.exec(file.originalname.toLowerCase())[0]) || 'jpg';
	nameImage = `${Math.floor(Math.random() * 100000000)}_${Date.now()}.${ext}`;
};

// For S3 only
const uploadS3 = multer({
	limits: { fileSize: maxSize },
	fileFilter(req, file, callback) {
		const typeArray = file.mimetype.split('/');
		const ext = file.originalname && path.extname(file.originalname).toLowerCase();

		if (typeArray[0] !== 'image') {
			return callback(new Error('Something went wrong'), false);
		}

		if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
			return callback(new Error('Only images are allowed'), false);
		}

		callback(null, true);
	},
	storage: multerS3({
		s3,
		bucket: S3_BUCKET,
		acl: 'public-read',
		shouldTransform: (req, file, cb) => {
			createUniqueName(file);
			cb(null, /^image/i.test(file.mimetype));
		},
		transforms: [
			{
				id: 'thumbnail-150',
				key: (req, file, cb) => {
					cb(null, sizes[0] + '_' + nameImage);
				},
				transform: (req, file, cb) => {
					cb(null, sharp().resize(sizes[0], sizes[0]));
				}
			},
			{
				id: 'thumbnail-80',
				key: (req, file, cb) => {
					cb(null, sizes[1] + '_' + nameImage);
				},
				transform: (req, file, cb) => {
					cb(null, sharp().resize(sizes[1], sizes[1]));
				}
			},
			{
				id: 'thumbnail-28',
				key: (req, file, cb) => {
					cb(null, sizes[2] + '_' + nameImage);
				},
				transform: (req, file, cb) => {
					cb(null, sharp().resize(sizes[2], sizes[2]));
				}
			}
		],
		metadata: (req, file, cb) => {
			cb(null, { fieldName: file.fieldname });
		}
	})
});

export const uploadAvatarMulter = upload.single('formAvatar');
export const uploadAvatarMulterS3 = uploadS3.single('formAvatar');

/**
 * POST /api/addavatar/:userId/:avatarId
 */
export function uploadAvatar(req, res) {
	const userId = req.params.userId;
	const filename = req.file.filename;
	const avatar150 = sizes[0] + '_' + filename;
	const avatar80 = sizes[1] + '_' + filename;
	const avatar28 = sizes[2] + '_' + filename;
	const avatarId = parseInt(req.params.avatarId, 10);
	const avatarSrc = { avatarId, avatar150, avatar80, avatar28 };

	if (!userId || !filename) return res.status(500).json({message: 'A error happen at the updating avatar profile'}).end();

	// rezise at different size :
	/* TODO remplacer jimp par ca:
	sizes.forEach((size) => {
		sharp(req.file.path)
			.resize(size, size)
			.toFile('./public/uploads/' + size + '_' + filename, (err, info) => { ... });
			.then(() => {})
			.catch(() => {});
	});
	*/

	jimp.read(req.file.path, (err, image) => {
		if (err) throw err;

		sizes.forEach((size) => {
			image
				.scaleToFit(size, jimp.AUTO, jimp.RESIZE_BEZIER)
				.write('./public/uploads/' + size + '_' + filename);
		});

		// remove the original image :
		unlinkSync('public/uploadsRaw/' + filename);
	});

	User.findOne({ _id: userId, avatarsSrc: { $elemMatch: { avatarId } } }, (findErr, userWithAvatar) => {
		// If avatar already exist
		if (userWithAvatar) {
			User.findOneAndUpdate({_id: userId, 'avatarsSrc.avatarId': avatarId},
				{
					$set: {
						'avatarsSrc.$.avatarId': avatarId,
						'avatarsSrc.$.avatar150': avatar150,
						'avatarsSrc.$.avatar80': avatar80,
						'avatarsSrc.$.avatar28': avatar28
					}
				}, (err) => {
					if (err) return res.status(500).json({message: 'A error happen at the updating avatar profile'});

					// If updated the avatar setted as main - we also set default avatar :
					if (userWithAvatar.avatarMainSrc.avatarId === avatarId) {
						User.findOneAndUpdate({ _id: userId }, {avatarMainSrc: avatarSrc}, (err) => {
							if (err) res.status(500).json({message: 'A error happen at the updating main avatar profile'});
						});
					}

					return res.status(200).json({message: 'Your avatar has been update', avatarSrc});
				});
		// If avatar don't exist
		} else {
			User.findOneAndUpdate({_id: userId}, {$push: { avatarsSrc: avatarSrc } }, (err) => {
				if (err) return res.status(500).json({message: 'A error happen at the updating avatar profile'});

				return res.status(200).json({message: 'Your avatar has been add', avatarSrc});
			});
		}
	});
}

/***************************************** Upload Avatars S3 *****************************************/
/**
 * POST /api/addavatar-s3/:userId/:avatarId
 */
export function uploadAvatarS3(req, res) {
	const userId = req.params.userId;
	const { transforms } = req.file;

	let avatar150;
	let avatar80;
	let avatar28;

	for (let i = 0; i < transforms.length; i++) {
		if (transforms[i].id === 'thumbnail-150') {
			avatar150 = transforms[i].key;
		}
		if (transforms[i].id === 'thumbnail-80') {
			avatar80 = transforms[i].key;
		}
		if (transforms[i].id === 'thumbnail-28') {
			avatar28 = transforms[i].key;
		}
	}

	const avatarId = parseInt(req.params.avatarId, 10);
	const avatarSrc = { avatarId, avatar150, avatar80, avatar28 };

	if (!userId || !avatar150 || !avatar80 || !avatar28) return res.status(500).json({message: 'A error happen at the updating avatar profile'}).end();

	User.findOne({ _id: userId, avatarsSrc: { $elemMatch: { avatarId } } }, (findErr, userWithAvatar) => {
		// If avatar already exist
		if (userWithAvatar) {
			User.findOneAndUpdate({_id: userId, 'avatarsSrc.avatarId': avatarId},
				{
					$set: {
						'avatarsSrc.$.avatarId': avatarId,
						'avatarsSrc.$.avatar150': avatar150,
						'avatarsSrc.$.avatar80': avatar80,
						'avatarsSrc.$.avatar28': avatar28
					}
				}, (err) => {
					if (err) return res.status(500).json({ message: 'A error happen at the updating avatar profile - avatar already exist', err });

					// If updated the avatar setted as main - we also set default avatar :
					if (userWithAvatar.avatarMainSrc.avatarId === avatarId) {
						User.findOneAndUpdate({ _id: userId }, {avatarMainSrc: avatarSrc}, (err) => {
							if (err) res.status(500).json({message: 'A error happen at the updating main avatar profile'});
						});
					}

					return res.status(200).json({message: 'Your avatar has been update', avatarSrc});
				});
			// If avatar don't exist
		} else {
			User.findOneAndUpdate({_id: userId}, {$push: { avatarsSrc: avatarSrc } }, (err) => {
				if (err) return res.status(500).json({ message: 'A error happen at the updating avatar profile - avatar don\'t exist', err });

				return res.status(200).json({message: 'Your avatar has been add', avatarSrc});
			});
		}
	});
}

/**
 * PUT /api/setdefaultavatar/:idUser/
 */
export function setDefaultAvatar(req, res) {
	const avatarId = req.body.avatarId;
	const idUser = req.params.idUser;

	User.findOne({ _id: idUser }, (findErr, user) => {
		// Set the new 'avatarMainSrc' obj :
		let avatarMainSrc = null;
		for (let i = 0; i < user.avatarsSrc.length; i++) {
			const avatar = user.avatarsSrc[i];
			if (avatar.avatarId === avatarId) {
				avatarMainSrc = avatar;
				break;
			}
		}

		if (avatarMainSrc) {
			User.findOneAndUpdate({ _id: idUser }, {avatarMainSrc}, (err, user) => {
				if (err) {
					return res.status(500).json({message: 'A error happen at the updating main avatar profile'});
				} else if (user) {
					return res.status(200).json({message: 'Your main avatar has been update', avatarMainSrc});
				}
			});
		}
	});
}

export default {
	all,
	oneById,
	update,
	uploadAvatarMulter,
	uploadAvatarMulterS3,
	uploadAvatar,
	uploadAvatarS3,
	setDefaultAvatar
};
