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
		 * 		id: {String}
		 * 		channelID: {String}
		 * 		text: {String}
		 * 		author: {Object}
		 * 		targetedUserID: {String}
		 * }
		 * */
		socket.on('new message', (param) => {
			const channelID = param.channelID;
			console.log('channelID ', channelID);

			socket.join(channelID);
			socket.broadcast.to(channelID).emit('new bc message', param);
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
