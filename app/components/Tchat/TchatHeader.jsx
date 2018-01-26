import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Button } from 'semantic-ui-react';

const renderParticipants = (participants, userMe) => {
	let participantsToDisplay = 'No yet participant';

	if (participants && participants.length > 0) {
		for (let i = 0; i < participants.length; i++) {
			const participant = participants[i];
			if (participant !== userMe._id) {
				const manyParticipants = (participants.length > 1) ? ', ' : ''; // if many participants
				participantsToDisplay += participant + manyParticipants; // TODO pas bon, populer et mettre 'participant.username'
			}
		}
	}

	return participantsToDisplay;
};

const TchatHeader = ({ participants, userMe, handleClickCloseChatBox }) => {
	return (
		<Card.Content>
			<Card.Header>
				{ renderParticipants(participants, userMe) }
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

	participants: PropTypes.array,
	handleClickCloseChatBox: PropTypes.func
};

export default TchatHeader;
