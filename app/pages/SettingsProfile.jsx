import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { typingUpdateUserAction, updateUserAction, emptyErrorsUserUpdateAction } from '../actions/userMe';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Form, Message } from 'semantic-ui-react';
import BirthdateField from '../components/common/BirthdateField/BirthdateField';
import classNames from 'classnames/bind';
import styles from '../css/main.scss';

const cx = classNames.bind(styles);

class SettingsProfile extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidMount() {
		this.props.emptyErrorsUserUpdateAction();
	}

	getOptionsFormsSelect() {
		const options = {};

		options.position = [
			{ key: 's', text: 'Student', value: 'student' },
			{ key: 'w', text: 'Worker', value: 'worker' }
		];

		options.country = [
			{ key: 'fr', text: 'France', value: 'france', flag: 'fr' },
			{ key: 'ge', text: 'Germany', value: 'germany', flag: 'de' },
			{ key: 'gr', text: 'Greece', value: 'greece', flag: 'gr' },
			{ key: 'us', text: 'United States', value: 'unitedstates', flag: 'us' }
		];

		options.gender = [
			{ key: 'm', text: 'Male', value: 'male' },
			{ key: 'f', text: 'Female', value: 'female' }
		];

		return options;
	}

	getMetaData() {
		return {
			title: 'Settings Profile',
			meta: [{ name: 'description', content: 'Settings Profile...' }],
			link: []
		};
	}

	getFieldsVal(typingUpdateUserState, userMe) {
		const fields = {};
		fields.username = ((typeof typingUpdateUserState.username !== 'undefined') ? typingUpdateUserState.username : userMe.username) || null;
		fields.position = ((typeof typingUpdateUserState.position !== 'undefined') ? typingUpdateUserState.position : userMe.position) || '';
		fields.domain = ((typeof typingUpdateUserState.domain !== 'undefined') ? typingUpdateUserState.domain : userMe.domain) || '';
		fields.schoolName = ((typeof typingUpdateUserState.schoolName !== 'undefined') ? typingUpdateUserState.schoolName : userMe.schoolName) || '';
		fields.firstName = ((typeof typingUpdateUserState.firstName !== 'undefined') ? typingUpdateUserState.firstName : userMe.firstName) || '';
		fields.lastName = ((typeof typingUpdateUserState.lastName !== 'undefined') ? typingUpdateUserState.lastName : userMe.lastName) || '';
		fields.gender = ((typeof typingUpdateUserState.gender !== 'undefined') ? typingUpdateUserState.gender : userMe.gender) || '';
		fields.country = ((typeof typingUpdateUserState.country !== 'undefined') ? typingUpdateUserState.country : userMe.country) || '';
		fields.city = ((typeof typingUpdateUserState.city !== 'undefined') ? typingUpdateUserState.city : userMe.city) || '';
		fields.birthDateDay = ((typeof typingUpdateUserState.birthDateDay !== 'undefined') ? parseInt(typingUpdateUserState.birthDateDay, 10) : userMe.birthDateDay) || undefined;
		fields.birthDateMonth = ((typeof typingUpdateUserState.birthDateMonth !== 'undefined') ? parseInt(typingUpdateUserState.birthDateMonth, 10) : userMe.birthDateMonth) || undefined;
		fields.birthDateYear = ((typeof typingUpdateUserState.birthDateYear !== 'undefined') ? parseInt(typingUpdateUserState.birthDateYear, 10) : userMe.birthDateYear) || undefined;
		fields.about = ((typeof typingUpdateUserState.about !== 'undefined') ? typingUpdateUserState.about : userMe.about) || '';

		return fields;
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { userMe, typingUpdateUserState, updateUserAction } = this.props;
		const fields = this.getFieldsVal(typingUpdateUserState, userMe);
		console.log(fields);

		updateUserAction(fields, userMe._id);
	}

	handleInputChange(event, field) {
		this.props.typingUpdateUserAction(field.name, field.value);
	}

	/**
	 * Display a error if a field is wrong
	 * @param {object} missingRequiredField - object with string if the field is missing
	 * @param {string} messageErrorState - message from back-end
	 * @return {HTML} the final message if error
	 * */
	dispayFieldsErrors(missingRequiredField, messageErrorState) {
		if (messageErrorState && messageErrorState.length > 0) {
			return <div className={cx('error-message')}>{messageErrorState}</div>;
		}

		const messagesListNode = Object.values(missingRequiredField).map((errorField, key) => {
			return (
				<li key={key}>{errorField}</li>
			);
		});

		return <ul className={cx('error-message')}>{messagesListNode}</ul>;
	}

	render() {
		const { userMe, typingUpdateUserState, updateMissingRequiredField, updateMessageError, typingUpdateUserAction } = this.props;
		const options = this.getOptionsFormsSelect();
		const fields = this.getFieldsVal(typingUpdateUserState, userMe);
		const messagesError = this.dispayFieldsErrors(updateMissingRequiredField, updateMessageError);

		return (
			<LayoutPage {...this.getMetaData()}>
				<h4 style={{ color: 'white' }}>Settings Profile</h4>

				<Form error={messagesError.props.children.length > 0} size="small" onSubmit={this.handleOnSubmit}>
					<Form.Input required label="Username" placeholder="Username" name="username" value={fields.username || ''} error={updateMissingRequiredField.username && updateMissingRequiredField.username.length > 0} onChange={this.handleInputChange} />

					<Form.Select label="Job / current position" options={options.position} placeholder="Job / current position" name="position" value={fields.position || ''} onChange={this.handleInputChange} />
					<Form.Input label="Domain of studing / working" placeholder="Domain of studing / working" name="domain" value={fields.domain || ''} onChange={this.handleInputChange} />
					<Form.Input label="University / School" placeholder="University / School" name="schoolName" value={fields.schoolName || ''} onChange={this.handleInputChange} />

					<Form.Group widths="equal">
						<Form.Input label="First name" placeholder="First name" name="firstName" value={fields.firstName || ''} onChange={this.handleInputChange} />
						<Form.Input label="Last name" placeholder="Last name" name="lastName" value={fields.lastName || ''} onChange={this.handleInputChange} />
					</Form.Group>

					<Form.Select label="Gender" options={options.gender} placeholder="Gender" name="gender" value={fields.gender || ''} onChange={this.handleInputChange} />

					<Form.Group>
						<Form.Select label="Country" options={options.country} placeholder="Country" width={8} name="country" value={fields.country || ''} onChange={this.handleInputChange} />
						<Form.Input label="City" placeholder="City" width={8} name="city" value={fields.city || ''} onChange={this.handleInputChange} />
					</Form.Group>

					<BirthdateField fields={fields} updateMissingRequiredField={updateMissingRequiredField} typingUpdateUserAction={typingUpdateUserAction} />

					<Form.TextArea label="About" placeholder="Tell us more about you..." name="about" value={fields.about || ''} onChange={this.handleInputChange} />
					<Message error content={messagesError} />

					<Form.Button>Submit</Form.Button>
				</Form>

			</LayoutPage>
		);
	}
}

SettingsProfile.propTypes = {
	typingUpdateUserAction: PropTypes.func,
	updateUserAction: PropTypes.func,
	emptyErrorsUserUpdateAction: PropTypes.func,

	typingUpdateUserState: PropTypes.object,
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

export default connect(mapStateToProps, { typingUpdateUserAction, updateUserAction, emptyErrorsUserUpdateAction })(SettingsProfile);
