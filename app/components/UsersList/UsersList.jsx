import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Grid, Card, Icon, Image, Pagination } from 'semantic-ui-react';
import defaultAvatar150 from '../../images/default-avatar-150.png';
import classNames from 'classnames/bind';
import styles from './css/usersList.scss';

const cx = classNames.bind(styles);

const renderPagination = (handlePaginationChange, usersPagesCount, paginationIndexPage) => {
	return (
		<div className={cx('pagination')}>
			<Pagination
				activePage={paginationIndexPage}
				boundaryRange={1}
				siblingRange={1}
				onPageChange={handlePaginationChange}
				size="small"
				totalPages={usersPagesCount}
				ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
				prevItem={{ content: <Icon name="angle left" />, icon: true }}
				nextItem={{ content: <Icon name="angle right" />, icon: true }}
				firstItem={null}
				lastItem={null}
			/>
		</div>
	);
};

const UsersList = ({ users, usersPagesCount, handlePaginationChange, paginationIndexPage }) => {
	let usersNode = <div>No users</div>;

	if (users.length > 0) {
		usersNode = users.map((user, key) => {
			const src = user.avatarMainSrc && user.avatarMainSrc.avatar150 ? `/uploads/${user.avatarMainSrc.avatar150}` : defaultAvatar150;

			return (
				<Grid.Column key={key} mobile={6} tablet={4} computer={4}>
					<Card className={cx('user-container-item')}>
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

			<Grid className={cx('users-container')}>
				{usersNode}
			</Grid>

			{ usersPagesCount > 0 && renderPagination(handlePaginationChange, usersPagesCount, paginationIndexPage) }
		</div>
	);
};

UsersList.propTypes = {
	handlePaginationChange: PropTypes.func,
	usersPagesCount: PropTypes.number,
	paginationIndexPage: PropTypes.number,

	users: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})).isRequired
};

export default UsersList;
