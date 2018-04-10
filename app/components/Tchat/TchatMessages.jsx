import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Comment } from 'semantic-ui-react';
import styles from './css/tchat.scss';
import defaultAvatar28 from '../../images/default-avatar-28.png';

const cx = classNames.bind(styles);

class TchatMessages extends Component {
	constructor(props) {
		super(props);
		this.renderMessages = this.renderMessages.bind(this);
	}

	renderMessages(messagesList, userMe) {
		let messagesNode = 'No yet messages';

		if (messagesList && messagesList.length > 0) {
			messagesNode = messagesList.map((message, key) => {
				const senderIsMe = message.author._id === userMe._id;
				const src = message.author.avatarMainSrc && message.author.avatarMainSrc.avatar28 ? `/uploads/${message.author.avatarMainSrc.avatar28}` : defaultAvatar28;

				return (
					<Comment className={cx({sent: senderIsMe})} key={key}>
						<Comment.Avatar className={cx('avatar')} src={src} />
						<Comment.Content className={cx('content')}>
							<Comment.Author as="a">{message.author.username}</Comment.Author>
							<Comment.Metadata><div>{message.created_at}</div></Comment.Metadata>
							<Comment.Text>{message.content}</Comment.Text>
						</Comment.Content>
					</Comment>
				);
			});
		}

		return messagesNode;
	}

	render() {
		const { messagesList, userMe } = this.props;

		return (
			<Comment.Group className={cx('chatbox-messages-container')}>
				{ this.renderMessages(messagesList, userMe) }
			</Comment.Group>
		);
	}
}


TchatMessages.propTypes = {
	userMe: PropTypes.shape({
		_id: PropTypes.string,
		username: PropTypes.string
	}),

	messagesList: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		author: PropTypes.object, // populate
		content: PropTypes.string,
		created_at: PropTypes.string,
		readBy: PropTypes.array
	}))
};

export default TchatMessages;
