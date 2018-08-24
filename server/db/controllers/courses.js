import Course from '../models/courses';

/**
 * Get /api/getcourses
 */
export function all(req, res) {
	Course.find({}).populate('uId', '_id username avatarMainSrc.avatar28').exec((err, courses) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: err });
    }

		return res.status(200).json({ message: 'courses fetched', courses });
  });
}

/**
 * Get /api/getcourse/:id
 */
export function oneById(req, res) {
	const { id } = req.params;

	Course.findOne({ _id: id }).populate('uId', '_id username avatarMainSrc.avatar28').exec((err, course) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: err });
		}

		return res.status(200).json({ message: 'course fetched', course });
  });
}

/**
 * POST /api/addcourse
 */
export function add(req, res) {
	const { fields, userMeId, createdAt } = req.body;
	const errorField = {};
	const data = { ...fields, uId: userMeId, created_at: createdAt };

	// handling required fields :
	errorField.title = (typeof fields.title === 'undefined' || fields.title === '') ? true : undefined;
	errorField.category = (typeof fields.category === 'undefined' || fields.category === '') ? true : undefined;
	errorField.content = (typeof fields.content === 'undefined' || fields.content === '') ? true : undefined;

	// displaying required fields :
	for (const key in errorField) {
		if (errorField[key] === true) {
			return res.status(400).json({errorField});
		}
	}

	if (!userMeId) return res.status(500).json({ message: 'A error happen at the creating new course, no userMeId' });

	// If all good:
	const course = new Course(data);

	course.save((err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'A error happen at the creating new course', err });
		}

		Course.populate(course, { path: 'uId', select: '_id username avatarMainSrc.avatar28' }, (err, newCourse) => {
			return res.status(200).json({ message: 'You have create a course', newCourse });
		});
	});
}

/**
 * PUT /api/updatecourse
 */
export function update(req, res) {
	const { fields, modifiedAt, courseId } = req.body;
	const errorField = {};
	const data = { ...fields, modified_at: modifiedAt };

	// handling required fields :
	errorField.title = fields.title === '' ? true : undefined;
	errorField.category = fields.category === '' ? true : undefined;
	errorField.content = fields.content === '' ? true : undefined;

	// displaying required fields :
	for (const key in errorField) {
		if (errorField[key] === true) {
			return res.status(400).json({errorField});
		}
	}

	if (!courseId) return res.status(500).json({ message: 'A error happen at the updating course, no courseId' });

	// If all good:
	Course.findOneAndUpdate({ _id: courseId }, data).exec((err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'A error happen at the updating course', err });
		}

		Course.findOne({ _id: courseId }).populate('uId', '_id username avatarMainSrc.avatar28').exec((err, course) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'A error happen at the get course', err });
			}

			return res.status(200).json({ message: 'You\'re course as been updated!', newCourse: course });
		});
	});
}

export default {
  all,
	oneById,
  add,
	update
};
