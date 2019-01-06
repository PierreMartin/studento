import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UnreadNotifMessages from '../../UnreadMessages/UnreadNotifMessages';
import UnreadModalMessages from '../../UnreadMessages/UnreadModalMessages';
import { fetchCategoriesAction } from '../../../actions/category';
import { logoutAction } from '../../../actions/authentification';
import { openTchatboxSuccess } from '../../../actions/tchat';
import { Button, Container, Menu, Segment, Dropdown, Icon } from 'semantic-ui-react';
import hubNoteLogo from '../../../images/logo_hubnote_white_menu.png';
// import classNames from 'classnames/bind';
// import styles from './css/navMain.scss';

// const cx = classNames.bind(styles);


class NavigationMain extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openModalUnreadNotifMessages: false
		};

		this.renderDropdownProfile = this.renderDropdownProfile.bind(this);
		this.handleCategoriesItemClick = this.handleCategoriesItemClick.bind(this);

		// handle open modal:
		this.handleClickOpenModalUnreadMessages = this.handleClickOpenModalUnreadMessages.bind(this);
		this.handleClickOutsideUnreadContent = this.handleClickOutsideUnreadContent.bind(this);

		// handle open tchatBox:
		this.handleClickOpenTchatBox = this.handleClickOpenTchatBox.bind(this);
	}

	componentDidMount() {
		const { categories } = this.props;
		if (categories.length === 0) this.props.fetchCategoriesAction();

		// Obliged to use addEventListener for handle the events outside a element
		document.addEventListener('mousedown', this.handleClickOutsideUnreadContent);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutsideUnreadContent);
	}

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

	handleCategoriesItemClick = (e, { name }) => {
		e.stopPropagation();
		browserHistory.push(name);
	};

	renderDropdownCategories(categories) {
		return (
			<Dropdown item simple text="Categories" title="Categories">
				<Dropdown.Menu style={{ marginTop: '0px' }}>
					{ categories.map((cat, keyCat) => {
						return (
							<Dropdown.Item key={keyCat} name={`/courses/${cat.key}/list`} onClick={this.handleCategoriesItemClick}>
								<Icon name={cat.picto} />
								<span className="text">{cat.name}</span>

								<Dropdown.Menu>
									{ cat.subCategories.map((subCat, keySubCat) => {
										return (
											<Dropdown.Item key={keySubCat} name={`/courses/${cat.key}/${subCat.key}`} onClick={this.handleCategoriesItemClick}>
												<span className="text">{subCat.name}</span>
											</Dropdown.Item>
										);
									}) }
								</Dropdown.Menu>
							</Dropdown.Item>
						);
					}) }
				</Dropdown.Menu>
			</Dropdown>
		);
	}

	renderDropdownProfile(userMe, authentification, logoutAction) {
		if (authentification.authenticated) {
			return (
				<Dropdown item text={userMe.username} title="Settings">
					<Dropdown.Menu>
						<Dropdown.Item icon="user" text="Profile" as={Link} to={'/user/' + userMe._id} />
						<Dropdown.Item icon="dashboard" text="Dashboard" as={Link} to="/dashboard" />
						<Dropdown.Item icon="settings" text="Edit Profile" as={Link} to="/settings" />
						<Dropdown.Item icon="user outline" text="Logout" as={Link} to="/" onClick={logoutAction} />
					</Dropdown.Menu>
				</Dropdown>
			);
		}
	}

	renderDropdownAddCourse(authentification) {
		if (authentification.authenticated) {
			return (
				<Dropdown item icon="add" title="Add a course">
					<Dropdown.Menu>
						<Dropdown.Item icon="add" text="Add a course" as={Link} to="/course/create/new" />
						<Dropdown.Item icon="add" text="Add a Markdown course" as={Link} to="/courseMd/create/new" />
					</Dropdown.Menu>
				</Dropdown>
			);
		}
	}

	render() {
		const { unreadMessages, authentification, logoutAction, userMe, socket, pathUrl, categories } = this.props;

		return (
			<Segment inverted style={{ marginBottom: '0', padding: '0', height: '55px' }}>
				<Container>
					<Menu inverted pointing secondary>
						<Menu.Item position="left">
							<Menu.Item as={Link} to="/"><img src={hubNoteLogo} alt="Logo HubNote" /></Menu.Item>
							{ this.renderDropdownCategories(categories) }
							<Menu.Item as={Link} to="/about" active={pathUrl === '/about'}>About</Menu.Item>
							{ authentification.authenticated ? (<Menu.Item as={Link} to="/users" active={pathUrl === '/users' || pathUrl === '/user/:id'}>Users</Menu.Item>) : ''}
						</Menu.Item>

						<Menu.Item position="right">
							{ this.renderDropdownProfile(userMe, authentification, logoutAction) }
							{ this.renderDropdownAddCourse(authentification) }

							{ authentification.authenticated ? (
								<div ref={(el) => { this.unreadContentRef = el; }} >
									<Menu.Item onClick={this.handleClickOpenModalUnreadMessages} ><UnreadNotifMessages socket={socket} /></Menu.Item>
									{ this.state.openModalUnreadNotifMessages && <UnreadModalMessages handleClickOpenTchatBox={this.handleClickOpenTchatBox} unreadMessages={unreadMessages} /> }
								</div>
								) : ''}

							{/* authentification.authenticated ? (<Menu.Item as="a"><Icon name="users" /><Label circular color="teal" size="mini" floating>22</Label></Menu.Item>) : ''*/}
							{ !authentification.authenticated ? (<Menu.Item as={Link} to="/login" active={pathUrl === '/login'}>Log in</Menu.Item>) : ''}
							{ !authentification.authenticated ? (<Button as={Link} to="/signup" active={pathUrl === '/signup'} inverted style={{marginLeft: '0.5em'}}>Sign Up</Button>) : ''}
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
	pathUrl: PropTypes.string,

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}),

	categories: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		key: PropTypes.string,
		picto: PropTypes.string,
		subCategories: PropTypes.array
	})),

	unreadMessages: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		author: PropTypes.array, // populate
		count: PropTypes.number
	})),

	fetchCategoriesAction: PropTypes.func,
	logoutAction: PropTypes.func.isRequired,
	openTchatboxSuccess: PropTypes.func
};

function mapStateToProps(state) {
	return {
		categories: state.categories.all,
		authentification: state.authentification,
		userMe: state.userMe.data,
		unreadMessages: state.tchat.unreadMessages
	};
}

export default connect(mapStateToProps, { fetchCategoriesAction, logoutAction, openTchatboxSuccess })(NavigationMain);
