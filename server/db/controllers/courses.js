import Course from '../models/courses';

/**
 * Get /api/getcourses
 */
export function all(req, res) {
	Course.find({}).exec((err, courses) => {
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

	Course.findOne({ _id: id }).exec((err, course) => {
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
	const query = {
		...fields,
		uId: userMeId,
		created_at: createdAt
	};

	console.log('newCourse ==> ', query);

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
	const course = new Course(query);

	course.save((err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'A error happen at the creating new course', err });
		}

		return res.status(200).json({ message: 'You have create a course', newCourse: query }); // TODO remplacer query par la réponse BE (pour avoir _id)

		/*
		Message.populate(message, { path: 'author', select: '_id username avatarMainSrc.avatar28' }, (err, newMessageData) => {
			return res.status(200).json({message: '', newCourseData});
		});
		*/
	});
}

export default {
  all,
	oneById,
  add
};
