import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
	id: { type: String },
	users: [{ type: String, ref: 'User' }]
});

export default mongoose.model('Channel', ChannelSchema);
