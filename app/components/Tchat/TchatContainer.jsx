import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeTchatboxAction, fetchMessagesAction, createNewMessageAction } from '../../actions/tchat';
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
		const { fetchMessagesAction, channelId } = this.props;
		fetchMessagesAction(channelId);
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
		const { createNewMessageAction, userMe, socket, channelId } = this.props;

		const newMessageData = {
			channelId,
			content: this.state.content,
			authorId: userMe._id,
			created_at: new Date().toISOString()
			// read_at: new Date().toISOString()
		};

		console.log(newMessageData);

		// socket.emit('new message', newMessage); // send to sockets
		createNewMessageAction(newMessageData);
		this.setState({ content: '', typing: false });
	}

	render() {
		const { userMe, position, messagesList, channelId } = this.props;
		const participants = (messagesList[channelId] && messagesList[channelId].between) ? messagesList[channelId].between : [];
		const messages = (messagesList[channelId] && messagesList[channelId].messages) ? messagesList[channelId].messages : [];

		return (
			<Card className={cx('chatbox-container', 'show')} style={{ right: (position * 290) + 'px' }}>
				<ChatHeader participants={participants} userMe={userMe} handleClickCloseChatBox={this.handleClickCloseChatBox} />
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

	// receiveSocketAction: PropTypes.func,
	// receiveNewMessageAction: PropTypes.func,

	messagesList: PropTypes.shape({
		channelId: PropTypes.string,
		between: PropTypes.array,
		messages: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string,
			authorId: PropTypes.string,
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
		messagesList: state.tchat.messagesList,
		userMe: state.userMe.data
	};
}

export default connect(mapStateToProps, { closeTchatboxAction, fetchMessagesAction, createNewMessageAction })(TchatContainer);
