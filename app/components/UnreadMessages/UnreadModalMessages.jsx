import React from 'react';
import PropTypes from 'prop-types';
import { Label, Card, Image } from 'semantic-ui-react';
import moment from 'moment';
import { pathImage } from '../../../config/app';
import defaultAvatar28 from '../../images/default-avatar-28.png';
import classNames from 'classnames/bind';
import styles from './css/unreadModalMessages.scss';

const cx = classNames.bind(styles);

const renderUsersInChannel = (usersInChannel) => {
	let usersToDisplay = '';

	if (usersInChannel && usersInChannel.length > 0) {
		for (let i = 0; i < usersInChannel.length; i++) {
			const multiUsers = (usersInChannel.length > 1 && i < usersInChannel.length - 1) ? ', ' : '';
			usersToDisplay += usersInChannel[i].username + multiUsers;
		}
	}

	return usersToDisplay;
};

const renderThreadsList = (handleClickOpenTchatBox, unreadMessages) => {
	if (unreadMessages.length === 0) {
		return (<Card.Content className={cx('content')} ><Card.Header as="span" className={cx('header')} >No thread(s)</Card.Header></Card.Content>);
	}

	return unreadMessages.map((thread, key) => {
		let pathImg = '';
		let src = '';

		if (thread && thread.author && thread.author[0]) {
			pathImg = thread.author[0].provider !== 'local' ? '' : pathImage;
			src = thread.author[0].avatarMainSrc && thread.author[0].avatarMainSrc.avatar28 ? `${pathImg}${thread.author[0].avatarMainSrc.avatar28}` : defaultAvatar28;
		}

		const lastMessageDate = moment(thread.lastMessageDate).format('MMMM Do LT');

		return (
			<Card.Content className={cx('content')} key={key} as="a" onClick={handleClickOpenTchatBox.bind(this, thread)} >
				<Image circular floated="left" size="mini" src={src} />
				<Card.Header as="span" className={cx('header')} >{ renderUsersInChannel(thread.author) }</Card.Header>
				<Card.Meta as="span" className={cx('meta')} >{lastMessageDate}</Card.Meta>
				{/*<Card.Description className={cx('description')} >Lorem ipsum dolor sit amet...</Card.Description>*/}
				<Label className={cx('label')} color="red" size="mini">{thread.count}</Label>
			</Card.Content>
		);
	});
};

const UnreadModalMessages = ({ handleClickOpenTchatBox, unreadMessages }) => {
	const threadsList = renderThreadsList(handleClickOpenTchatBox, unreadMessages);

	return (
		<Card.Group className={cx('unreadModalMessagesContainer')}>
			<Card>
				<Card.Content><Card.Header>Recent messages</Card.Header></Card.Content>
				{threadsList}
			</Card>
		</Card.Group>
	);
};

UnreadModalMessages.propTypes = {
	handleClickOpenTchatBox: PropTypes.func.isRequired,

	unreadMessages: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string, // channelId
		author: PropTypes.array, // populate
		count: PropTypes.number,
		lastMessageDate: PropTypes.string
	}))
};

export default UnreadModalMessages;
