import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Grid, Card, Icon, Image } from 'semantic-ui-react';
import defaultAvatar from '../../images/default-avatar.png';
import classNames from 'classnames/bind';
import styles from './css/usersList.scss';

const cx = classNames.bind(styles);


const UsersList = ({ users }) => {
	let usersNode = 'No users';

	if (users.length > 0) {
		usersNode = users.map((user, key) => {
			const src = user.avatarMainSrc && user.avatarMainSrc.avatar150 ? `/uploads/${user.avatarMainSrc.avatar150}` : defaultAvatar;

			return (
				<Grid.Column key={key} mobile={6} tablet={4} computer={4}>
					<Card className={cx('card-container')}>
						<Image as={Link} to={'/user/' + user._id} src={src} />
						<Card.Content>
							<Card.Header as={Link} to={'/user/' + user._id}>{user.username}</Card.Header>
							<Card.Meta>
								<span className="date">Joined in 2015</span>
							</Card.Meta>
							<Card.Description>{user.username} is a music producer living in Chicago studying Media Management at the New School</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<a><Icon name="user" />22 Friends</a>
						</Card.Content>
					</Card>
				</Grid.Column>
			);
		});
	}

	return (
		<div>
			<h3>List of users :</h3>

			<Grid className={cx('grid-container')}>
				{usersNode}
			</Grid>
		</div>
	);
};

UsersList.propTypes = {
	users: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})).isRequired
};

export default UsersList;
