import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Segment, Button, Header, Grid, Image, Icon } from 'semantic-ui-react';
import itemImage from '../../images/image.png';


const UserSingle = ({ user, userMeId }) => {
	// if my profile :
	const isMyProfile = user._id === userMeId;

	return (
		<div>
			<Grid>
				<Grid.Row>
					<Grid.Column width={3}>
						<Image src={itemImage} />
					</Grid.Column>
					<Grid.Column width={7}>
						<Header as="h2" >{user.username}</Header>
						Paris, France
						<br />
						Developer Front-End
					</Grid.Column>
					<Grid.Column width={6}>
						{ !isMyProfile ? <Button size="mini" primary><Icon name="add user" />Add</Button> : ''}
						{ !isMyProfile ? <Button size="mini" primary><Icon name="talk" />Message</Button> : ''}
						{ isMyProfile ? <Button as={Link} to="/settings" size="mini" primary><Icon name="settings" />Edit my profile</Button> : ''}
					</Grid.Column>
				</Grid.Row>

				<Grid.Row>
					<div>
						<Button circular color="facebook" icon="facebook" />
						<Button circular color="twitter" icon="twitter" />
						<Button circular color="linkedin" icon="linkedin" />
						<Button circular color="google plus" icon="google plus" />
					</div>
				</Grid.Row>

				<Grid.Row>
					<Grid.Column width={8}>
						Contact: {user.email}
					</Grid.Column>
					<Grid.Column width={8}>
						Age: 32
					</Grid.Column>
				</Grid.Row>
			</Grid>

			<div>
				<Header as="h3" attached="top">Description</Header>
				<Segment attached>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
					laboris nisi ut aliquip ex ea commodo consequat.
				</Segment>
			</div>

			<div>
				<Header as="h3" attached="top">Studing</Header>
				<Segment attached>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
					laboris nisi ut aliquip ex ea commodo consequat.
				</Segment>
			</div>
		</div>
	);
};

UserSingle.propTypes = {
	user: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}).isRequired,

	userMeId: PropTypes.string
};

export default UserSingle;
