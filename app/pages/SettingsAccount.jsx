import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { typingUpdateUserAction, updateUserAction } from '../actions/userMe';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Form, Message, Button } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from '../css/main.scss';

const cx = classNames.bind(styles);

class SettingsAccount extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		// TODO delete Email + Password
	}

	getMetaData() {
		return {
			title: 'Settings Account',
			meta: [{name: 'description', content: 'Settings Account'}],
			link: []
		};
	}

	getFieldsVal(typingUpdateUserState) {
		const fields = {};
		fields.password = ((typeof typingUpdateUserState.password !== 'undefined') ? typingUpdateUserState.password : '') || null;
		fields.birthDateDay = null;
		fields.birthDateMonth = null;
		fields.birthDateYear = null;
		// other fields here ...

		return fields;
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { userMe, typingUpdateUserState, updateUserAction } = this.props;
		const fields = this.getFieldsVal(typingUpdateUserState);
		console.log(fields);

		updateUserAction(fields, userMe._id);
	}

	handleInputChange(event, field) {
		this.props.typingUpdateUserAction(field.name, field.value);
	}

	/**
	 * Display a error if a field is wrong
	 * @param {object} missingRequiredField - object with true as key if a field is missing
	 * @param {string} messageErrorState - message from back-end
	 * @return {HTML} the final message if error
	 * */
	dispayFieldsErrors(missingRequiredField, messageErrorState) {
		const errorsField = [];

		if (missingRequiredField.password) {
			// TODO faire:
			// const errorsField = {};
			// errorsField.password = {message: 'The field password is required ', key: 'password'};
			errorsField.push({message: 'The field password is required ', key: 'password'});
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
		const { typingUpdateUserState, updateMissingRequiredField, updateMessageError } = this.props;
		const fields = this.getFieldsVal(typingUpdateUserState);
		const messagesErrors = this.dispayFieldsErrors(updateMissingRequiredField, updateMessageError);

		return (
			<LayoutPage {...this.getMetaData()}>
				<div style={{ marginBottom: '30px' }}>
					<h3>Change password</h3>
					<Segment>
						<Form error={messagesErrors.props.children.length > 0} size="small" onSubmit={this.handleOnSubmit}>
							<Form.Input required label="New Password" placeholder="New Password" name="password" value={fields.password || ''} type="password" error={updateMissingRequiredField.password} onChange={this.handleInputChange} />
							<Message error content={messagesErrors} />
							<Form.Button>Submit</Form.Button>
						</Form>
					</Segment>
				</div>

				<div style={{ marginBottom: '30px' }}>
					<h3>Change email</h3>
					<Segment>
						<Form error={messagesErrors.props.children.length > 0} size="small" onSubmit={this.handleOnSubmit}>
							<Form.Input required label="New E-mail" placeholder="New E-mail" name="email" value={fields.email || ''} type="text" error={updateMissingRequiredField.email} onChange={this.handleInputChange} />
							<Message error content={messagesErrors} />
							<Form.Button>Submit</Form.Button>
						</Form>
					</Segment>
				</div>

				<div>
					<h3>Delete account</h3>
					<Button color="red" icon="delete" content="Delete your account" />
				</div>
			</LayoutPage>
		);
	}
}

SettingsAccount.propTypes = {
	typingUpdateUserAction: PropTypes.func.isRequired,
	typingUpdateUserState: PropTypes.object,
	updateUserAction: PropTypes.func.isRequired,
	updateMissingRequiredField: PropTypes.object,
	updateMessageError: PropTypes.string,

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		userMe: state.userMe.data,
		typingUpdateUserState: state.userMe.typingUpdateUserState,
		updateMissingRequiredField: state.userMe.updateMissingRequiredField,
		updateMessageError: state.userMe.updateMessageError
	};
};

export default connect(mapStateToProps, { typingUpdateUserAction, updateUserAction })(SettingsAccount);
