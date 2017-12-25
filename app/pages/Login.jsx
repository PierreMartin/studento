import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/login.scss';

const cx = classNames.bind(styles);

class Login extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
	}

	handleOnSubmit(event) {
		event.preventDefault();
		const signup = this.props.location.pathname === '/signup';

		if (signup) {
			console.log('signup');
			return;
		}

		console.log('login');
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
			fieldsSignupNode = <Form.Input fluid icon="user" iconPosition="left" placeholder="username" />;
		}

		return (
			<div className={cx('login-form')} >
				<Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as="h2" color="teal" textAlign="center">{signup ? 'Signup a new account' : 'Login to your account'}</Header>

						<Form size="large" onSubmit={this.handleOnSubmit}>
							<Segment stacked>
								{ fieldsSignupNode }
								<Form.Input fluid icon="user" iconPosition="left" placeholder="E-mail address" />
								<Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password" />

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

function mapStateToProps(/*state*/) {
	return {};
}

export default connect(mapStateToProps, /*{login, signUp}*/ null)(Login);
