import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/settingsNavigation.scss';

const cx = classNames.bind(styles);

const SettingsNavigation = ({ pathUrl }) => {
	return (
		<Menu vertical className={cx('menu-container')}>
			<Menu.Item as={Link} to="/settings/profile" active={pathUrl === 'profile' || typeof pathUrl === 'undefined'}>Profile</Menu.Item>
			<Menu.Item as={Link} to="/settings/avatar" active={pathUrl === 'avatar'}>Avatar</Menu.Item>
			<Menu.Item as={Link} to="/settings/account" active={pathUrl === 'account'}>Account</Menu.Item>
		</Menu>
	);
};

SettingsNavigation.propTypes = {
	pathUrl: PropTypes.string
};

export default SettingsNavigation;
