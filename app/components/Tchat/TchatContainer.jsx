import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeTchatboxAction, fetchMessagesAction, createNewMessageAction, receiveNewMessageSocketAction } from '../../actions/tchat';
import ChatHeader from './TchatHeader';
import ChatMessages from './TchatMessages';
import ChatInput from './TchatInput';
import { Card } from 'semantic-ui-react';
import styles from './css/tchat.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);


class TchatContainer extends Component {
	constructor(props) {
		super(props);
		this.handleClickCloseChatBox = this.handleClickCloseChatBox.bind(this);
		this.handleChangeSendMessage = this.handleChangeSendMessage.bind(this);
		this.handleSubmitSendMessage = this.handleSubmitSendMessage.bind(this);

		this.state = {
			content: '',
			typing: false
		};
	}

	componentDidMount() {
		const { fetchMessagesAction, channelId, socket, receiveNewMessageSocketAction } = this.props;
		fetchMessagesAction(channelId);

		// join channel when tchatbox ready :
		socket.emit('join_channel', channelId);

		// receives messages sockets from user(s) front :
		socket.on('new_message_server', (messageReceive) => {
			if (channelId === messageReceive.newMessageData.channelId) {
				console.log('### receives messages sockets');
				receiveNewMessageSocketAction(messageReceive);
			}
		});
	}

	handleClickCloseChatBox() {
		const { closeTchatboxAction, channelId} = this.props;
		closeTchatboxAction(channelId);
	}

	handleChangeSendMessage(event) {
		const { socket } = this.props;

		this.setState({ content: event.target.value });

		if (event.target.value.length > 0 && !this.state.typing) {
			// socket.emit('typing', { user: userObj.username, channel: 'ezeze' });
			this.setState({ typing: true });
		}

		if (event.target.value.length === 0 && this.state.typing) {
			// socket.emit('stop typing', { user: userObj.username, channel: 'dsdssd' });
			this.setState({ typing: false });
		}
	}

	handleSubmitSendMessage(event) {
		event.preventDefault();
		const { createNewMessageAction, userMe, channelId, socket } = this.props;

		const newMessageData = {
			channelId,
			content: this.state.content,
			author: userMe._id,
			created_at: new Date().toISOString()
			// read_at: new Date().toISOString()
		};

		// action for send socket - We need to create a object for simulate the payload of Mongo population :
		const newMessageSocket = {};
		newMessageSocket.message = 'You have added a new message';
		newMessageSocket.newMessageData = newMessageData;
		newMessageSocket.newMessageData.author = { avatarMainSrc: { avatar28: userMe.avatarMainSrc.avatar28 }, username: userMe.username, _id: userMe._id };
		socket.emit('new_message', newMessageSocket);

		// action for persiste in database :
		createNewMessageAction(newMessageData);
		this.setState({ content: '', typing: false });
	}

	render() {
		const { userMe, position, messagesListOpen, channelId, channelsListOpen } = this.props;
		const users = (channelsListOpen && channelsListOpen[channelId] && channelsListOpen[channelId].users) ? channelsListOpen[channelId].users : [];
		const messages = (messagesListOpen && messagesListOpen[channelId] && messagesListOpen[channelId].messages) ? messagesListOpen[channelId].messages : [];

		return (
			<Card className={cx('chatbox-container', 'show')} style={{ right: (position * 290) + 'px' }}>
				<ChatHeader usersInChannel={users} userMe={userMe} handleClickCloseChatBox={this.handleClickCloseChatBox} />
				<Card.Content>
					<ChatMessages messagesList={messages} userMe={userMe} />
					<ChatInput handleChangeSendMessage={this.handleChangeSendMessage} handleSubmitSendMessage={this.handleSubmitSendMessage} value={this.state.content} />
				</Card.Content>
			</Card>
		);
	}
}

TchatContainer.propTypes = {
	closeTchatboxAction: PropTypes.func,
	fetchMessagesAction: PropTypes.func,
	createNewMessageAction: PropTypes.func,
	receiveNewMessageSocketAction: PropTypes.func,

	// receiveSocketAction: PropTypes.func,
	// receiveNewMessageAction: PropTypes.func,

	channelsListOpen: PropTypes.shape({
		id: PropTypes.string,
		users: PropTypes.object // populate
	}),

	messagesListOpen: PropTypes.shape({
		channelId: PropTypes.string,
		messages: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string,
			author: PropTypes.object, // populate
			content: PropTypes.string,
			created_at: PropTypes.string,
			read_at: PropTypes.string
		}))
	}),

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}).isRequired,

	socket: PropTypes.object.isRequired,
	channelId: PropTypes.string,
	position: PropTypes.number
};

function mapStateToProps(state) {
	return {
		channelsListOpen: state.tchat.channelsListOpen,
		messagesListOpen: state.tchat.messagesListOpen,
		userMe: state.userMe.data
	};
}

export default connect(mapStateToProps, { closeTchatboxAction, fetchMessagesAction, createNewMessageAction, receiveNewMessageSocketAction })(TchatContainer);
