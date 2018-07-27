import Course from '../models/courses';

/**
 * Get /api/getcourses
 */
export function all(req, res) {
	Course.find({}).exec((err, courses) => {
    if (err) {
      console.log('Error in first query');
      return res.status(500).send('Something went wrong getting the data');
    }

    return res.status(200).json(courses);
  });
}

/**
 * Get /api/getcourse/:id
 */
export function oneById(req, res) {
	const { id } = req.params;

	Course.findOne({ _id: id }).exec((err, course) => {
		if (err) return res.status(500).json({ message: 'Something went wrong getting the data' });

		return res.status(200).json({ message: 'course fetched', course });
  });
}

/**
 * POST /api/addcourse/:id
 */
export function add(req, res) {
	const description = (req.body.description) ? req.body.description : 'no description';
	const price = (req.body.price) ? req.body.price : 10;
	const query = { ...req.body, id: req.params.id, description, price };

	Course.create(query, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }

    return res.status(200).json({message: 'You have added a course', course: query});
  });
}

export default {
  all,
	oneById,
  add
};
