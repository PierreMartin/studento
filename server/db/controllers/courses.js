import Course from '../models/courses';
import User from '../models/user';

// const numberItemPerPage = 12;

// Pagination by skip - no the best for perfs but works with sort by
const requestGetCoursesWithPagination = (res, query, activePage, sortByField = 'created_at', typeReq, paginationNumber = 12) => {
	// 1st page:
	if (typeof activePage === 'undefined' || activePage === 1) {
		Course.find(query)
			.sort({ [sortByField]: -1 })
			.limit(paginationNumber)
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

					const pagesCount = Math.ceil(coursesCount / paginationNumber);
					return res.status(200).json({ message: `courses by ${typeReq} fetched`, courses, coursesCount, pagesCount });
				});
			});
	} else if (activePage > 1) {
		Course.find(query)
			.sort({ [sortByField]: -1 })
			.skip((activePage - 1) * paginationNumber)
			.limit(paginationNumber)
			.populate('uId', '_id username avatarMainSrc.avatar28')
			.populate('category_info', 'name description picto')
			.exec((err, courses) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: `A error happen at the fetching courses by ${typeReq} >><<`, err });
				}

				Course.count(query).exec((err, coursesCount) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: `A error happen at the fetching courses count by ${typeReq}`, err });
					}

					const pagesCount = Math.ceil(coursesCount / paginationNumber);
					return res.status(200).json({ message: `courses by ${typeReq} fetched ><`, courses, coursesCount, pagesCount });
				});
			});
	}
};

/**
 * POST /api/getcourses
 */
export function allByField(req, res) {
	const { keyReq, valueReq, activePage, sortByField, showPrivate, paginationNumber } = req.body;

	let query = {};
	if (keyReq !== 'all' && valueReq !== 'all') query = { [keyReq]: valueReq };
	query.isPrivate = false;
	if (showPrivate) delete query.isPrivate;

	requestGetCoursesWithPagination(res, query, activePage, sortByField, 'field', paginationNumber);
}

/**
 * POST /api/getcoursesbysearch
 */
export function allBySearch(req, res) {
	const { keyReq, valueReq, typing, activePage, sortByField, showPrivate } = req.body;

	if (!typing) return;

	const query = {
		$or: [
			{ title: { $regex: typing, $options: 'i'} },
			{ content: { $regex: typing, $options: 'i' } }
		]
	};
	query.isPrivate = false;
	if (showPrivate) delete query.isPrivate;

	// Add criteria if user selected a category at search:
	if (typeof keyReq === 'undefined' && valueReq !== 'all') query.category = valueReq;
	if (typeof keyReq !== 'undefined' && valueReq !== 'all') query[keyReq] = valueReq;

	requestGetCoursesWithPagination(res, query, activePage, sortByField, 'search');
}

/**
 * POST /api/getcourse
 */
export function oneByField(req, res) {
	const { keyReq, valueReq } = req.body;

	Course.findOne({ [keyReq]: valueReq })
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
 * POST /api/getnumbercourses
 */
export function countByField(req, res) {
	const { keyReq, valueReq } = req.body;

	Course.count({ [keyReq]: valueReq, isPrivate: true })
		.exec((err, priv) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'A error happen at the get private number courses', err });
			}

			Course.count({ [keyReq]: valueReq, isPrivate: false })
				.exec((err, pub) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: 'A error happen at the get public number courses', err });
					}

					return res.status(200).json({ message: 'Get number courses', numberCourses: {priv, pub} });
				});
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
	const errorField = {};
	if (typeof replyToCommentId === 'undefined') {
		errorField.commentMain = (typeof content === 'undefined' || content === '') ? true : undefined;
	} else if (typeof replyToCommentId === 'string') {
		errorField.commentReply = (typeof content === 'undefined' || content === '') ? true : undefined;
	}

	for (const key in errorField) {
		if (errorField[key] === true) {
			return res.status(400).json({errorField});
		}
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

/***************************************** Rating course *****************************************/
const updateStaringCourse = (res, courseId, rating, queryStars) => {
	Course.findOneAndUpdate({ _id: courseId }, { stars: queryStars }).exec((err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Course - A error happen at the rating course', err });
		}

		Course.findOne({ _id: courseId })
			.exec((err, course) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Course - A error happen at the rating course', err });
				}

				return res.status(200).json({
					message: `Thank you, you gave a score of ${rating} out of 5 for this course`,
					stars: { average: course.stars.average, numberOfTimeVoted: course.stars.numberOfTimeVoted, totalStars: course.stars.totalStars },
					courseId
				});
			});
	});
};

/**
 * POST /api/ratingcourse
 */
export function ratingCourse(req, res) {
	const { rating, uId, courseId, at, stars } = req.body;

	const totalStars = stars.totalStars ? stars.totalStars + rating : rating;
	const numberOfTimeVoted = stars.numberOfTimeVoted ? stars.numberOfTimeVoted + 1 : 1;
	const average = Math.ceil(totalStars / numberOfTimeVoted);
	const queryStars = { average, totalStars, numberOfTimeVoted };
	const now = new Date();
	const date24hoursBefore = now.setHours(now.getHours() - 24);

	if (typeof rating === 'undefined' || !uId || !courseId) return res.status(500).json({ message: 'A error happen at the rating course, payload missing' });

	// TODO do transaction
	User.findOne({ _id: uId, votedCourses: { $elemMatch: { courseId, at: {$lte: new Date(date24hoursBefore) } } } }, (findErr, userAlreadyVotedMore24hoursBefore) => {
		// If course already voted more 24 hours before:
		if (userAlreadyVotedMore24hoursBefore) {
			User.findOneAndUpdate({_id: uId, 'votedCourses.courseId': courseId},
				{
					$set: {
						'votedCourses.$.courseId': courseId,
						'votedCourses.$.at': at
					}
				}, (err) => {
					if (err) return res.status(500).json({ message: 'User update - A error happen at the rating course', err });

					updateStaringCourse(res, courseId, rating, queryStars);
				});
		} else {
			User.findOne({ _id: uId, votedCourses: { $elemMatch: { courseId } } }, (findErr, userAlreadyVoted) => {
				// If course don't already voted:
				if (!userAlreadyVoted) {
					User.findOneAndUpdate({_id: uId}, {$push: { votedCourses: { courseId, at } } }, (err) => {
						if (err) return res.status(500).json({ message: 'User push - A error happen at the rating course', err });

						updateStaringCourse(res, courseId, rating, queryStars);
					});
				} else {
					return res.status(500).json({ message: 'You already voted for this course! Please waiting for 24 hours for submit a new vote' });
				}
			});
		}
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

/**
 * Post /api/checkownercourse
 */
export function checkOwnerCourse(req, res) {
	const { userMeId, courseIdToFind } = req.body;

	Course.findOne({ _id: courseIdToFind, uId: userMeId })
		.exec((err, course) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'A error happen at the checking owner course', err });
			}

			const isUserOwnerCourse = !!course;

			return res.status(200).json({ message: 'Owner course checked', isUserOwnerCourse });
		});
}

export default {
	allByField,
	allBySearch,
	oneByField,
	countByField,
  add,
	addComment,
	ratingCourse,
	update,
	deleteOne,
	checkOwnerCourse
};
