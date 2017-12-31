import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { typingUpdateUserAction, updateUserAction } from '../actions/userMe';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Form, Message } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from '../css/main.scss';

const cx = classNames.bind(styles);

class SettingsPassword extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	getMetaData() {
		return {
			title: 'Settings Password',
			meta: [{name: 'description', content: 'Settings Password...'}],
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
		const messagesError = this.dispayFieldsErrors(updateMissingRequiredField, updateMessageError);

		return (
			<LayoutPage {...this.getMetaData()}>
				<h4>Account Settings - Password</h4>

				<Form error={messagesError.props.children.length > 0} size="small" onSubmit={this.handleOnSubmit}>
					<Form.Input required label="New Password" placeholder="New Password" name="password" value={fields.password || ''} type="password" error={updateMissingRequiredField.password} onChange={this.handleInputChange} />
					<Message error content={messagesError} />

					<Form.Button>Submit</Form.Button>
				</Form>

			</LayoutPage>
		);
	}
}

SettingsPassword.propTypes = {
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

export default connect(mapStateToProps, { typingUpdateUserAction, updateUserAction })(SettingsPassword);
