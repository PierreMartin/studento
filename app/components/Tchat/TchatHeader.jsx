import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Button } from 'semantic-ui-react';


const TchatHeader = ({ userFront, handleClickCloseChatBox }) => {
	return (
		<Card.Content>
			<Card.Header>
				{userFront.username}
				<Button icon size="mini" floated="right" onClick={handleClickCloseChatBox} ><Icon name="close" /></Button>
			</Card.Header>
		</Card.Content>
	);
};

TchatHeader.propTypes = {
	userFront: PropTypes.object,
	handleClickCloseChatBox: PropTypes.func
};

export default TchatHeader;
