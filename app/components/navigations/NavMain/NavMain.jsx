import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UnreadNotifMessages from '../../UnreadMessages/UnreadNotifMessages';
import UnreadModalMessages from '../../UnreadMessages/UnreadModalMessages';
import { logoutAction } from '../../../actions/authentification';
import { openTchatboxSuccess } from '../../../actions/tchat';
import { Button, Container, Menu, Segment, Dropdown, Label, Icon } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from '../../../css/main.scss';

const cx = classNames.bind(styles);


class NavigationMain extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: 'home',
			openModalUnreadNotifMessages: false
		};

		this.handleItemClick = this.handleItemClick.bind(this);
		this.renderDropdownProfile = this.renderDropdownProfile.bind(this);

		// handle open modal:
		this.handleClickOpenModalUnreadMessages = this.handleClickOpenModalUnreadMessages.bind(this);
		this.handleClickOutsideUnreadContent = this.handleClickOutsideUnreadContent.bind(this);

		// handle open tchatBox:
		this.handleClickOpenTchatBox = this.handleClickOpenTchatBox.bind(this);
	}

	componentDidMount() {
		// Obliged to use addEventListener for handle the events outside a element
		document.addEventListener('mousedown', this.handleClickOutsideUnreadContent);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutsideUnreadContent);
	}

	/**
	 * When click on a item of the menu - for set a active class
	 * @param {object} e - the event datas
	 * @return {void}
	 * */
	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
	};

	/**
	 * When click on <UnreadNotifMessages /> for open/close the UnreadModalMessages
	 * @return {void}
	 * */
	handleClickOpenModalUnreadMessages() {
		this.setState({ openModalUnreadNotifMessages: !this.state.openModalUnreadNotifMessages });
	}

	/**
	 * When <UnreadNotifMessages /> is opened and clicked outside of him
	 * @param {object} event - the event datas
	 * @return {void}
	 * */
	handleClickOutsideUnreadContent(event) {
		const unreadContentNode = ReactDOM.findDOMNode(this.unreadContentRef); // No yet the 16.3 for use the ref DOM

		// If don't click on unreadContentNode:
		if (this.state.openModalUnreadNotifMessages && unreadContentNode && !unreadContentNode.contains(event.target)) {
			this.setState({ openModalUnreadNotifMessages: false });
		}
	}

	/**
	 * When click on a item in UnreadModalMessages for open the contextual tchatBox
	 * @param {object} unreadMessageClicked - the datas of the thread clicked
	 * @return {void}
	 * */
	handleClickOpenTchatBox(unreadMessageClicked) {
		const { openTchatboxSuccess } = this.props;

		// formate for compatibility with the openTchatboxSuccess() action:
		const getChannelFormated = { [unreadMessageClicked._id]: {
			id: unreadMessageClicked._id,
			users: unreadMessageClicked.author
		} };

		this.setState({ openModalUnreadNotifMessages: false });
		openTchatboxSuccess(getChannelFormated);
	}

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
		const { unreadMessages, authentification, logoutAction, userMe, socket } = this.props;

		return (
			<Segment inverted>
				<Container>
					<Menu inverted pointing secondary className={cx('myClass')}>
						<Menu.Item as={Link} to="/" name="home" active={activeItem === 'home'} onClick={this.handleItemClick}>Home</Menu.Item>
						<Menu.Item as={Link} to="/about" name="about" active={activeItem === 'about'} onClick={this.handleItemClick}>About</Menu.Item>
						{ authentification.authenticated ? (<Menu.Item as={Link} to="/users" name="users" active={activeItem === 'users'} onClick={this.handleItemClick}>Users</Menu.Item>) : ''}

						<Menu.Item position="right">
							{ this.renderDropdownProfile(userMe, authentification, logoutAction) }

							{ authentification.authenticated ? (<Menu.Item as={Link} to="/course/create/new"><Icon name="add" />Add a course</Menu.Item>) : ''}

							{ authentification.authenticated ? (
								<div ref={(el) => { this.unreadContentRef = el; }} >
									<Menu.Item onClick={this.handleClickOpenModalUnreadMessages} ><UnreadNotifMessages socket={socket} /></Menu.Item>
									{ this.state.openModalUnreadNotifMessages && <UnreadModalMessages handleClickOpenTchatBox={this.handleClickOpenTchatBox} unreadMessages={unreadMessages} /> }
								</div>
								) : ''}

							{/* authentification.authenticated ? (<Menu.Item as="a"><Icon name="users" /><Label circular color="teal" size="mini" floating>22</Label></Menu.Item>) : ''*/}
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
	socket: PropTypes.object,

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}),

	unreadMessages: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		author: PropTypes.array, // populate
		count: PropTypes.number
	})),

	logoutAction: PropTypes.func.isRequired,
	openTchatboxSuccess: PropTypes.func
};

function mapStateToProps(state) {
	return {
		authentification: state.authentification,
		userMe: state.userMe.data,
		unreadMessages: state.tchat.unreadMessages
	};
}

export default connect(mapStateToProps, { logoutAction, openTchatboxSuccess })(NavigationMain);
