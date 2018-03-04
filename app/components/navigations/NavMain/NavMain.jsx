import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutAction } from '../../../actions/authentification';
import { Button, Container, Menu, Segment, Dropdown, Label, Icon } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from '../../../css/main.scss';

const cx = classNames.bind(styles);


class NavigationMain extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: 'home'
		};

		this.handleItemClick = this.handleItemClick.bind(this);
		this.renderDropdownProfile = this.renderDropdownProfile.bind(this);
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
	};

	renderDropdownProfile(userMe, authentification, logoutAction) {
		if (authentification.authenticated) {
			return (
				<Dropdown item text={userMe.username}>
					<Dropdown.Menu>
						<Dropdown.Item icon="user" text="Profile" as={Link} to={'/user/' + userMe._id} />
						<Dropdown.Item icon="settings" text="Edit Profile" as={Link} to="/settings" />
						<Dropdown.Item icon="user outline" text="logout" as={Link} to="/" onClick={logoutAction} />
					</Dropdown.Menu>
				</Dropdown>
			);
		}
	}

	render() {
		const { activeItem } = this.state;
		const { authentification, logoutAction, userMe } = this.props;

		return (
			<Segment inverted>
				<Container>
					<Menu inverted pointing secondary className={cx('myClass')}>
						<Menu.Item as={Link} to="/" name="home" active={activeItem === 'home'} onClick={this.handleItemClick}>Home</Menu.Item>
						<Menu.Item as={Link} to="/about" name="about" active={activeItem === 'about'} onClick={this.handleItemClick}>About</Menu.Item>
						{ authentification.authenticated ? (<Menu.Item as={Link} to="/users" name="users" active={activeItem === 'users'} onClick={this.handleItemClick}>Users</Menu.Item>) : ''}

						<Menu.Item position="right">
							{ this.renderDropdownProfile(userMe, authentification, logoutAction) }

							{/* TODO HERE créer un component  'UnreadNotifMessages'  'UnreadModalMessages'  qui fetchera les unreadMessages dans componentDidMount() */}
							{/* TODO ET fera un emit.on('new_message_server') des news messages qu'on les ajoutera au store */}
							{ authentification.authenticated ? (<Menu.Item as="a"><Icon name="mail" /><Label circular color="red" size="mini" floating>22</Label></Menu.Item>) : ''}
							{ authentification.authenticated ? (<Menu.Item as="a"><Icon name="users" /><Label circular color="teal" size="mini" floating>22</Label></Menu.Item>) : ''}
							{ !authentification.authenticated ? (<Menu.Item as={Link} to="/login" name="login" active={activeItem === 'login'} onClick={this.handleItemClick}>Log in</Menu.Item>) : ''}
							{ !authentification.authenticated ? (<Button as={Link} to="/signup" name="signup" active={activeItem === 'signup'} inverted style={{marginLeft: '0.5em'}} onClick={this.handleItemClick}>Sign Up</Button>) : ''}
						</Menu.Item>
					</Menu>
				</Container>
			</Segment>
		);
	}
}

NavigationMain.propTypes = {
	authentification: PropTypes.object,

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}),

	logoutAction: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		authentification: state.authentification,
		userMe: state.userMe.data
	};
}

export default connect(mapStateToProps, { logoutAction })(NavigationMain);
