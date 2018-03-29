import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUnreadMessagesAction, receiveUnreadMessagesAction, getChannelsByUserIdAction } from '../../actions/tchat';
import { Label, Icon } from 'semantic-ui-react';


class UnreadNotifMessages extends Component {
	constructor(props) {
		super(props);
		this.renderNbUnreadMessages = this.renderNbUnreadMessages.bind(this);
	}

	componentDidMount() {
		const { userMe, fetchUnreadMessagesAction, receiveUnreadMessagesAction, getChannelsByUserIdAction, socket } = this.props;

		// unreadMessages - update store first time:
		fetchUnreadMessagesAction(userMe._id, userMe.username);

		// unreadMessages - 1) join channels for receive sockets:
		// a) fetchAllMyChannels (one time):
		getChannelsByUserIdAction(userMe._id); // TODO finir ca

		// b) add my new channels (from me) + update store => in action

		// c) receive new channels (from others) + update store:
		/*
		socket.on('new_channel_server', (channelReceive) => { 	// channelReceive => { newChannelId: '123456789', userIdDestination: '559' };
			if (channelReceive.userIdDestination === userMe._id) {
				// dispatch(updateChannelsListAll(channelReceive.newChannelId));
			}
		});
		*/

		// d) join channel:
		// socket.emit('join_channel', this.props.channelsListArr);

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
	getChannelsByUserIdAction: PropTypes.func,

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

export default connect(mapStateToProps, { fetchUnreadMessagesAction, receiveUnreadMessagesAction, getChannelsByUserIdAction })(UnreadNotifMessages);
