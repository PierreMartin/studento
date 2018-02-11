import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Button } from 'semantic-ui-react';

const renderUsersInChannel = (usersInChannel, userMe) => {
	let usersToDisplay = '';

	if (usersInChannel && usersInChannel.length > 0) {
		for (let i = 0; i < usersInChannel.length; i++) {
			const userInChan = usersInChannel[i];
			if (userInChan._id !== userMe._id) {
				const multiUsers = (usersInChannel.length > 2 && i < usersInChannel.length) ? ', ' : '';
				usersToDisplay += userInChan.username + multiUsers;
			}
		}
	}

	return usersToDisplay;
};

const TchatHeader = ({ usersInChannel, userMe, handleClickCloseChatBox }) => {
	return (
		<Card.Content>
			<Card.Header>
				{ renderUsersInChannel(usersInChannel, userMe) }
				<Button icon size="mini" floated="right" onClick={handleClickCloseChatBox} ><Icon name="close" /></Button>
			</Card.Header>
		</Card.Content>
	);
};

TchatHeader.propTypes = {
	userMe: PropTypes.shape({
		_id: PropTypes.string,
		username: PropTypes.string
	}),

	usersInChannel: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		username: PropTypes.string
	})),

	handleClickCloseChatBox: PropTypes.func
};

export default TchatHeader;
