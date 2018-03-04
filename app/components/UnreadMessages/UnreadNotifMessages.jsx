import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUnreadMessagesAction } from '../../actions/tchat';
import { Label, Icon } from 'semantic-ui-react';


class UnreadNotifMessages extends Component {
	constructor(props) {
		super(props);
		this.renderNbUnreadMessages = this.renderNbUnreadMessages.bind(this);
	}

	componentDidMount() {
		const { userMe, fetchUnreadMessagesAction, socket } = this.props;
		fetchUnreadMessagesAction(userMe._id); // update store
		// socket.on('new_message_server', () => {}); // update store
	}

	renderNbUnreadMessages(unreadMessages) {
		let nbUnreadMessages = 0;

		if (Object.keys(unreadMessages).length > 0) {
			for (const key in unreadMessages) {
				if (unreadMessages[key]) {
					const unreadMessage = unreadMessages[key];
					if (unreadMessage.count) nbUnreadMessages += unreadMessage.count;
				}
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

export default connect(mapStateToProps, { fetchUnreadMessagesAction })(UnreadNotifMessages);
