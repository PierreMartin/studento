import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
	uId: { type: String, ref: 'User' },
	type: { type: String },
	title: { type: String, default: '' },
	description: { type: String, default: '' },
	category: { type: String }, // 'key' of the Category
	subCategories: { type: Array },
	isPrivate: { type: Boolean, default: false },
	content: { type: String, default: '' },
	created_at: { type: Date },
	modified_at: { type: Date },

	template: {
		columnH1: { type: Number, default: 1 },
		columnH2: { type: Number, default: 1 },
		columnH3: { type: Number, default: 1 },
		columnH4: { type: Number, default: 1 },
		columnH5: { type: Number, default: 1 },
		columnH6: { type: Number, default: 1 }
	},

	stars: {
		average: { type: Number },
		totalStars: { type: Number },
		numberOfTimeVoted: { type: Number }
	},

	starredBy: [{ // TODO put it in aside collection and remove of this collection
		uId: { type: String, ref: 'User' },
		at: { type: Date, default: null }
	}],

	commentedBy: [{
		uId: { type: String, ref: 'User' },
		content: { type: String },
		at: { type: Date, default: null },
		replyBy: [{
			uId: { type: String, ref: 'User' },
			content: { type: String },
			at: { type: Date, default: null }
		}]
	}]
}, { toJSON: { virtuals: true } });

// Need to create a population virtual because we don't base on the '_id' key for the categories, bu on the 'key' key:
CourseSchema.virtual('category_info', {
	ref: 'Category',
	localField: 'category',
	foreignField: 'key',
	justOne: true
});

export default mongoose.model('Course', CourseSchema);
