import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUnreadMessagesAction, receiveUnreadMessagesAction, fetchChannelsByUserIdAction, updateChannelsListAction } from '../../actions/tchat';
import { Label, Icon } from 'semantic-ui-react';


class UnreadNotifMessages extends Component {
	constructor(props) {
		super(props);
		this.renderNbUnreadMessages = this.renderNbUnreadMessages.bind(this);
	}

	componentDidMount() {
		const { userMe, fetchUnreadMessagesAction, receiveUnreadMessagesAction, fetchChannelsByUserIdAction, updateChannelsListAction, socket } = this.props;

		// unreadMessages - update store first time:
		fetchUnreadMessagesAction(userMe._id, userMe.username);

		/********************* Join all channels *********************/
		// a) fetchAllMyChannels (one time):
		fetchChannelsByUserIdAction(userMe._id);

		// b) add my new channels (from me) + update store => in action

		// c) receive new channels (from others) + update store:
		socket.on('new_channel_server', (channelReceive) => {
			if (channelReceive.usersIdDestination && channelReceive.newChannelId) {
				for (let i = 0; i < channelReceive.usersIdDestination.length; i++) {
					if (channelReceive.usersIdDestination[i] === userMe._id) {
						updateChannelsListAction(channelReceive.newChannelId);
						break;
					}
				}
			}
		});

		// d) join channels => in componentDidUpdate()

		/********************* Receive all messages by sockets:  *********************/
		socket.on('new_message_server', (messageReceive) => {
			console.log('### receives messages sockets ', messageReceive);
			receiveUnreadMessagesAction(messageReceive);
		});
	}

	componentDidUpdate(prevProps) {
		const { socket, channelsListAll } = this.props;

		if (prevProps.channelsListAll !== channelsListAll) {
			// join channels:
			socket.emit('join_channel', channelsListAll);
		}
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
	fetchChannelsByUserIdAction: PropTypes.func,
	updateChannelsListAction: PropTypes.func,

	unreadMessages: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		author: PropTypes.array, // populate
		count: PropTypes.number
	})),

	channelsListAll: PropTypes.array,

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
		channelsListAll: state.tchat.channelsListAll,
		unreadMessages: state.tchat.unreadMessages
	};
}

export default connect(mapStateToProps, { fetchUnreadMessagesAction, receiveUnreadMessagesAction, fetchChannelsByUserIdAction, updateChannelsListAction })(UnreadNotifMessages);
