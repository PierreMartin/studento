import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Segment, Button, Header, Grid, Image, Icon } from 'semantic-ui-react';
import defaultAvatar from '../../images/default-avatar.png';
import classNames from 'classnames/bind';
import styles from './css/userSingle.scss';

const cx = classNames.bind(styles);

const renderAvatarsList = (userFront) => {
	if (!userFront.avatarsSrc) return '';

	return userFront.avatarsSrc.map((avatar, key) => {
		return (
			<a href={`/uploads/${avatar.avatar150}`} key={key} className={cx('thumbnails')} >
				<Image src={`/uploads/${avatar.avatar80}`} />
			</a>
		);
	});
};

const UserSingle = ({ userFront, userMeId, handleOpenChatBox }) => {
	// if my profile :
	const isMyProfile = userFront._id === userMeId;
	const src = userFront.avatarMainSrc && userFront.avatarMainSrc.avatar150 ? `/uploads/${userFront.avatarMainSrc.avatar150}` : defaultAvatar;
	const avatarsList = renderAvatarsList(userFront);

	return (
		<div>
			<Grid>
				<Grid.Row>
					<Grid.Column width={4}>
						<Image src={src} />
					</Grid.Column>
					<Grid.Column width={6}>
						<Header as="h2" >{userFront.username}</Header>
						{userFront.city ? userFront.city + ', ' : ''} {userFront.country}
						<br />
						{userFront.domain} {userFront.position ? '(' + userFront.position + ')' : ''}
						<br />
						{userFront.schoolName ? 'At ' + userFront.schoolName : ''}
					</Grid.Column>
					<Grid.Column width={6}>
						{ !isMyProfile ? <Button size="mini" primary><Icon name="add user" />Add</Button> : ''}
						{ !isMyProfile ? <Button size="mini" primary onClick={handleOpenChatBox} ><Icon name="talk" />Message</Button> : ''}
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
						Contact: {userFront.email}
					</Grid.Column>
					<Grid.Column width={8}>
						{userFront.age ? 'Age: ' + userFront.age : ''}
					</Grid.Column>
				</Grid.Row>
			</Grid>

			{ (avatarsList.length > 0) ? <Segment className={cx('thumbnails-container')}>{ avatarsList }</Segment> : '' }

			<div>
				<Header as="h3" attached="top">Infos</Header>
				<Segment attached>
					<div>firstName: {userFront.firstName}</div>
					<div>lastName: {userFront.lastName}</div>
					<div>genre: {userFront.gender}</div>
				</Segment>
			</div>

			<div>
				<Header as="h3" attached="top">About</Header>
				<Segment attached>
					{userFront.about}
				</Segment>
			</div>
		</div>
	);
};

UserSingle.propTypes = {
	userFront: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}).isRequired,

	handleOpenChatBox: PropTypes.func.isRequired,
	userMeId: PropTypes.string
};

export default UserSingle;
