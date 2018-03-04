import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
	id: { type: String, unique: true },
	author: { type: String, ref: 'User' },
	channelId: { type: String },
	content: { type: String, default: '' },
	created_at: { type: Date },

	readBy: [{
		username: { type: String, default: '' },
		at: { type: Date, default: null }
	}]
});

export default mongoose.model('Message', MessageSchema);
