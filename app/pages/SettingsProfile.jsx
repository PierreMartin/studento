import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { typingUpdateUserAction } from '../actions/userMe';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Header, Form } from 'semantic-ui-react';


const optionsPosition = [
	{ key: 's', text: 'Student', value: 'student' },
	{ key: 'w', text: 'Worker', value: 'worker' }
];

const optionsCountry = [
	{ key: 'fr', text: 'France', value: 'france', flag: 'fr' },
	{ key: 'ge', text: 'Germany', value: 'germany', flag: 'de' },
	{ key: 'gr', text: 'Greece', value: 'greece', flag: 'gr' },
	{ key: 'us', text: 'United States', value: 'unitedstates', flag: 'us' }
];

const optionsGender = [
	{ key: 'm', text: 'Male', value: 'male' },
	{ key: 'f', text: 'Female', value: 'female' }
];


// Birthdate :
const optionsDay = [];
for (let i = 1; i <= 31; i++) {
	optionsDay.push({key: i + '', text: i + '', value: i});
}

const optionsMonth = [];
for (let j = 1; j <= 12; j++) {
	optionsMonth.push({key: j + '', text: j + '', value: j});
}

const optionsYear = [];
for (let k = 1930; k <= 2012; k++) {
	optionsYear.push({key: k + '', text: k + '', value: k});
}


class SettingsProfile extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	getMetaData() {
		return {
			title: 'Settings Profile',
			meta: [{ name: 'description', content: 'Settings Profile...' }],
			link: []
		};
	}

	handleInputChange(event, field) {
		this.props.typingUpdateUserAction(field.name, field.value);
	}

	handleOnSubmit(event) {
		event.preventDefault();
		// const data = {};

		// updateUserAction(data, _id);
	}

	render() {
		const { userMe, typingUpdateUserState } = this.props;
		console.log(typingUpdateUserState);

		// (typeof typingUpdateUserState.username !== 'undefined' && typingUpdateUserState.username !== '') ? typingUpdateUserState.username : userMe.username

		return (
			<LayoutPage {...this.getMetaData()}>
				<h4>Settings Profile</h4>

				<Form size="small" onSubmit={this.handleOnSubmit}>
					<Form.Input required label="Username" placeholder="Username" name="username" value={userMe.username} onChange={this.handleInputChange} />

					<Form.Select label="Job / current position" options={optionsPosition} placeholder="Job / current position" name="position" onChange={this.handleInputChange} />
					<Form.Input label="Domain of studing / working" placeholder="Domain of studing / working" name="domain" onChange={this.handleInputChange} />
					<Form.Input label="University / School" placeholder="University / School" name="schoolName" onChange={this.handleInputChange} />

					<Form.Group widths="equal">
						<Form.Input label="First name" placeholder="First name" name="firstName" onChange={this.handleInputChange} />
						<Form.Input label="Last name" placeholder="Last name" name="lastName" onChange={this.handleInputChange} />
					</Form.Group>

					<Form.Select label="Gender" options={optionsGender} placeholder="Gender" name="gender" onChange={this.handleInputChange} />

					<Form.Group>
						<Form.Select label="Country" options={optionsCountry} placeholder="Country" width={8} name="country" onChange={this.handleInputChange} />
						<Form.Input label="City" placeholder="City" width={8} name="city" onChange={this.handleInputChange} />
					</Form.Group>

					{/* TODO Birthdate ca dans un component */}
					<Segment>
						<Header as="h4" icon="birthday" content="Birthdate" />
						<Form.Group widths="equal">
							<Form.Select label="Day" options={optionsDay} placeholder="Day" width={8} name="birthDateDay" onChange={this.handleInputChange} />
							<Form.Select label="Month" options={optionsMonth} placeholder="Month" width={8} name="birthDateMonth" onChange={this.handleInputChange} />
						</Form.Group>
						<Form.Select label="Year" options={optionsYear} placeholder="Year" width={16} name="birthdateYear" onChange={this.handleInputChange} />
					</Segment>

					<Form.TextArea label="About" placeholder="Tell us more about you..." name="about" onChange={this.handleInputChange} />

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

export default connect(mapStateToProps, { typingUpdateUserAction })(SettingsProfile);
