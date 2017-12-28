import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutAction } from '../../../actions/authentification';
import { Button, Container, Menu, Segment } from 'semantic-ui-react';
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
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
	};

	render() {
		const { activeItem } = this.state;
		const { authentification, logoutAction } = this.props;

		return (
			<Segment inverted>
				<Container>
					<Menu inverted pointing secondary className={cx('myClass')}>
						<Menu.Item as={Link} to="/" name="home" active={activeItem === 'home'} onClick={this.handleItemClick}>Home</Menu.Item>
						<Menu.Item as={Link} to="/about" name="about" active={activeItem === 'about'} onClick={this.handleItemClick}>About</Menu.Item>
						<Menu.Item as={Link} to="/films" name="films" active={activeItem === 'films'} onClick={this.handleItemClick}>Films</Menu.Item>
						{ authentification.authenticated ? (<Menu.Item as={Link} to="/users" name="users" active={activeItem === 'users'} onClick={this.handleItemClick}>Users</Menu.Item>) : ''}

						<Menu.Item position="right">
							{ !authentification.authenticated ? (<Menu.Item as={Link} to="/login" name="login" active={activeItem === 'login'} onClick={this.handleItemClick}>Log in</Menu.Item>) : ''}
							{ !authentification.authenticated ? (<Button as={Link} to="/signup" name="signup" active={activeItem === 'signup'} inverted style={{marginLeft: '0.5em'}} onClick={this.handleItemClick}>Sign Up</Button>) : ''}
							{ authentification.authenticated ? (<Menu.Item as={Link} onClick={logoutAction} to="/">Logout</Menu.Item>) : ''}
						</Menu.Item>
					</Menu>
				</Container>
			</Segment>
		);

		/*
		 <nav role="navigation" className={cx('navigation')}>
			 <Link to="/" activeClassName={cx('active')}>Home</Link>
			 <Link to="/about" activeClassName={cx('active')}>About</Link>
			 <Link to="/films" activeClassName={cx('active')}>Films</Link>
		 </nav>
		 */
	}
}

NavigationMain.propTypes = {
	authentification: PropTypes.object,
	logoutAction: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		authentification: state.authentification
	};
}

export default connect(mapStateToProps, { logoutAction })(NavigationMain);
