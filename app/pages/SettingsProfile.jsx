import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { typingUpdateUserAction, updateUserAction } from '../actions/userMe';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Header, Form } from 'semantic-ui-react';


class SettingsProfile extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
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

		// Birthdate :
		const day = [];
		for (let i = 1; i <= 31; i++) {
			day.push({key: i + '', text: i + '', value: i});
		}
		options.day = day;

		const month = [];
		for (let j = 1; j <= 12; j++) {
			month.push({key: j + '', text: j + '', value: j});
		}
		options.month = month;

		const year = [];
		for (let k = 1930; k <= 2012; k++) {
			year.push({key: k + '', text: k + '', value: k});
		}
		options.year = year;

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
		fields.birthDateDay = ((typeof typingUpdateUserState.birthDateDay !== 'undefined') ? parseInt(typingUpdateUserState.birthDateDay, 10) : userMe.birthDateDay) || null;
		fields.birthDateMonth = ((typeof typingUpdateUserState.birthDateMonth !== 'undefined') ? parseInt(typingUpdateUserState.birthDateMonth, 10) : userMe.birthDateMonth) || null;
		fields.birthDateYear = ((typeof typingUpdateUserState.birthDateYear !== 'undefined') ? parseInt(typingUpdateUserState.birthDateYear, 10) : userMe.birthDateYear) || null;
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

	render() {
		const { userMe, typingUpdateUserState } = this.props;
		const options = this.getOptionsFormsSelect();
		const fields = this.getFieldsVal(typingUpdateUserState, userMe);

		return (
			<LayoutPage {...this.getMetaData()}>
				<h4>Settings Profile</h4>

				<Form size="small" onSubmit={this.handleOnSubmit}>
					<Form.Input required label="Username" placeholder="Username" name="username" value={fields.username || ''} onChange={this.handleInputChange} />

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

					{/* TODO Birthdate ca dans un component */}
					<Segment>
						<Header as="h4" icon="birthday" content="Birthdate" />
						<Form.Group widths="equal">
							<Form.Select label="Day" options={options.day} placeholder="Day" width={8} name="birthDateDay" value={fields.birthDateDay || ''} onChange={this.handleInputChange} />
							<Form.Select label="Month" options={options.month} placeholder="Month" width={8} name="birthDateMonth" value={fields.birthDateMonth || ''} onChange={this.handleInputChange} />
						</Form.Group>
						<Form.Select label="Year" options={options.year} placeholder="Year" width={16} name="birthDateYear" value={fields.birthDateYear || ''} onChange={this.handleInputChange} />
					</Segment>

					<Form.TextArea label="About" placeholder="Tell us more about you..." name="about" value={fields.about || ''} onChange={this.handleInputChange} />

					<Form.Button>Submit</Form.Button>
				</Form>

			</LayoutPage>
		);
	}
}

SettingsProfile.propTypes = {
	typingUpdateUserAction: PropTypes.func.isRequired,
	typingUpdateUserState: PropTypes.object,

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
		typingUpdateUserState: state.userMe.typingUpdateUserState
	};
};

export default connect(mapStateToProps, { typingUpdateUserAction, updateUserAction })(SettingsProfile);
