import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isBoxOpenAction } from '../../actions/tchat';
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
		this.handleClickCloseChatBox 	= this.handleClickCloseChatBox.bind(this);
		this.handleChangeSendMessage 	= this.handleChangeSendMessage.bind(this);
		this.handleSubmitSendMessage 	= this.handleSubmitSendMessage.bind(this);

		this.state = {
			text: '',
			typing: false
		};
	}

	componentDidMount() {
		// this.props.fetchMessagesAction(this.props.userMe._id, this.props.channelId);
	}

	handleClickCloseChatBox() {
		this.props.isBoxOpenAction(false);
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
		const { userMe, userFront, socket } = this.props;
		const text = this.state.text;

		const newMessage = {
			id: Date.now(),
			channelId: '123',
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
		const { userFront, userMe, isBoxOpen } = this.props;

		return (
			<Card className={cx('chatbox-container', { show: isBoxOpen })} style={{ right: '30px' }}>
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
	isBoxOpenAction: PropTypes.func,
	isBoxOpen: PropTypes.bool,

	// receiveSocketAction: PropTypes.func,
	// createNewChannelAction: PropTypes.func,
	// createNewMessageAction: PropTypes.func,
	// receiveNewMessageAction: PropTypes.func,
	// newMessageState: PropTypes.string,
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

	socket: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		isBoxOpen: state.tchat.isBoxOpen,
		// newMessageState: state.tchat.newMessage,
		// channelsList: state.tchat.channelsList,
		userMe: state.userMe.data,
		userFront: state.users.one
	};
}

export default connect(mapStateToProps, { isBoxOpenAction })(TchatContainer);
