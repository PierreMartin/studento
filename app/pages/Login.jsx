import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginAction, signupAction, typingLoginSignupAction } from '../actions/authentification';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/login.scss';

const cx = classNames.bind(styles);

class Login extends Component {
	constructor(props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
	}

	handleInputChange(event, field) {
		this.props.typingLoginSignupAction(field.name, event.target.value);
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { signupAction, loginAction, typingLoginSignupState } = this.props;
		const signup = this.props.location.pathname === '/signup';
		const email = typingLoginSignupState.email;
		const password = typingLoginSignupState.password;
		const username = typingLoginSignupState.username;

		if (signup) {
			signupAction({username, email, password});
			return;
		}

		loginAction({email, password});
	}

	renderMessage() {
		if (this.props.location.pathname === '/signup') {
			return <div>Already a account? <Link to="/login">Login</Link></div>;
		}

		return <div>Don't have an account? <Link to="/signup">Sign Up</Link></div>;
	}

	render() {
		const signup = this.props.location.pathname === '/signup';
		let fieldsSignupNode = '';

		if (signup) {
			fieldsSignupNode = <Form.Input fluid icon="user" iconPosition="left" label="username" placeholder="username" name="username" onChange={this.handleInputChange} />;
		}

		return (
			<div className={cx('login-form')} >
				<Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as="h2" color="teal" textAlign="center">{signup ? 'Signup a new account' : 'Login to your account'}</Header>

						<Form size="large" onSubmit={this.handleOnSubmit}>
							<Segment stacked textAlign="left">
								{ fieldsSignupNode }
								<Form.Input fluid icon="user" iconPosition="left" label="E-mail" placeholder="E-mail address" name="email" onChange={this.handleInputChange} />
								<Form.Input fluid icon="lock" iconPosition="left" label="Password" placeholder="Password" type="password" name="password" onChange={this.handleInputChange} />
								<Message error content="Some fields are wrong" />

								<Button color="teal" fluid size="large">{ signup ? 'Signup' : 'Login' }</Button>
							</Segment>
						</Form>

						<Message>{ this.renderMessage() }</Message>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

Login.propTypes = {
	typingLoginSignupAction: PropTypes.func.isRequired,
	typingLoginSignupState: PropTypes.object,
	loginAction: PropTypes.func.isRequired,
	signupAction: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		typingLoginSignupState: state.authentification.typingLoginSignupState
	};
}

export default connect(mapStateToProps, {loginAction, signupAction, typingLoginSignupAction})(Login);
