import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateUserAction, emptyErrorsUserUpdateAction, deleteUserAccountAction } from '../actions/userMe';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Form, Message, Button, Modal, Header, Icon } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/settingsAccount.scss';

const cx = classNames.bind(styles);

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

		fields.passwordUpdateChecking = ((typeof fieldsTypingUpdateUser.passwordUpdateChecking !== 'undefined') ? fieldsTypingUpdateUser.passwordUpdateChecking : '') || null;
		fields.password = ((typeof fieldsTypingUpdateUser.password !== 'undefined') ? fieldsTypingUpdateUser.password : '') || null; // TODO rename passwordUpdate
		fields.passwordDelete = ((typeof fieldsTypingUpdateUser.passwordDelete !== 'undefined') ? fieldsTypingUpdateUser.passwordDelete : '') || null;
		fields.email = ((typeof fieldsTypingUpdateUser.email !== 'undefined') ? fieldsTypingUpdateUser.email : userMe.email) || null;

		return fields;
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { userMe, updateUserAction } = this.props;
		const { fieldsTypingUpdateUser } = this.state;

		updateUserAction(fieldsTypingUpdateUser, userMe._id);
		this.setState({ fieldsTypingUpdateUser: {} });
	}

	handleInputChange(event, field) {
		// If input change for update password:
		if (field.name === 'passwordUpdateChecking' || field.name === 'password') {
			return this.setState({ fieldsTypingUpdateUser: {
					passwordUpdateChecking: this.state.fieldsTypingUpdateUser.passwordUpdateChecking,
					password: this.state.fieldsTypingUpdateUser.password,
					[field.name]: field.value
			} });
		}

		// If input change for other datas:
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

	render() {
		const { updateMissingRequiredField, updateMessageError } = this.props;
		const { fieldsTypingUpdateUser, isModalForDeleteAccountOpened } = this.state;
		const fields = this.getFieldsVal();
		const disabledPasswordButton = (typeof fieldsTypingUpdateUser.passwordUpdateChecking === 'undefined' || fieldsTypingUpdateUser.passwordUpdateChecking === '') || (typeof fieldsTypingUpdateUser.password === 'undefined' || fieldsTypingUpdateUser.password === '');
		const disabledPasswordDelButton = typeof fieldsTypingUpdateUser.passwordDelete === 'undefined' || fieldsTypingUpdateUser.passwordDelete === '';
		const disabledEmailButton = typeof fieldsTypingUpdateUser.email === 'undefined' || fieldsTypingUpdateUser.email === '';

		return (
			<LayoutPage {...this.getMetaData()}>
				<div style={{ marginBottom: '30px' }}>
					<h3 className={cx('settings-title')}>Change password</h3>
					<Segment>
						<Form error={(updateMissingRequiredField.passwordUpdate && updateMissingRequiredField.passwordUpdate.length > 0) || (updateMissingRequiredField.passwordUpdateChecking && updateMissingRequiredField.passwordUpdateChecking.length > 0)} size="small" onSubmit={this.handleOnSubmit}>
							<Form.Input required label="Your actual Password" placeholder="Your actual Password" name="passwordUpdateChecking" value={fields.passwordUpdateChecking || ''} type="password" error={updateMissingRequiredField.passwordUpdateChecking && updateMissingRequiredField.passwordUpdateChecking.length > 0} onChange={this.handleInputChange} />
							<Form.Input required label="Set your new Password" placeholder="Set your new Password" name="password" value={fields.password || ''} type="password" error={updateMissingRequiredField.passwordUpdate && updateMissingRequiredField.passwordUpdate.length > 0} onChange={this.handleInputChange} />
							<Message error content={updateMissingRequiredField.passwordUpdate || updateMissingRequiredField.passwordUpdateChecking} />
							<Form.Button disabled={disabledPasswordButton}>Submit</Form.Button>
						</Form>
					</Segment>
				</div>

				<div style={{ marginBottom: '30px' }}>
					<h3 className={cx('settings-title')}>Change email</h3>
					<Segment>
						<Form error={updateMissingRequiredField.email && updateMissingRequiredField.email.length > 0} size="small" onSubmit={this.handleOnSubmit}>
							<Form.Input required label="New E-mail" placeholder="New E-mail" name="email" value={fields.email || ''} type="text" error={updateMissingRequiredField.email && updateMissingRequiredField.email.length > 0} onChange={this.handleInputChange} />
							<Message error content={updateMissingRequiredField.email} />
							<Form.Button disabled={disabledEmailButton}>Submit</Form.Button>
						</Form>
					</Segment>
				</div>

				{ updateMessageError && updateMessageError.length > 0 && <Message error content={updateMessageError} /> }

				<div>
					<h3 className={cx('settings-title')}>Delete account</h3>
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

							<Form error={updateMissingRequiredField.passwordDelete && updateMissingRequiredField.passwordDelete.length > 0} size="small" onSubmit={this.handleSubmitDeleteAccount}>
								<Form.Group>
									<Form.Input width={4} required placeholder="Your Password" name="passwordDelete" value={fields.passwordDelete || ''} type="password" error={updateMissingRequiredField.passwordDelete && updateMissingRequiredField.passwordDelete.length > 0} onChange={this.handleInputChange} />
									<Form.Button width={8} disabled={disabledPasswordDelButton} color="red" content="I confirm delete my account" />
								</Form.Group>
								<Message error content={updateMissingRequiredField.passwordDelete} />
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
