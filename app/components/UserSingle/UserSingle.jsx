import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Segment, Button, Header, Grid, Image, Icon } from 'semantic-ui-react';
import defaultAvatar from '../../images/default-avatar.png';


const UserSingle = ({ user, userMeId }) => {
	// if my profile :
	const isMyProfile = user._id === userMeId;
	const src = user.avatarMainSrc && user.avatarMainSrc.avatar150 ? `/uploads/${user.avatarMainSrc.avatar150}` : defaultAvatar;

	return (
		<div>
			<Grid>
				<Grid.Row>
					<Grid.Column width={3}>
						<Image src={src} />
					</Grid.Column>
					<Grid.Column width={7}>
						<Header as="h2" >{user.username}</Header>
						{user.city ? user.city + ', ' : ''} {user.country}
						<br />
						{user.domain} {user.position ? '(' + user.position + ')' : ''}
						<br />
						{user.schoolName ? 'At ' + user.schoolName : ''}
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
						{user.age ? 'Age: ' + user.age : ''}
					</Grid.Column>
				</Grid.Row>
			</Grid>

			<div>
				<Header as="h3" attached="top">Infos</Header>
				<Segment attached>
					<div>firstName: {user.firstName}</div>
					<div>lastName: {user.lastName}</div>
					<div>genre: {user.gender}</div>
				</Segment>
			</div>

			<div>
				<Header as="h3" attached="top">About</Header>
				<Segment attached>
					{user.about}
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
