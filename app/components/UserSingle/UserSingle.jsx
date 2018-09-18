import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button, Image, Icon } from 'semantic-ui-react';
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

const UserSingle = ({ userFront, userMe, handleOpenChatBox }) => {
	const isMyProfile = userFront._id === userMe._id;
	const src = userFront.avatarMainSrc && userFront.avatarMainSrc.avatar150 && `/uploads/${userFront.avatarMainSrc.avatar150}`;
	const avatarsList = renderAvatarsList(userFront);
	const emptyDescription = !userFront.position && !userFront.schoolName && !userFront.age && !userFront.firstName && !userFront.lastName;

	return (
		<div>
			<div className={cx('user-main-container')}>
				<h3 className={cx('user-main-username')}>{ userFront.username }</h3>
				<div className={cx('avatar')}>{ src ? <Image circular src={src} size="small" /> : <Icon name={'universal access'} size="big" /> }</div>
				<div className={cx('user-main-description')}>{ userFront.about || '' }</div>
			</div>

			<div className={cx('user-actions-container')}>
				{/* !isMyProfile ? <Button size="small" basic><Icon name="add user" />Add</Button> : '' */}
				{ !isMyProfile ? <Button size="small" basic onClick={handleOpenChatBox} ><Icon name="talk" />Message</Button> : '' }
				{ isMyProfile ? <Button as={Link} to="/settings" size="small" basic><Icon name="settings" />Edit my profile</Button> : '' }
			</div>

			<hr />

			<div className={cx('user-description-container')}>
				{ userFront.city ? (
				<div className={cx('user-description-item')}>
					<strong>City:</strong>
					<div>{userFront.city}</div>
				</div>
				) : '' }

				{ userFront.position ? (
					<div className={cx('user-description-item')}>
						<strong>Position:</strong>
						<div>{userFront.position} { userFront.domain ? ' as ' + userFront.domain : '' }</div>
					</div>
				) : '' }

				{ userFront.schoolName ? (
					<div className={cx('user-description-item')}>
						<strong>Current school:</strong>
						<div>{userFront.schoolName}</div>
					</div>
				) : '' }

				{ userFront.age ? (
					<div className={cx('user-description-item')}>
						<strong>Age:</strong>
						<div>{userFront.age}</div>
					</div>
				) : '' }

				{ userFront.firstName ? (
					<div className={cx('user-description-item')}>
						<strong>FirstName:</strong>
						<div>{userFront.firstName}</div>
					</div>
				) : '' }

				{ userFront.lastName ? (
					<div className={cx('user-description-item')}>
						<strong>LastName:</strong>
						<div>{userFront.lastName}</div>
					</div>
				) : '' }
			</div>

			{ emptyDescription && <div style={{ textAlign: 'center' }}>This user has not completed his profile yet</div> }

			{ (avatarsList.length > 0) ? <div className={cx('thumbnails-container')}>{ avatarsList }</div> : '' }
		</div>
	);
};

UserSingle.propTypes = {
	userMe: PropTypes.shape({
		_id: PropTypes.string
	}),

	userFront: PropTypes.shape({
		username: PropTypes.string,
		about: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string,
		avatarMainSrc: PropTypes.shape({
			avatar150: PropTypes.string
		}),
		position: PropTypes.string,
		domain: PropTypes.string,
		schoolName: PropTypes.string,
		age: PropTypes.number,
		firstName: PropTypes.string,
		lastName: PropTypes.string
	}).isRequired,

	handleOpenChatBox: PropTypes.func.isRequired
};

export default UserSingle;
