import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
		this.fields = [];
	}

	getMetaData() {
		return {
			title: 'Settings Profile',
			meta: [{ name: 'description', content: 'Settings Profile...' }],
			link: []
		};
	}

	handleInputChange(event) {
		this.fields.push(event.target.name);

		// this.props.typingUpdateUserAction(event.target.name, event.target.value);
	}

	handleOnSubmit(event) {
		event.preventDefault();
		// const data = {};

		// updateUserAction(data, _id);
	}

	render() {
		const { userMe } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>
				<h4>Settings Profile</h4>

				<Form size="small" onSubmit={this.handleOnSubmit}>
					<Form.Input required label="Username" placeholder="Username" value={userMe.username} onChange={this.handleInputChange} />

					<Form.Select label="Job / current position" options={optionsPosition} placeholder="Job / current position" />
					<Form.Input label="Domain of studing / working" placeholder="Domain of studing / working" />
					<Form.Input label="University / School" placeholder="University / School" />

					<Form.Group widths="equal">
						<Form.Input label="First name" placeholder="First name" />
						<Form.Input label="Last name" placeholder="Last name" />
					</Form.Group>

					<Form.Select label="Gender" options={optionsGender} placeholder="Gender" />

					<Form.Group>
						<Form.Select label="Country" options={optionsCountry} placeholder="Country" width={8} />
						<Form.Input label="City" placeholder="City" width={8} />
					</Form.Group>

					{/* TODO Birthdate ca dans un component */}
					<Segment>
						<Header as="h4" icon="birthday" content="Birthdate" />
						<Form.Group widths="equal">
							<Form.Select label="Day" options={optionsDay} placeholder="Day" width={8} />
							<Form.Select label="Month" options={optionsMonth} placeholder="Month" width={8} />
						</Form.Group>
						<Form.Select label="Year" options={optionsYear} placeholder="Year" width={16} />
					</Segment>

					<Form.TextArea label="About" placeholder="Tell us more about you..." />

					<Form.Button>Submit</Form.Button>
				</Form>

			</LayoutPage>
		);
	}
}

SettingsProfile.propTypes = {
	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		userMe: state.userMe
	};
};

export default connect(mapStateToProps, null)(SettingsProfile);

