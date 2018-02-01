import Channel from '../models/channel';

/**
 * GET /api/getchannels/:usermeid
 */
export function allByUserId(req, res) {
	const { usermeid } = req.params;

	// find by 'users[i]._id'
	Channel.find({ users: usermeid }).populate('users', '_id username').exec((err, channelsList) => {
		if (err) return res.status(500).json({message: 'Something went wrong getting the data'});

		return res.status(200).json({message: 'channels fetched', channelsList});
	});
}

/**
 * POST /api/addchannel/
 */
export function add(req, res) {
	const { userMeId, userFrontId } = req.body;

	const newChannel = {
		id: userMeId + userFrontId,
		users: [userMeId, userFrontId] // set here for populate
	};

	Channel.create(newChannel, (err) => {
		if (err) return res.status(500).json({message: 'add channel ko'});

		return res.status(200).json({message: 'You have added a new channel', newChannel});
	});
}

export default {
	allByUserId,
	add
};
