import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
	uId: { type: String, ref: 'User' },
	title: { type: String, default: '' },
	category: { type: String }, // populate ?  for create collection 'Categories': [name: 'Informatique', description: 'techno bla bla', difficulty: 1]
	subCategories: { type: Array },
	isPrivate: { type: Boolean, default: false },
	content: { type: String, default: '' },
	created_at: { type: Date },
	modified_at: { type: Date },

	staredBy: [{
		username: { type: String, default: '' },
		at: { type: Date, default: null }
	}],

	commentedBy: [{
		username: { type: String, default: '' },
		at: { type: Date, default: null }
	}]
});

export default mongoose.model('Course', CourseSchema);
