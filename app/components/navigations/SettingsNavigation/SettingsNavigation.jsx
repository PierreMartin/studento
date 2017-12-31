import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react';


class SettingsNavigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: 'profile'
		};

		this.handleItemClick = this.handleItemClick.bind(this);
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
	};

	render() {
		const { activeItem } = this.state;

		return (
			<Menu fluid vertical tabular>
				<Menu.Item as={Link} to="/settings/profile" name="profile" active={activeItem === 'profile'} onClick={this.handleItemClick}>Profile</Menu.Item>
				<Menu.Item as={Link} to="/settings/avatar" name="avatar" active={activeItem === 'avatar'} onClick={this.handleItemClick}>Avatar</Menu.Item>
				<Menu.Item as={Link} to="/settings/mail" name="mail" active={activeItem === 'mail'} onClick={this.handleItemClick}>E-mail</Menu.Item>
				<Menu.Item as={Link} to="/settings/password" name="password" active={activeItem === 'password'} onClick={this.handleItemClick}>Password</Menu.Item>
			</Menu>
		);
	}
}

export default SettingsNavigation;
