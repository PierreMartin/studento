import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';


const TchatInput = ({ handleChangeSendMessage, handleSubmitSendMessage, value }) => {
	return (
		<Form onSubmit={handleSubmitSendMessage}>
			<Form.Input placeholder="Your message..." action={{ icon: 'edit', color: 'teal' }} value={value || ''} onChange={handleChangeSendMessage} />
		</Form>
	);
};


TchatInput.propTypes = {
	handleChangeSendMessage: PropTypes.func,
	handleSubmitSendMessage: PropTypes.func,
	value: PropTypes.string
};

export default TchatInput;
