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
 * GET /api/getchannelbyuserfrontid/:usermeid/:userfrontid
 */
export function allByUserFrontId(req, res) {
	const { usermeid, userfrontid } = req.params;

	// find by 'users[i]._id'
	Channel.findOne({ users: { $all: [usermeid, userfrontid] } }).populate('users', '_id username').exec((err, chan) => {
		if (err) return res.status(500).json({message: 'Something went wrong getting the data'});

		const getChannel = (chan && chan.id) ? { [chan.id]: chan } : false;

		return res.status(200).json({message: 'channel fetched', getChannel});
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

		Channel.findOne({ users: { $all: [userMeId, userFrontId] } }).populate('users', '_id username').exec((err, chan) => {
			if (err) return res.status(500).json({message: 'Something went wrong getting the data'});

			const newChannel = (chan && chan.id) ? { [chan.id]: chan } : false;

			return res.status(200).json({message: 'New channel fetched', newChannel});
		});
	});
}

export default {
	allByUserId,
	allByUserFrontId,
	add
};
