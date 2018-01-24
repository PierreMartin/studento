import Message from '../models/message';

/**
 * GET /api/getmessages/:channelid
 */
export function allByChannelId(req, res) {
	const { channelid } = req.params;

	Message.find({ channelId: channelid }).exec((err, messagesListTchat) => {
		if (err) return res.status(500).json({message: 'Something went wrong getting the data'});

		return res.status(200).json({message: 'messages fetched', messagesListTchat});
	});
}

/**
 * POST /api/addmessages/:channelid
 */
export function add(req, res) {
	Message.create(req.body, (err) => {
		if (err) return res.status(500).json({message: 'add messages ko'});

		return res.status(200).json({message: 'You have added a messages', messageTchat: req.body});
	});
}

export default {
	allByChannelId,
	add
};
