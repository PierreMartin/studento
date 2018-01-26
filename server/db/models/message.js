import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
	channelId: { type: String},
	authorId: { type: String },
	content: { type: String, default: '' },
	created_at: { type: Date },
	read_at: { type: Date }
});

export default mongoose.model('Message', MessageSchema);
