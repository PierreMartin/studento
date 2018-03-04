import Message from '../models/message';

/**
 * GET /api/getmessages/:channelid
 */
export function allByChannelId(req, res) {
	const { channelid } = req.params;

	Message.find({ channelId: channelid }).populate('author', '_id username avatarMainSrc.avatar28').exec((err, messagesList) => {
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
 * GET /api/getunreadmessages/:userid
 */
export function allUnreadByUserId(req, res) {
	const { userid } = req.params;

	Message.find({ author: userid, 'readBy.at': null }).populate('author', '_id username avatarMainSrc.avatar28').exec((err, messagesList) => {
		if (err) return res.status(500).json({message: 'Something went wrong getting the data'});

		// TODO trouver une facon de compter tous les messages non lu par channel
		console.log('messagesList ==> ', messagesList);

		/*
		const getUnreadMessagesListForUser = {
			[messagesList.channelid]: {
				messages: messagesList
			}
		};
		*/

		return res.status(200).json({message: 'unread messages fetched', messagesList});
	});
}

/**
 * POST /api/addmessage
 */
export function add(req, res) {
	const message = new Message(req.body);

	message.save((err) => {
		if (err) return res.status(500).json({message: 'add messages ko'});

		Message.populate(message, { path: 'author', select: '_id username avatarMainSrc.avatar28' }, (err, newMessageData) => {
			return res.status(200).json({message: 'You have added a new message', newMessageData});
		});
	});
}

export default {
	allByChannelId,
	add
};
