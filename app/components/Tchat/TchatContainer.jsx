import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeTchatboxAction, fetchMessagesAction, createNewMessageAction, setReadMessagesAction } from '../../actions/tchat';
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
		this.handleClickMakeReadMessages = this.handleClickMakeReadMessages.bind(this);

		this.state = {
			content: '',
			isTyping: false,
			typingArr: []
		};
	}

	componentDidMount() {
		const { fetchMessagesAction, channelId, socket } = this.props;
		fetchMessagesAction(channelId);

		// join channel when tchatbox ready :  // already do in UnreadNotifMessages
		/*
		socket.emit('join_channel', channelId);
		*/

		// receives messages sockets from user(s) in channel : // already do in UnreadNotifMessages
		/*
		socket.on('new_message_server', (messageReceive) => {
			if (channelId === messageReceive.newMessageData.channelId) {
				addOrReceiveNewMessageAction(messageReceive);
			}
		});
		*/

		// receives typing start from user(s) in channel :
		socket.on('start_typing_server', (typingReceive) => {
			const newTypingArr = JSON.parse(JSON.stringify(this.state.typingArr));
			newTypingArr.push(typingReceive);

			if (channelId === typingReceive.channelId) this.setState({ typingArr: newTypingArr });
		});

		// receives typing stop from user(s) in channel :
		socket.on('stop_typing_server', (typingReceive) => {
			const newTypingArr = this.state.typingArr.filter(typing => typing.username !== typingReceive.username);

			if (channelId === typingReceive.channelId) this.setState({ typingArr: newTypingArr });
		});
	}

	componentWillUnmount() {
		// TODO prevent the   addOrReceiveNewMessageAction(messageReceive);
	}

	handleClickCloseChatBox() {
		const { closeTchatboxAction, channelId, socket, userMe } = this.props;

		socket.emit('stop_typing', { username: userMe.username, channelId });
		closeTchatboxAction(channelId);
	}

	handleChangeSendMessage(event) {
		const { socket, channelId, userMe } = this.props;

		this.setState({ content: event.target.value });

		if (event.target.value.length > 0 && !this.state.isTyping) {
			socket.emit('start_typing', { username: userMe.username, channelId });
			this.setState({ isTyping: true });
		}

		if (event.target.value.length === 0 && this.state.isTyping) {
			socket.emit('stop_typing', { username: userMe.username, channelId });
			this.setState({ isTyping: false });
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
		};

		// action for persiste in database :
		createNewMessageAction(newMessageData);

		// action for send socket - We need to create a object for simulate the payload of Mongo population :
		const newMessageSocket = {};
		newMessageSocket.message = 'You have added a new message';
		newMessageSocket.newMessageData = newMessageData;
		newMessageSocket.newMessageData.author = { avatarMainSrc: { avatar28: userMe.avatarMainSrc.avatar28 }, username: userMe.username, _id: userMe._id };
		socket.emit('new_message', newMessageSocket);

		// action for send stop_typing via socket :
		socket.emit('stop_typing', { username: userMe.username, channelId });
		this.setState({ content: '', isTyping: false});
	}

	handleClickMakeReadMessages() {
		const { setReadMessagesAction, channelId, userMe } = this.props;
		setReadMessagesAction(channelId, { username: userMe.username, userId: userMe._id });
	}

	render() {
		const { userMe, position, messagesListOpen, channelId, channelsListOpen } = this.props;
		const users = (channelsListOpen && channelsListOpen[channelId] && channelsListOpen[channelId].users) ? channelsListOpen[channelId].users : [];
		const messages = (messagesListOpen && messagesListOpen[channelId] && messagesListOpen[channelId].messages) ? messagesListOpen[channelId].messages : [];

		return (
			<Card className={cx('chatbox-container', 'show')} style={{ right: (position * 290) + 'px' }} >
				<ChatHeader usersInChannel={users} userMe={userMe} handleClickCloseChatBox={this.handleClickCloseChatBox} />
				<Card.Content onClick={this.handleClickMakeReadMessages} >
					<ChatMessages messagesList={messages} userMe={userMe} />
					<ChatInput handleChangeSendMessage={this.handleChangeSendMessage} handleSubmitSendMessage={this.handleSubmitSendMessage} value={this.state.content} typings={this.state.typingArr} />
				</Card.Content>
			</Card>
		);
	}
}

TchatContainer.propTypes = {
	closeTchatboxAction: PropTypes.func,
	fetchMessagesAction: PropTypes.func,
	createNewMessageAction: PropTypes.func,
	setReadMessagesAction: PropTypes.func,

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
			readBy: PropTypes.array
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

export default connect(mapStateToProps, { closeTchatboxAction, fetchMessagesAction, createNewMessageAction, setReadMessagesAction })(TchatContainer);
