import categories from '../../data/categories.json';

/**
 * Get /api/getcategories
 */
export function all(req, res) {
	if (!categories) {
		console.error(categories);
	}

	return res.status(200).json({ message: 'categories fetched', categories });
}

export default {
	all
};
