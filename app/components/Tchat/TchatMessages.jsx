import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Comment } from 'semantic-ui-react';
import styles from './css/tchat.scss';
import avatar1 from '../../images/elliot.jpg';
import avatar2 from '../../images/jenny.jpg';

const cx = classNames.bind(styles);

// juste un bouchon :
const renderItemsMessage = (userFront, userMe) => {
	const nodeItemsMessages = [];

	for (let i = 1; i <= 20; i++) {
		const sender = i % 2 === 0;

		nodeItemsMessages.push(
			<Comment className={cx({sent: sender})} key={i}>
				<Comment.Avatar className={cx('avatar')} src={sender ? avatar1 : avatar2} />
				<Comment.Content className={cx('content')}>
					<Comment.Author as="a">{ sender ? userFront.username : userMe.username }</Comment.Author>
					<Comment.Metadata><div>5 days ago</div></Comment.Metadata>
					<Comment.Text>Dude, this is awesome. Thanks so much { i }</Comment.Text>
				</Comment.Content>
			</Comment>
		);
	}

	return nodeItemsMessages;
};

const TchatMessages = ({ newMessageState, userFront, userMe }) => {
	return (
		<Comment.Group className={cx('chatbox-messages-container')}>
			{ renderItemsMessage(userFront, userMe) }
		</Comment.Group>
	);
};


TchatMessages.propTypes = {
	userFront: PropTypes.object,
	userMe: PropTypes.object,
	newMessageState: PropTypes.string
};

export default TchatMessages;
