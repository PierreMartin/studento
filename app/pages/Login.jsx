import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginAction, signupAction, typingLoginSignupAction } from '../actions/authentification';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import hubNoteLogo from '../images/logo_hubnote_200.png';
import classNames from 'classnames/bind';
import styles from './css/login.scss';
import stylesMain from '../css/main.scss';

const cx = classNames.bind({...styles, ...stylesMain});

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

	/**
	 * Display a error if a field is wrong
	 * @param {object} missingRequiredField - object with true as key if a field is missing
	 * @param {string} messageErrorState - message from back-end
	 * @return {HTML} the final message if error
	 * */
	dispayFieldsErrors(missingRequiredField, messageErrorState) {
		const errorsField = [];
		if (missingRequiredField.username) {
			errorsField.push({message: 'the username is required ', key: 'username'});
		}

		if (missingRequiredField.email) {
			errorsField.push({message: 'the email is required ', key: 'email'});
		}

		if (missingRequiredField.password) {
			errorsField.push({message: 'the password is required ', key: 'password'});
		}

		if (messageErrorState && messageErrorState.length > 0) {
			errorsField.push({message: messageErrorState, key: 'backendError'});
		}

		const messagesListNode = errorsField.map((errorField, key) => {
			return (
				<li key={key}>{errorField.message}</li>
			);
		});

		return <ul className={cx('error-message')}>{messagesListNode}</ul>;
	}

	render() {
		const { missingRequiredField, location, messageErrorState } = this.props;
		const signup = location.pathname === '/signup';
		let fieldsSignupNode = '';

		const messages = this.dispayFieldsErrors(missingRequiredField, messageErrorState);

		if (signup) {
			fieldsSignupNode = <Form.Input fluid icon="user" iconPosition="left" label="username" placeholder="username" name="username" error={missingRequiredField.username} onChange={this.handleInputChange} />;
		}

		return (
			<div className={cx('login-form')}>
				<div className={cx('logo')}>
					<img src={hubNoteLogo} alt="Logo HubNote" />
				</div>

				<Grid textAlign="center" verticalAlign="middle" className={cx('form')}>
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as="h2" textAlign="center">{signup ? 'Signup a new account' : 'Login to your account'}</Header>

						<Form error={messages.props.children.length > 0} size="large" onSubmit={this.handleOnSubmit}>
							<Segment stacked textAlign="left">
								{ fieldsSignupNode }
								<Form.Input fluid icon="user" iconPosition="left" label="E-mail" placeholder="E-mail address" name="email" error={missingRequiredField.email} onChange={this.handleInputChange} />
								<Form.Input fluid icon="lock" iconPosition="left" label="Password" placeholder="Password" type="password" name="password" error={missingRequiredField.password} onChange={this.handleInputChange} />
								<Message error content={messages} />

								<Button fluid size="large">{ signup ? 'Signup' : 'Login' }</Button>
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
	missingRequiredField: PropTypes.object,
	messageErrorState: PropTypes.string,
	loginAction: PropTypes.func.isRequired,
	signupAction: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		typingLoginSignupState: state.authentification.typingLoginSignupState,
		missingRequiredField: state.authentification.missingRequiredField,
		messageErrorState: state.authentification.messageError
	};
}

export default connect(mapStateToProps, {loginAction, signupAction, typingLoginSignupAction})(Login);
