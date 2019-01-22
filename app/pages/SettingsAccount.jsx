import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateUserAction, emptyErrorsUserUpdateAction, deleteUserAccountAction } from '../actions/userMe';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Form, Message, Button, Modal, Header, Icon } from 'semantic-ui-react';
// import classNames from 'classnames/bind';
// import styles from '../css/main.scss';

// const cx = classNames.bind(styles);

class SettingsAccount extends Component {
	constructor(props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleSubmitDeleteAccount = this.handleSubmitDeleteAccount.bind(this);

		// modal:
		this.handleOpenModalDeleteAccount = this.handleOpenModalDeleteAccount.bind(this);

		this.state = {
			fieldsTypingUpdateUser: {},
			isModalForDeleteAccountOpened: false
		};
	}

	componentDidMount() {
		this.props.emptyErrorsUserUpdateAction();
	}

	getMetaData() {
		return {
			title: 'Settings Account',
			meta: [{name: 'description', content: 'Settings Account'}],
			link: []
		};
	}

	getFieldsVal() {
		const { userMe } = this.props;
		const { fieldsTypingUpdateUser } = this.state;
		const fields = {};

		fields.password = ((typeof fieldsTypingUpdateUser.password !== 'undefined') ? fieldsTypingUpdateUser.password : '') || null;
		fields.passwordDelete = ((typeof fieldsTypingUpdateUser.passwordDelete !== 'undefined') ? fieldsTypingUpdateUser.passwordDelete : '') || null;
		fields.email = ((typeof fieldsTypingUpdateUser.email !== 'undefined') ? fieldsTypingUpdateUser.email : userMe.email) || null;

		return fields;
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { userMe, updateUserAction } = this.props;
		const { fieldsTypingUpdateUser } = this.state;

		updateUserAction(fieldsTypingUpdateUser, userMe._id);
	}

	handleInputChange(event, field) {
		this.setState({ fieldsTypingUpdateUser: { [field.name]: field.value } });
	}

	handleOpenModalDeleteAccount() {
		this.setState({ isModalForDeleteAccountOpened: !this.state.isModalForDeleteAccountOpened });
	}

	handleSubmitDeleteAccount() {
		const { deleteUserAccountAction, userMe } = this.props;
		const { fieldsTypingUpdateUser } = this.state;

		deleteUserAccountAction(userMe._id, fieldsTypingUpdateUser.passwordDelete);
	}

	/**
	 * Display a error if a field is wrong
	 * @param {object} missingRequiredField - true if the field is missing
	 * @param {string} messageErrorState - Back-end message error
	 * @return {object} the final messages if error
	 * */
	dispayFieldsErrors(missingRequiredField, messageErrorState) {
		const errorsField = {};

		if (missingRequiredField.password) errorsField.password = 'The password is required ';
		if (missingRequiredField.passwordDelete) errorsField.passwordDelete = 'The password is required ';
		if (missingRequiredField.email) errorsField.email = 'The mail is required ';
		if (messageErrorState && messageErrorState.length > 0) errorsField.errorBackend = messageErrorState;

		return errorsField;
	}

	render() {
		const { updateMissingRequiredField, updateMessageError } = this.props;
		const { fieldsTypingUpdateUser, isModalForDeleteAccountOpened } = this.state;
		const fields = this.getFieldsVal();
		const messagesErrors = this.dispayFieldsErrors(updateMissingRequiredField, updateMessageError);
		const disabledPasswordButton = typeof fieldsTypingUpdateUser.password === 'undefined' || fieldsTypingUpdateUser.password === '';
		const disabledPasswordDelButton = typeof fieldsTypingUpdateUser.passwordDelete === 'undefined' || fieldsTypingUpdateUser.passwordDelete === '';
		const disabledEmailButton = typeof fieldsTypingUpdateUser.email === 'undefined' || fieldsTypingUpdateUser.email === '';

		return (
			<LayoutPage {...this.getMetaData()}>
				<div style={{ marginBottom: '30px' }}>
					<h3>Change password</h3>
					<Segment>
						<Form error={updateMissingRequiredField.password} size="small" onSubmit={this.handleOnSubmit}>
							<Form.Input required label="New Password" placeholder="New Password" name="password" value={fields.password || ''} type="password" error={updateMissingRequiredField.password} onChange={this.handleInputChange} />
							<Message error content={messagesErrors.password} />
							<Form.Button disabled={disabledPasswordButton}>Submit</Form.Button>
						</Form>
					</Segment>
				</div>

				<div style={{ marginBottom: '30px' }}>
					<h3>Change email</h3>
					<Segment>
						<Form error={updateMissingRequiredField.email} size="small" onSubmit={this.handleOnSubmit}>
							<Form.Input required label="New E-mail" placeholder="New E-mail" name="email" value={fields.email || ''} type="text" error={updateMissingRequiredField.email} onChange={this.handleInputChange} />
							<Message error content={messagesErrors.email} />
							<Form.Button disabled={disabledEmailButton}>Submit</Form.Button>
						</Form>
					</Segment>
				</div>

				{ messagesErrors.errorBackend && messagesErrors.errorBackend.length > 0 && <Message error content={messagesErrors.errorBackend} /> }

				<div>
					<h3>Delete account</h3>
					<Button color="red" icon="delete" content="Delete your account" onClick={this.handleOpenModalDeleteAccount} />
				</div>

				<Modal open={isModalForDeleteAccountOpened} onClose={this.handleOpenModalDeleteAccount}>
					<Modal.Header>Delete account</Modal.Header>
					<Modal.Content image>
						<Modal.Description>
							<Header>Are you sure to delete your account?</Header>

							<Message icon color="red" size="mini">
								<Icon name="attention" size="small" />
								<Message.Content>This action will delete all your notes.</Message.Content>
							</Message>

							<p>Please type in your password to confirm.</p>

							<Form error={updateMissingRequiredField.passwordDelete} size="small" onSubmit={this.handleSubmitDeleteAccount}>
								<Form.Group>
									<Form.Input width={4} required placeholder="Your Password" name="passwordDelete" value={fields.passwordDelete || ''} type="password" error={updateMissingRequiredField.passwordDelete} onChange={this.handleInputChange} />
									<Form.Button width={8} disabled={disabledPasswordDelButton} color="red" content="I confirm delete my account" />
								</Form.Group>
								<Message error content={messagesErrors.passwordDelete} />
							</Form>

						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button color="black" onClick={this.handleOpenModalDeleteAccount}>Cancel</Button>
					</Modal.Actions>
				</Modal>
			</LayoutPage>
		);
	}
}

SettingsAccount.propTypes = {
	updateUserAction: PropTypes.func,
	emptyErrorsUserUpdateAction: PropTypes.func,
	deleteUserAccountAction: PropTypes.func,
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
		updateMissingRequiredField: state.userMe.updateMissingRequiredField,
		updateMessageError: state.userMe.updateMessageError
	};
};

export default connect(mapStateToProps, { updateUserAction, emptyErrorsUserUpdateAction, deleteUserAccountAction })(SettingsAccount);
