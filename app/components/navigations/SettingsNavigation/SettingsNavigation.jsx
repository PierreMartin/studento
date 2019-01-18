import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react';


const SettingsNavigation = ({ pathUrl }) => {
	return (
		<Menu vertical>
			<Menu.Item as={Link} to="/settings/profile" active={pathUrl === 'profile'}>Profile</Menu.Item>
			<Menu.Item as={Link} to="/settings/avatar" active={pathUrl === 'avatar'}>Avatar</Menu.Item>
			<Menu.Item as={Link} to="/settings/mail" active={pathUrl === 'mail'}>E-mail</Menu.Item>
			<Menu.Item as={Link} to="/settings/password" active={pathUrl === 'password'}>Password</Menu.Item>
			<Menu.Item as={Link} to="/settings/account" active={pathUrl === 'account'}>Account</Menu.Item>
		</Menu>
	);
};

SettingsNavigation.propTypes = {
	pathUrl: PropTypes.string
};

export default SettingsNavigation;
