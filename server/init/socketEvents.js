export default (io) => {
	io.on('connection', (socket) => {
		/**
		 * @param {Array} channelsList - list of the id of the channels to join
		 * */
		socket.on('join_channel', (channelsList) => {
			for (let i = 0; i < channelsList.length; i++) {
				socket.join(channelsList[i]);
			}
		});

		/**
		 * @param {object}
		 * {
		 * 		newChannelId: {Object}
		 * 		usersIdDestination: {Object}
		 * }
		 * */
		socket.on('new_channel', (param) => {
			// sending to all clients except sender :
			socket.broadcast.emit('new_channel_server', param);
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
		 * 		username: {String}
		 * 		channelId: {String}
		 * 		isTyping: {Boolean}
		 * }
		 * */
		socket.on('start_typing', (param) => {
			socket.broadcast.to(param.channelId).emit('start_typing_server', param);
		});

		/**
		 * @param {object}
		 * {
		 * 		username: {String}
		 * 		channelId: {String}
		 * 		isTyping: {Boolean}
		 * }
		 * */
		socket.on('stop_typing', (param) => {
			socket.broadcast.to(param.channelId).emit('stop_typing_server', param);
		});
	});
};
