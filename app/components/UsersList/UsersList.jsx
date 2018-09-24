import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Icon, Pagination, Image } from 'semantic-ui-react';
import moment from 'moment';
import { pathImage } from './../../../config/app';
import classNames from 'classnames/bind';
import styles from './css/usersList.scss';

const cx = classNames.bind(styles);

const renderUsersList = (users) => {
	if (users.length === 0) return <div>No yet users</div>;

	return users.map((user, key) => {
		const userJoinedDate = moment(user.created_at).format('Y'); // TODO a ajouter dans model
		const src = user.avatarMainSrc && user.avatarMainSrc.avatar150 && `${pathImage}/${user.avatarMainSrc.avatar150}`;

		return (
			<Link key={key} to={`/user/${user._id}`} className={cx('user-container-item')}>
				<div className={cx('user-header')}>
					<div className={cx('avatar')}>{ src ? <Image circular src={src} size="tiny" /> : <Icon name={'universal access'} size="big" /> }</div>
				</div>
				<div className={cx('user-body')}>
					<div className={cx('username')}>{user.username}</div>
					<div className={cx('date')}>{`Joined in ${userJoinedDate}`}</div>
					<div className={cx('about')}>{user.about}</div>
				</div>
				<div className={cx('user-footer')}>
					<div className={cx('friends')}>
						<Icon name="user" /> 22 Friends
					</div>
				</div>
			</Link>
		);
	});
};

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
	return (
		<div>
			<div className={cx('users-container')}>
				{ renderUsersList(users) }
			</div>

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
