import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
	author: { type: String, ref: 'User' },
	channelId: { type: String },
	content: { type: String, default: '' },
	created_at: { type: Date },
	read_at: { type: Date }
});

export default mongoose.model('Message', MessageSchema);
