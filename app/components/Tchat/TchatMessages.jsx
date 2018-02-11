import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Comment } from 'semantic-ui-react';
import styles from './css/tchat.scss';
import avatar1 from '../../images/elliot.jpg';
import avatar2 from '../../images/jenny.jpg';

const cx = classNames.bind(styles);

const renderMessages = (messagesList, userMe) => {
	let messagesNode = 'No yet messages';

	if (messagesList && messagesList.length > 0) {
		messagesNode = messagesList.map((message, key) => {
			const senderIsMe = message.author._id === userMe._id;
			return (
				<Comment className={cx({sent: senderIsMe})} key={key}>
					<Comment.Avatar className={cx('avatar')} src={senderIsMe ? avatar1 : avatar2} />
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
};

const TchatMessages = ({ messagesList, userMe }) => {
	return (
		<Comment.Group className={cx('chatbox-messages-container')}>
			{ renderMessages(messagesList, userMe) }
		</Comment.Group>
	);
};


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
		read_at: PropTypes.string
	}))
};

export default TchatMessages;
