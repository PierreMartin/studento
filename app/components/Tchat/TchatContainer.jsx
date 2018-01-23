import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeTchatboxAction } from '../../actions/tchat';
// import { getChannels } from './../../api';
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
			text: '',
			typing: false
		};
	}

	componentDidMount() {
		const { userMe, channelId} = this.props;
		// this.props.fetchMessagesAction(userMe._id, channelId);
	}

	handleClickCloseChatBox() {
		const { closeTchatboxAction, channelId} = this.props;
		closeTchatboxAction(channelId);
	}

	handleChangeSendMessage(event) {
		const { socket } = this.props;

		this.setState({ text: event.target.value });

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
		const { userMe, userFront, socket, channelId } = this.props;
		const text = this.state.text;

		const newMessage = {
			id: Date.now(),
			channelId,
			text,
			userAuthorId: userMe._id,
			userTargetedId: userFront._id,
			time: Date.now()
		};

		console.log(newMessage);

		// socket.emit('new message', newMessage); // send to sockets
		// createNewMessageAction(newMessage.text); // send to state redux - for the re-render React
		this.setState({ text: '', typing: false });
	}

	render() {
		const { userFront, userMe, position } = this.props;

		return (
			<Card className={cx('chatbox-container', 'show')} style={{ right: (position * 290) + 'px' }}>
				<ChatHeader userFront={userFront} handleClickCloseChatBox={this.handleClickCloseChatBox} />
				<Card.Content>
					<ChatMessages newMessageState="hjh jhjhjhjhk jk" userFront={userFront} userMe={userMe} />
					<ChatInput handleChangeSendMessage={this.handleChangeSendMessage} handleSubmitSendMessage={this.handleSubmitSendMessage} value={this.state.text} />
				</Card.Content>
			</Card>
		);
	}
}

TchatContainer.propTypes = {
	closeTchatboxAction: PropTypes.func,

	// receiveSocketAction: PropTypes.func,
	// createNewChannelAction: PropTypes.func,
	// createNewMessageAction: PropTypes.func,
	// receiveNewMessageAction: PropTypes.func,
	// messagesList: PropTypes.string, // TODO   messagesList.userFront.username | messagesList.userFront.avatar80 |        messagesList.userFront.message | messagesList.userMe.message
	// channelsList: PropTypes.array,

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}).isRequired,

	userFront: PropTypes.shape({
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
		// messagesList: state.tchat.messagesList,
		userMe: state.userMe.data,
		userFront: state.users.one
	};
}

export default connect(mapStateToProps, { closeTchatboxAction })(TchatContainer);
