import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

const renderUsersTyping = (typings) => {
	let usersToDisplay = '';

	if (typings.length > 0) {
		for (let i = 0; i < typings.length; i++) {
			const typing = typings[i];
			if (typing.username) {
				const multiUsers = (typings.length > 1 && i + 1 < typings.length) ? ', ' : '';
				usersToDisplay += `${typing.username} is typing...` + multiUsers;
			}
		}
	}

	return usersToDisplay;
};

const TchatInput = ({ handleChangeSendMessage, handleSubmitSendMessage, value, typings }) => {
	const usersTyping = renderUsersTyping(typings);

	return (
		<Form onSubmit={handleSubmitSendMessage}>
			<Form.Input placeholder={usersTyping || 'Your message...'} action={{ icon: 'edit', color: 'teal' }} value={value || ''} onChange={handleChangeSendMessage} />
		</Form>
	);
};


TchatInput.propTypes = {
	handleChangeSendMessage: PropTypes.func,
	handleSubmitSendMessage: PropTypes.func,
	value: PropTypes.string,

	typings: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string,
		channelId: PropTypes.string
	}))
};

export default TchatInput;
