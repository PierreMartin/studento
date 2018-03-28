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

		// update store if open component (reload in this context):
		fetchUnreadMessagesAction(userMe._id, userMe.username);

		// update store if receive sockets:
		socket.on('new_message_server', (messageReceive) => {
			// if (channelId === messageReceive.newMessageData.channelId) {
			console.log('### receives messages sockets ', messageReceive);
			// TODO MERDE ICI psk on fais un 'join_channel' uniquement quand la tchatBox est open
			// il faut souscrire tout MES channels quand CE component is componentDidMount
			receiveUnreadMessagesAction(messageReceive);
			// }
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
