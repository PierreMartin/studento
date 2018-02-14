export default (io) => {
	io.on('connection', (socket) => {
		/**
		 * @param {String} channelId - id of the channel to join
		 * */
		socket.on('join_channel', (channelId) => {
			socket.join(channelId);
		});

		/**
		 * @param {object}
		 * {
		 * 		newMessageData: {Object}
		 * 		message: {String}
		 * }
		 * */
		socket.on('new_message', (param) => {
			const channelId = param.newMessageData.channelId;

			// sending to all clients in room(channel) except sender :
			socket.broadcast.to(channelId).emit('new_message_server', param);
		});

		/**
		 * @param {object}
		 * {
		 * }
		 * */
		socket.on('typing', (data) => {
			socket.broadcast.to(data.channel).emit('typing bc', data.user);
		});

		/**
		 * @param {object}
		 * {
		 * }
		 * */
		socket.on('stop typing', (data) => {
			socket.broadcast.to(data.channel).emit('stop typing bc', data.user);
		});
	});
};
