import Message from '../models/message';
import Channel from '../models/channel';

/**
 * GET /api/getmessages/:channelid
 */
export function allByChannelId(req, res) {
	const { channelid } = req.params;

	Message.find({ channelId: channelid }).sort({ created_at: -1 }).limit(30).populate('author', '_id username avatarMainSrc.avatar28').exec((err, messagesList) => {
		if (err) return res.status(500).json({message: 'Something went wrong getting the data'});

		const getMessagesListForChannel = {
			[channelid]: {
				channelId: channelid,
				messages: messagesList.reverse()
			}
		};

		return res.status(200).json({message: 'messages fetched', getMessagesListForChannel});
	});
}

/**
 * GET /api/getunreadmessages/:userid
 */
export function allUnreadByUserId(req, res) {
	const { userid, username } = req.params;

	// 1) Get all channelId of ME
	// 2) find all unread messages by allchannelId
	// 3) populate for get the users infos

	Channel.find({ users: userid }).distinct('id').exec((err, channelIdArr) => {
		if (err) return res.status(500).json({ message: 'Something went wrong getting the data' });

		const pipeline = [
			{
				$match:
					{
						channelId: { $in: channelIdArr },
						'readBy.username': { $ne: username },
						author: { $ne: userid }
					}
			},
			{
				$group:
					{
						_id: '$channelId',
						lastMessageDate: { $last: '$created_at' },
						author: { $addToSet: '$author' },
						count: { $sum: 1 }
					}
			},
			{
				$sort: { count: -1 }
			},
			{
				$limit: 100
			}
		];

		Message.aggregate(pipeline).exec((errAgg, unreadMessagesRaw) => {
			if (errAgg) return res.status(500).json({ message: 'Something went wrong getting the data' });

			Message.populate(unreadMessagesRaw, { path: 'author', select: '_id username avatarMainSrc.avatar28' }, (errPop, unreadMessagesList) => {
				if (errPop) return res.status(500).json({ message: 'Something went wrong getting the data' });

				return res.status(200).json({ message: 'unread messages fetched', unreadMessagesList });
			});
		});
	});
}

/**
 * PUT /api/setreadmessages/:channelid
 */
export function setReadMessages(req, res) {
	const { username, userId } = req.body;
	const { channelid } = req.params;
	const dataObj = { at: Date.now(), username };

	Message.update({ channelId: channelid, author: { $ne: userId }, 'readBy.username': { $ne: username } }, {$push: { readBy: dataObj } }, { multi: true }).exec((err) => {
		if (err) return res.status(500).json({ message: 'Something went wrong getting the data' });

		return res.status(200).json({ message: 'messages make as read', channelId: channelid });
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
	allUnreadByUserId,
	setReadMessages,
	add
};
