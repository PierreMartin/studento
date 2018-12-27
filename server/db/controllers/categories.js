import categoriesJson from '../../data/categories.json';
import Category from '../models/category';

/**
 * Get /api/getcategories
 */
export function all(req, res) {
	Category.find({}).exec((err, categories) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'A error happen at the fetching categories', err });
		}

		if (!categories || categories.length === 0) {
			return res.status(200).json({ message: 'categories fetched', categories: categoriesJson.categories });
		}

		return res.status(200).json({ message: 'categories fetched', categories });
	});
}

/**
 * POST /api/getcategory
 */
export function one(req, res) {
	const { category, subcategory } = req.body;

	const haveSubCategory = subcategory !== 'list';
	const query = haveSubCategory ? { 'subCategories.key': subcategory } : { key: category };

	Category.findOne(query).exec((err, category) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'A error happen at the fetching category', err });
		}

		return res.status(200).json({ message: 'category fetched', category });
	});
}

export default {
	all,
	one
};
