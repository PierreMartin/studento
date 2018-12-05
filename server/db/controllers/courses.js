import Course from '../models/courses';

const numberItemPerPage = 12;


const requestGetCoursesWithPagination = (res, query, currentCourseId, directionIndex, typeReq) => {
	// 1st page:
	if (typeof currentCourseId === 'undefined') {
		Course.find(query)
			.limit(numberItemPerPage)
			.sort({ _id: 1 })
			.populate('uId', '_id username avatarMainSrc.avatar28')
			.populate('category_info', 'name description picto')
			.exec((err, courses) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: `A error happen at the fetching courses by ${typeReq}`, err });
				}

				Course.count(query).exec((err, coursesCount) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: `A error happen at the fetching courses count by ${typeReq}`, err });
					}

					const pagesCount = Math.ceil(coursesCount / numberItemPerPage);
					return res.status(200).json({ message: `courses by ${typeReq} fetched`, courses, pagesCount });
				});
			});
	} else if (directionIndex >= 0) {
		// Go to page >
		Course.find({ ...query, _id: {$gte: currentCourseId }})
			.skip(directionIndex * numberItemPerPage)
			.limit(numberItemPerPage)
			.sort({ _id: 1 })
			.populate('uId', '_id username avatarMainSrc.avatar28')
			.populate('category_info', 'name description picto')
			.exec((err, courses) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: `A error happen at the fetching courses by ${typeReq} >>`, err });
				}
				return res.status(200).json({ message: `courses by ${typeReq} fetched >`, courses });
			});
	} else {
		// Go to page <
		Course.find({ ...query, _id: {$lt: currentCourseId }})
			.skip((Math.abs(directionIndex) - 1) * numberItemPerPage)
			.limit(numberItemPerPage)
			.sort({ _id: -1 })
			.populate('uId', '_id username avatarMainSrc.avatar28')
			.populate('category_info', 'name description picto')
			.exec((err, courses) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: `A error happen at the fetching courses by ${typeReq} <<`, err });
				}
				return res.status(200).json({ message: `courses by ${typeReq} fetched <`, courses: courses.reverse() });
			});
	}
};

/**
 * POST /api/getcourses
 */
export function allByField(req, res) {
	const { keyReq, valueReq, currentCourseId, directionIndex } = req.body;

	let query = {};
	if (keyReq !== 'all' && valueReq !== 'all') query = { [keyReq]: valueReq };

	requestGetCoursesWithPagination(res, query, currentCourseId, directionIndex, 'field');
}

/**
 * POST /api/getcoursesbysearch
 */
export function allBySearch(req, res) {
	const { select, typing, currentCourseId, directionIndex } = req.body;

	if (!typing) return;

	const query = {
		$or: [
			{ title: { $regex: typing, $options: 'i'} },
			{ content: { $regex: typing, $options: 'i' } }
		]
	};

	// Add criteria if user selected a category at search:
	if (select !== 'all') query.category = select;

	requestGetCoursesWithPagination(res, query, currentCourseId, directionIndex, 'search');
}

/**
 * Get /api/getcourse/:id
 */
export function oneById(req, res) {
	const { id } = req.params;

	Course.findOne({ _id: id })
		.populate('uId', '_id username avatarMainSrc.avatar28')
		.populate('category_info', 'name description picto')
		.populate('commentedBy.uId', '_id username avatarMainSrc.avatar28')
		.populate('commentedBy.replyBy.uId', '_id username avatarMainSrc.avatar28')
		.exec((err, course) => {
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
 * POST /api/addcomment
 */
export function addComment(req, res) {
	const { content, courseId, uId, at, replyToCommentId } = req.body;
	const query = { content, uId, at };

	// handling required fields :
	if (typeof content === 'undefined' || content === '') {
		return res.status(400).json({ fieldContentMissing: true });
	}

	if (!uId) return res.status(500).json({ message: 'A error happen at the added comment, no uId' });

	// If all good:
	if (typeof replyToCommentId === 'undefined') {
		// Normal comment:
		Course.findOneAndUpdate({ _id: courseId }, {$push: { commentedBy: query } }).exec((err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'A error happen at the added comment main', err });
			}

			Course.findOne({ _id: courseId })
				.populate('commentedBy.uId', '_id username avatarMainSrc.avatar28')
				.populate('commentedBy.replyBy.uId', '_id username avatarMainSrc.avatar28')
				.exec((err, course) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: 'A error happen at the added comment main', err });
					}

					return res.status(200).json({ message: 'Your comment as been added!', commentsList: course.commentedBy });
				});
		});
	} else if (typeof replyToCommentId === 'string') {
		// Reply comment:
		Course.findOneAndUpdate({ _id: courseId, 'commentedBy._id': replyToCommentId }, {$push: { 'commentedBy.$.replyBy': query } }).exec((err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'A error happen at the added comment reply', err });
			}

			Course.findOne({ _id: courseId })
				.populate('commentedBy.uId', '_id username avatarMainSrc.avatar28')
				.populate('commentedBy.replyBy.uId', '_id username avatarMainSrc.avatar28')
				.exec((err, course) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: 'A error happen at the added comment reply', err });
					}

					return res.status(200).json({ message: 'Your reply comment as been added!', commentsList: course.commentedBy });
				});
		});
	}
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

		Course.findOne({ _id: courseId }).populate('uId', '_id username avatarMainSrc.avatar28').populate('category_info', 'name description picto').exec((err, course) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'A error happen at the get course', err });
			}

			return res.status(200).json({ message: 'You\'re course as been updated!', newCourse: course });
		});
	});
}

/**
 * DELETE /api/deletecourse/:courseid
 */
export function deleteOne(req, res) {
	const { courseid } = req.params;

	Course.deleteOne({ _id: courseid }).exec((err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'A error happen at the deleting course', err });
		}

		return res.status(200).json({ message: 'course deleted' });
	});
}

export default {
	allByField,
	allBySearch,
	oneById,
  add,
	addComment,
	update,
	deleteOne
};
