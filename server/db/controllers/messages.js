import Message from '../models/message';

/**
 * GET /api/getmessages/:channelid
 */
export function allByChannelId(req, res) {
	const { channelid } = req.params;

	Message.find({ channelId: channelid }).populate('author', '_id username').exec((err, messagesList) => {
		if (err) return res.status(500).json({message: 'Something went wrong getting the data'});

		const getMessagesListForChannel = {
			[channelid]: {
				channelId: channelid,
				messages: messagesList
			}
		};

		return res.status(200).json({message: 'messages fetched', getMessagesListForChannel});
	});
}

/**
 * POST /api/addmessage
 */
export function add(req, res) {
	const newMessageData = req.body;
	Message.create(newMessageData, (err) => {
		if (err) return res.status(500).json({message: 'add messages ko'});

		return res.status(200).json({message: 'You have added a new message', newMessageData});
	});
}

export default {
	allByChannelId,
	add
};