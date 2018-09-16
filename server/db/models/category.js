import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
	name: { type: String, default: '' },
	description: { type: String, default: '' },
	key: { type: String, default: '' },
	picto: { type: String, default: '' },

	subCategories: [{
		name: { type: String, default: '' },
		description: { type: String, default: '' },
		key: { type: String, default: '' },
		picto: { type: String, default: '' }
	}]
});

export default mongoose.model('Category', CategorySchema);
