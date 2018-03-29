import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUnreadMessagesAction, receiveUnreadMessagesAction } from '../../actions/tchat';
import { Label, Icon } from 'semantic-ui-react';


class UnreadNotifMessages extends Component {
	constructor(props) {
		super(props);
		this.renderNbUnreadMessages = this.renderNbUnreadMessages.bind(this);
	}

	componentDidMount() {
		const { userMe, fetchUnreadMessagesAction, receiveUnreadMessagesAction, socket } = this.props;

		// unreadMessages - update store first time:
		fetchUnreadMessagesAction(userMe._id, userMe.username);

		// unreadMessages - 1) join channels for receive sockets:
		// 1) fetchAllMyChannels (1X)
		// 2) add my news channels (from me) + update store
		// 3) reveice news channels (from others) + update store
		// 4) ICI on fera   socket.emit('join_channel', this.props.channelsListArr);

		/*
		### Seul solution trouvé pour le 3) :
		receiveAllSocketsWhenAChannelCreate = {
			newChannelId: '123456789',
			userIdDestination: '559'
		}
		if (receiveAllSocketsWhenAChannelCreate.userIdDestination === userMe._id) { Update store ( state.push(newChannelId) ) }
		*/

		// unreadMessages - 2) update store if receive sockets:
		socket.on('new_message_server', (messageReceive) => {
			console.log('### receives messages sockets ', messageReceive);
			receiveUnreadMessagesAction(messageReceive);
		});
	}

	renderNbUnreadMessages(unreadMessages) {
		let nbUnreadMessages = 0;

		if (unreadMessages.length > 0) {
			for (let i = 0; i < unreadMessages.length; i++) {
				const unreadMessage = unreadMessages[i];
				if (unreadMessage.count) nbUnreadMessages += unreadMessage.count;
			}
		}

		return nbUnreadMessages;
	}

	render() {
		const { unreadMessages } = this.props;
		const nbUnreadMessages = this.renderNbUnreadMessages(unreadMessages);

		return (
			<span>
				<Icon name="mail" />
				<Label circular color="red" size="mini" floating>{nbUnreadMessages}</Label>
			</span>
		);
	}
}

UnreadNotifMessages.propTypes = {
	socket: PropTypes.object.isRequired,
	fetchUnreadMessagesAction: PropTypes.func,
	receiveUnreadMessagesAction: PropTypes.func,

	unreadMessages: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		author: PropTypes.array, // populate
		count: PropTypes.number
	})),

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})
};

function mapStateToProps(state) {
	return {
		userMe: state.userMe.data,
		unreadMessages: state.tchat.unreadMessages
	};
}

export default connect(mapStateToProps, { fetchUnreadMessagesAction, receiveUnreadMessagesAction })(UnreadNotifMessages);
