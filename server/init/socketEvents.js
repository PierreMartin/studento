export default (io) => {
	// var users  = {};
	// users[socket.id] = userName;

	io.on('connection', (socket) => {
		socket.join('Lobby');

		/**
		 * @param {string} userName - optionnal
		 * */
		/*
		 socket.on('login', function(userName) {
		 console.log('User '+ socket.id + ' connected => ' + userName);

		 socket.emit('receiveSocket', { socketID: socket.id, userName })
		 });
		 */

		/**
		 * @param {object}
		 * {
		 * 		_id: {String}
		 * 		channelId: {String}
		 * 		text: {String}
		 * 		author: {Object}
		 * }
		 * */
		socket.on('new_message', (param) => {
			const channelId = param.channelId;
			console.log('new_message param ', param);

			socket.join(channelId);
			socket.broadcast.to(channelId).emit('new_message_server', param);
			// OU // socket.broadcast.to(targeted_socketID).emit('new bc message', param);
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
